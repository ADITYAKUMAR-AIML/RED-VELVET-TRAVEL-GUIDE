"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type ItemType = "destination" | "hotel" | "package";

interface Like {
  id: string;
  user_id: string;
  item_type: ItemType;
  item_id: string;
  created_at: string;
}

interface UseLikesReturn {
  likes: Like[];
  isLiked: (itemType: ItemType, itemId: string) => boolean;
  toggleLike: (itemType: ItemType, itemId: string) => Promise<{ success: boolean; requiresAuth: boolean }>;
  isLoading: boolean;
  userId: string | null;
}

export function useLikes(): UseLikesReturn {
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndLikes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          const { data, error } = await supabase
            .from("user_likes")
            .select("*")
            .eq("user_id", user.id);

          if (!error && data) {
            setLikes(data);
          }
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLikes();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        const { data } = await supabase
          .from("user_likes")
          .select("*")
          .eq("user_id", session.user.id);
        if (data) setLikes(data);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setLikes([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isLiked = useCallback(
    (itemType: ItemType, itemId: string): boolean => {
      return likes.some(
        (like) => like.item_type === itemType && like.item_id === itemId
      );
    },
    [likes]
  );

  const toggleLike = useCallback(
    async (itemType: ItemType, itemId: string): Promise<{ success: boolean; requiresAuth: boolean }> => {
      if (!userId) {
        return { success: false, requiresAuth: true };
      }

      const existingLike = likes.find(
        (like) => like.item_type === itemType && like.item_id === itemId
      );

      try {
        if (existingLike) {
          const { error } = await supabase
            .from("user_likes")
            .delete()
            .eq("id", existingLike.id);

          if (error) throw error;

          setLikes((prev) => prev.filter((like) => like.id !== existingLike.id));
        } else {
          const { data, error } = await supabase
            .from("user_likes")
            .insert({
              user_id: userId,
              item_type: itemType,
              item_id: itemId,
            })
            .select()
            .single();

          if (error) throw error;

          setLikes((prev) => [...prev, data]);
        }

        return { success: true, requiresAuth: false };
      } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, requiresAuth: false };
      }
    },
    [userId, likes]
  );

  return {
    likes,
    isLiked,
    toggleLike,
    isLoading,
    userId,
  };
}
