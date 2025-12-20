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

        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[280px] lg:min-w-[calc(25%-12px)] h-[350px] bg-neutral-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
            ))
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[calc(25%-12px)] snap-start"
              >
                <Link href={`/${type}s/${item.id}`}>
                  <div className="group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 shadow-sm">
                      <img 
                        src={item.image_url || item.image} 
                        alt={item.name || item.title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <LikeButton 
                        itemType={type} 
                        itemId={item.id} 
                        className="absolute top-3 right-3 shadow-md" 
                      />
                      {type === 'package' && item.duration && (
                        <div className="absolute top-3 left-3 bg-white/95 dark:bg-neutral-900/95 px-2 py-1 rounded-lg text-[10px] font-black shadow-sm uppercase tracking-wider">
                          {item.duration}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-50 text-base line-clamp-1 group-hover:text-red-600 transition-colors">
                          {item.name || item.title}
                        </h3>
                        {(type === 'hotel' || type === 'destination') && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-neutral-500">{item.rating || '5.0'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <MapPin className="h-3.5 w-3.5" /> {item.location || item.country || item.destination}
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-lg font-black text-neutral-900 dark:text-white">
                          {item.price}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                          {type === 'hotel' ? t('perNight') : t('allInclusive')}
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
