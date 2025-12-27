"use client";

import { useEffect, useRef } from "react";

export function ScrollVisibilityManager() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Add class to html element
      document.documentElement.classList.add("is-scrolling");

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Remove class after a delay (e.g., 1000ms)
      timeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also handle nested scrolling if necessary, though this covers window scroll
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
}
