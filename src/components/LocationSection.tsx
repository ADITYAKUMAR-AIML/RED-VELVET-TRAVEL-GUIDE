"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import { useLanguage } from "@/context/LanguageContext";

export function LocationSection({ 
  title, 
  subtitle, 
  location, 
  type, 
  href 
}: { 
  title: string; 
  subtitle: string; 
  location: string; 
  type: 'hotel' | 'destination' | 'package'; 
  href: string;
}) {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/${type}s/featured?location=${encodeURIComponent(location)}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure we have 8 items for the carousel as requested
          setItems(data.slice(0, 8));
        }
      } catch (error) {
        console.error(`Error fetching ${type}s for ${location}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [location, type]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900">
      <div className="container mx-auto px-6 text-left">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2 text-neutral-900 dark:text-white">{title}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">{subtitle}</p>
          </div>
          <Link href={href}>
            <Button variant="ghost" size="sm" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
              {t('viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

          <div className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[200px] lg:min-w-[calc(16.666%-10px)] aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
              ))
            ) : (
              items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.02 }}
                  className="min-w-[160px] sm:min-w-[200px] lg:min-w-[calc(16.666%-10px)] snap-start"
                >
                  <Link href={`/${type}s/${item.id}`}>
                    <div className="group cursor-pointer h-full flex flex-col">
                      <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.name || item.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <LikeButton 
                          itemType={type} 
                          itemId={item.id} 
                          className="absolute top-1.5 right-1.5 shadow-sm scale-75 sm:scale-90" 
                          size="sm"
                        />
                        {type === 'package' && item.duration && (
                          <div className="absolute top-1.5 left-1.5 bg-white/95 dark:bg-neutral-900/95 px-1.5 py-0.5 rounded text-[8px] font-extrabold shadow-sm uppercase tracking-tighter">
                            {item.duration}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-neutral-900 dark:text-neutral-50 text-[11px] sm:text-xs line-clamp-1 group-hover:text-red-600 transition-colors">
                            {item.name || item.title}
                          </h3>
                          {(type === 'hotel' || type === 'destination') && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                              <span className="text-[9px] text-neutral-500">{item.rating || '5'}.0</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400">
                          <MapPin className="h-2.5 w-2.5" /> {item.location || item.country || item.destination}
                        </div>
                        <div className="pt-0.5 flex items-center justify-between">
                          <span className="text-[11px] sm:text-xs font-bold text-neutral-900 dark:text-white">
                            {item.price}
                          </span>
                          <span className="text-[8px] text-neutral-500 uppercase tracking-tighter">
                            {type === 'hotel' ? `/ ${t('perNight')}` : t('allInclusive')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
      </div>
    </section>
  );
}
