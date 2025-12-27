"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LikeButtonProps {
  initialLiked?: boolean;
  onToggle?: (liked: boolean) => void;
  className?: string;
  itemId?: string | number;
  itemType?: string;
  size?: "default" | "sm" | "icon";
}

export function LikeButton({ 
  initialLiked = false, 
  onToggle, 
  className,
  itemId,
  itemType,
  size = "icon"
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const { user } = useAuth();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    onToggle?.(newLiked);
    
    if (newLiked) {
      toast.success("Added to favorites");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hover:bg-transparent", className)}
      onClick={handleToggle}
    >
      <motion.div
        initial={false}
        animate={{ scale: liked ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Heart
          className={cn(
            "h-6 w-6 transition-colors duration-300",
            liked ? "fill-red-500 text-red-500" : "text-white fill-black/20"
          )}
        />
      </motion.div>
    </Button>
  );
}
