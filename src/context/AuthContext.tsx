"use client";

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

    const fetchProfile = useCallback(async (userId: string, retries = 3): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          // If the error is PGRST116 (JSON object requested, multiple (or no) rows returned), it's handled by maybeSingle
          // But other errors like permission denied (401/403) should be noted
          if (error.code !== 'PGRST116') {
             console.warn('Error fetching profile (might be RLS or missing table):', error.message);
          }
          
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchProfile(userId, retries - 1);
          }
          return null;
        }
        return data;
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
      }
    }, []);

  const syncProfileWithAuth = useCallback(async (user: User): Promise<Profile | null> => {
    try {
      // 1. Try to fetch existing profile first
      let userProfile = await fetchProfile(user.id);
      
      // If we found a profile, we might not need to upsert immediately unless data is missing
      if (userProfile && userProfile.full_name) {
         return userProfile;
      }

      // 2. If no profile or missing name, prepare data from metadata
      const userMetadata = user.user_metadata || {};
      const fullName = userMetadata.full_name || userMetadata.name || 
                       userProfile?.full_name || 'Traveler';
      const avatarUrl = userMetadata.avatar_url || userProfile?.avatar_url;
      const email = user.email || userProfile?.email;

      const profileData = {
        id: user.id,
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      };

      // 3. Try to upsert (Insert or Update)
      // This handles cases where:
      // - Profile doesn't exist (Insert)
      // - Profile exists but we want to sync metadata (Update)
      // Note: If RLS blocks this, we catch the error and return the fallback/fetched profile
      const { data: syncedProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        console.warn('Error syncing/upserting profile (ignoring if RLS prevents update):', error.message);
        // If upsert fails, return what we have (fetched profile or constructed one)
        // We construct a temporary profile object so the UI still works
        return userProfile || {
            ...profileData,
            updated_at: new Date().toISOString() 
        } as Profile;
      }

      return syncedProfile;
    } catch (error) {
      console.error('Error in syncProfileWithAuth:', error);
      // Return a temporary profile object based on user data
      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Traveler',
        avatar_url: user.user_metadata?.avatar_url,
        email: user.email,
        updated_at: new Date().toISOString()
      } as Profile;
    }
  }, [fetchProfile]);

    const handleAuthChange = useCallback(async (session: Session | null, event?: string) => {
      // Set loading to true for sign-in/sign-out events to prevent UI flicker
      // Token refreshes shouldn't trigger a full loading state
      const shouldSetLoading = !initialized || event === 'SIGNED_IN' || event === 'SIGNED_OUT';
      
      if (shouldSetLoading) setLoading(true);
      
      try {
        if (session?.user) {
          const newUser = session.user;
          setUser(newUser);
          
          // Fetch or create profile
          const userProfile = await syncProfileWithAuth(newUser);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            // Fallback to minimal profile from user metadata if sync fails
            setProfile({
              id: newUser.id,
              full_name: newUser.user_metadata?.full_name || newUser.user_metadata?.name || 'Traveler',
              avatar_url: newUser.user_metadata?.avatar_url || null,
              email: newUser.email
            });
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in handleAuthChange:', error);
        setUser(null);
        setProfile(null);
      } finally {
        if (shouldSetLoading) setLoading(false);
        setInitialized(true);
      }
    }, [syncProfileWithAuth, initialized]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (mounted) {
          await handleAuthChange(session);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (mounted) {
          // Handle all auth state changes
          await handleAuthChange(session, event);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const userProfile = await fetchProfile(user.id);
      
      if (userProfile) {
        setProfile(userProfile);
      } else if (user) {
        // If profile doesn't exist, sync it
        const syncedProfile = await syncProfileWithAuth(user);
        setProfile(syncedProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [user, fetchProfile, syncProfileWithAuth]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Auth state change handler will update the state
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if signOut fails, clear local state
      setUser(null);
      setProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      initialized,
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};