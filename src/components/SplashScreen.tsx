"use client";

import React from "react";
import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="flex items-center gap-4 md:gap-8">
        <motion.span 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-5xl font-black tracking-tighter text-red-500"
        >
          ORCHIDS
        </motion.span>
        
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="w-[2px] h-10 md:h-16 bg-red-500 origin-center"
        />
        
        <motion.span 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-5xl font-black tracking-tighter text-gray-500"
        >
          TRAVEL
        </motion.span>
      </div>
    </motion.div>
  );
}
