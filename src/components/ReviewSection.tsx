"use client";

import * as React from "react";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ReviewForm } from "./ReviewForm";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  rating: number;
  comment: string;
}

interface ReviewSectionProps {
  itemId: string;
  itemType: string;
}

export function ReviewSection({ itemId, itemType }: ReviewSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchReviews = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId, itemType]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-16 border-t border-neutral-100 pt-16 dark:border-neutral-800">
      <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-bold">{t('guestReviews') || 'Guest Reviews'}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold">{averageRating}</span>
            </div>
            <span className="text-neutral-500">({reviews.length} {t('reviewsCount') || 'reviews'})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <AnimatePresence>
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-neutral-100 p-6 dark:border-neutral-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-neutral-50">
                          {review.user_email && review.user_email.includes('@') 
                            ? review.user_email.split('@')[0] 
                            : (review.user_email || 'Traveler')}
                        </p>
                        <p className="text-xs text-neutral-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200 dark:text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">{review.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-100 py-16 text-center dark:border-neutral-800">
              <MessageSquare className="mb-4 h-12 w-12 text-neutral-300" />
              <p className="text-neutral-500">{t('noReviewsYet') || 'No reviews yet. Be the first to share your experience!'}</p>
            </div>
          )}
        </div>

        <div>
          {user ? (
            <ReviewForm itemId={itemId} itemType={itemType} onSuccess={fetchReviews} />
          ) : (
            <div className="rounded-2xl bg-neutral-50 p-6 text-center dark:bg-neutral-900">
              <h4 className="mb-4 text-lg font-bold">{t('writeAReview') || 'Write a Review'}</h4>
              <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                {t('loginToReview') || 'Please log in to share your experience with other travelers.'}
              </p>
              <a 
                href="/login" 
                className="inline-block w-full rounded-xl bg-neutral-900 py-3 font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                {t('login') || 'Log In'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
