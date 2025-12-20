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
          .maybeSingle(); // Use maybeSingle to avoid 406 errors on single() when not found

        if (error) {
          console.error('Error fetching profile:', error);
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchProfile(userId, retries - 1);
          }
          return null;
        }
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    }, []);

  const syncProfileWithAuth = useCallback(async (user: User): Promise<Profile | null> => {
    try {
      const userProfile = await fetchProfile(user.id);
      
      // Get user metadata for fallback values
      const userMetadata = user.user_metadata || {};
      const fullName = userMetadata.full_name || userMetadata.name || 
                       userProfile?.full_name || 'Traveler';
      const avatarUrl = userMetadata.avatar_url || userProfile?.avatar_url;
      const email = user.email || userProfile?.email;

      // Prepare profile data
      const profileData = {
        id: user.id,
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      };

      // Upsert the profile
      const { data: syncedProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error syncing profile:', error);
        return userProfile; // Return existing profile if upsert fails
      }

      return syncedProfile;
    } catch (error) {
      console.error('Error in syncProfileWithAuth:', error);
      return null;
    }
  }, [fetchProfile]);

    const handleAuthChange = useCallback(async (session: Session | null, event?: string) => {
      // Don't show global loading if we're just syncing profile in the background
      // unless it's the initial initialization
      if (!initialized) setLoading(true);
      
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
        setLoading(false);
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