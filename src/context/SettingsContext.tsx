"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

interface Settings {
  clickSound: string; // 'none', 'soft', 'click', 'pop'
  cursorSize: number; // 1 to 2
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  clickSound: "soft",
  cursorSize: 1,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SOUND_URLS: Record<string, string> = {
  soft: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  pop: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      // 1. Try localStorage
      const local = localStorage.getItem("user_settings");
      if (local) {
        try {
          setSettings(JSON.parse(local));
        } catch (e) {
          console.error("Error parsing local settings", e);
        }
      }

      // 2. If user is logged in, try profile preferences
      if (profile?.preferences) {
        const prefs = profile.preferences as any;
        if (prefs.clickSound || prefs.cursorSize) {
          setSettings((prev) => ({
            ...prev,
            ...prefs,
          }));
        }
      }
      setIsInitialized(true);
    };

    loadSettings();
  }, [profile]);

  // Apply cursor size
  useEffect(() => {
    document.documentElement.style.setProperty("--cursor-scale", settings.cursorSize.toString());
    
    // Add global click sound listener
    const handleClick = () => {
      if (settings.clickSound !== "none" && SOUND_URLS[settings.clickSound]) {
        const audio = new Audio(SOUND_URLS[settings.clickSound]);
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Catch autoplay/interaction errors
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [settings.clickSound, settings.cursorSize]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("user_settings", JSON.stringify(updated));

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: updated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (!error) {
        await refreshProfile();
      }
    }
  }, [settings, user, refreshProfile]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <div style={{ cursor: `auto` }}>
         {/* Custom cursor implementation if native cursor scaling isn't enough, 
             but we'll stick to a CSS variable approach for now that could be used by a custom cursor component */}
         {children}
      </div>
      <style jsx global>{`
        :root {
          --cursor-scale: ${settings.cursorSize};
        }
        /* We can use a custom cursor if needed, for now let's just use the variable */
        .custom-cursor-active * {
           /* This is a placeholder for where we might apply custom cursor styles */
        }
      `}</style>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
