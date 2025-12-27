"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ALL_LOCATIONS = [
  // 🇮🇳 India – States & Regions
  "Kerala", "Rajasthan", "Himachal Pradesh", "Uttarakhand", "Punjab", "Haryana",
  "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Maharashtra", "Karnataka",
  "Tamil Nadu", "Andhra Pradesh", "Telangana", "West Bengal", "Odisha",
  "Bihar", "Jharkhand", "Chhattisgarh", "Assam", "Meghalaya", "Manipur",
  "Mizoram", "Tripura", "Arunachal Pradesh", "Sikkim", "Nagaland",

  // 🇮🇳 India – Cities & Tourist Places
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Nagpur", "Nashik", "Ahmedabad", "Surat", "Vadodara",
  "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer",
  "Agra", "Mathura", "Varanasi", "Lucknow", "Kanpur",
  "Indore", "Bhopal", "Gwalior",
  "Chandigarh", "Amritsar", "Ludhiana",
  "Shimla", "Manali", "Dharamshala", "Dalhousie",
  "Dehradun", "Mussoorie", "Rishikesh", "Haridwar",
  "Goa", "Panaji",
  "Kochi", "Trivandrum", "Munnar", "Alleppey",
  "Coimbatore", "Madurai", "Ooty", "Kodaikanal",
  "Vijayawada", "Visakhapatnam", "Tirupati",
  "Patna", "Ranchi",
  "Guwahati", "Shillong", "Kaziranga",
  "Gangtok", "Darjeeling",
  "Nilgiri Hills",

  // 🌍 World – Countries / Famous Cities
  "London", "Manchester", "Edinburgh",
  "New York", "Washington DC", "Boston",
  "Los Angeles", "San Francisco", "San Diego",
  "Chicago", "Houston", "Dallas", "Miami", "Orlando",
  "Las Vegas", "Seattle", "Austin",
  "Toronto", "Vancouver", "Montreal", "Calgary",
  "Paris", "Nice", "Lyon",
  "Rome", "Milan", "Venice", "Florence",
  "Barcelona", "Madrid", "Seville",
  "Amsterdam", "Brussels",
  "Berlin", "Munich", "Frankfurt", "Hamburg",
  "Vienna", "Prague", "Budapest",
  "Zurich", "Geneva", "Bern",
  "Oslo", "Stockholm", "Copenhagen", "Helsinki",
  "Lisbon", "Porto",
  "Athens", "Santorini",
  "Istanbul", "Ankara",
  "Dubai", "Abu Dhabi", "Doha",
  "Riyadh", "Jeddah",
  "Singapore",
  "Bangkok", "Phuket",
  "Tokyo", "Osaka", "Kyoto",
  "Seoul", "Busan",
  "Hong Kong", "Macau",
  "Beijing", "Shanghai",
  "Sydney", "Melbourne", "Brisbane",
  "Auckland", "Wellington",
  "Cape Town", "Johannesburg",
  "Cairo", "Alexandria",
  "Rio de Janeiro", "São Paulo",
  "Buenos Aires",
  "Mexico City",
  "Lima"
];


export function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  icon, 
  className 
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = ALL_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      ).sort((a, b) => {
        // Boost exact starts
        const aStart = a.toLowerCase().startsWith(value.toLowerCase());
        const bStart = b.toLowerCase().startsWith(value.toLowerCase());
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.localeCompare(b);
      }).slice(0, 6);
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onChange(suggestions[activeIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {icon}
        </div>
      )}
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full py-6 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all focus:ring-2 focus:ring-red-600/20",
          icon ? "pl-12" : "pl-4",
          value && "pr-10"
        )}
      />
      
      {value && (
        <button 
          onClick={() => {
            onChange("");
            setIsOpen(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        >
          <X size={16} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-[100] overflow-hidden"
          >
            <div className="p-2">
              {suggestions.map((loc, idx) => (
                <button
                  key={loc}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3",
                    activeIndex === idx 
                      ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400" 
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  )}
                  onClick={() => {
                    onChange(loc);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
                    activeIndex === idx && "bg-red-100 dark:bg-red-900/50 text-red-600"
                  )}>
                    <MapPin size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {loc}
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                      Airport / City
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
