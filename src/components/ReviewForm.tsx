"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";

import { toast } from "sonner";

interface ReviewFormProps {
  itemId: string;
  itemType: string;
  onSuccess: () => void;
}

export function ReviewForm({ itemId, itemType, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('loginToReview') || "Please log in to share your experience.");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error(t('reviewTooShort') || "Review must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        user_email: user.email || 'Anonymous',
        item_id: itemId,
        item_type: itemType,
        rating,
        comment: comment.trim(),
      });

      if (error) throw error;

      toast.success(t('reviewSubmitted') || "Thank you! Your review has been submitted.");
      setComment("");
      setRating(5);
      onSuccess();
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(t('reviewError') || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
      <h4 className="text-lg font-bold">{t('writeAReview') || 'Write a Review'}</h4>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-600"
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder={t('reviewPlaceholder') || "Share your experience..."}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="min-h-[100px] rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"
      >
        {loading ? (t('submitting') || "Submitting...") : (t('submitReview') || "Submit Review")}
      </Button>
    </form>
  );
}
