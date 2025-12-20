"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { LikeButton } from "@/components/LikeButton";
import { LocationSection } from "@/components/LocationSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { FEATURED_DESTINATIONS } from "@/lib/data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

function DestinationsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [activeTag, setActiveTag] = React.useState("All");
  const [mounted, setMounted] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTag]);

  const allTags = React.useMemo(() => {
    const tags = new Set(FEATURED_DESTINATIONS.map(d => d.tag));
    return ["All", ...Array.from(tags).sort()];
  }, []);
  
  const filteredDestinations = FEATURED_DESTINATIONS.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === "All" || d.tag === activeTag;
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!mounted) return null;

  const tagTranslations: Record<string, string> = {
    "All": t('all'),
    "Romantic": t('romantic'),
    "Adventure": t('adventure'),
    "Cultural": t('cultural'),
    "Tropical": t('tropical'),
    "Luxury": t('luxury'),
    "Historic": t('historic') || "Historic",
    "Heritage": t('heritage') || "Heritage",
    "Nature": t('nature') || "Nature",
    "Coastal": t('coastal') || "Coastal",
    "Urban": t('urban') || "Urban",
    "Spiritual": t('spiritual') || "Spiritual",
    "Modern": t('modern') || "Modern",
    "Scenic": t('scenic') || "Scenic",
    "Vibrant": t('vibrant') || "Vibrant",
    "Winter": t('winter') || "Winter",
    "Wildlife": t('wildlife') || "Wildlife"
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-neutral-900 dark:text-neutral-50">{t('destinations')}</h1>
            <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
              Discover the world's most beautiful locations, from serene beaches to majestic mountains. 
              Each journey is crafted for absolute luxury and unforgettable memories.
            </p>
          </div>

          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input 
                placeholder={t('searchPlaceholder')}
                className="pl-12 py-6 text-lg rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:border-red-600 focus:ring-red-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {allTags.slice(0, 7).map((tag) => (
                <Badge 
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${
                    activeTag === tag 
                      ? "bg-red-600 text-white border-red-600" 
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tagTranslations[tag] || tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {paginatedDestinations.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                    <Link href={`/destinations/${item.id}`}>
                      <Card className="group h-full max-w-[350px] mx-auto overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl">
                        <div className="h-48 relative overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <LikeButton 
                            itemType="destination" 
                            itemId={item.id} 
                            className="absolute top-3 right-3" 
                            size="sm" 
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-600 text-white border-none text-[10px] px-2 py-0.5">
                              {tagTranslations[item.tag] || item.tag}
                            </Badge>
                          </div>
                        </div>
                      <CardContent className="p-4">
                        <h3 className="mb-2 text-base font-bold text-neutral-900 dark:text-neutral-50 line-clamp-1 group-hover:text-red-600 transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                          <MapPin className="h-3 w-3" /> {item.country}
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700 rounded-lg text-[10px] h-8 px-3 w-full">
                            {t('viewDetails')} <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {filteredDestinations.length === 0 && (
            <div className="py-24 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <Search className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('noDestinationsFound')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{t('noDestinationsFoundDesc')}</p>
              <Button 
                variant="outline" 
                className="mt-6 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => { setSearchQuery(""); setActiveTag("All"); }}
              >
                {t('clearAllFilters')}
              </Button>
            </div>
              )}
          </div>

          <div className="mt-24">
            <LocationSection 
              title="Explore Rajasthan"
              subtitle="Discover the land of kings, from the pink city of Jaipur to the golden sands of Jaisalmer."
              location="Rajasthan"
              type="destination"
              href="/destinations?location=Rajasthan"
            />

            <LocationSection 
              title="Explore Kerala"
              subtitle="Experience God's Own Country with its peaceful backwaters and lush tea plantations."
              location="Kerala"
              type="destination"
              href="/destinations?location=Kerala"
            />

            <LocationSection 
              title="Explore Ladakh"
              subtitle="Adventure awaits in the high-altitude desert of the Himalayas."
              location="Leh"
              type="destination"
              href="/destinations?location=Leh"
            />

            <LocationSection 
              title="Explore Goa"
              subtitle="From sun-kissed beaches to vibrant nightlife, discover the best of India's coastal paradise."
              location="Goa"
              type="destination"
              href="/destinations?location=Goa"
            />
          </div>
        </main>

    <footer className="bg-neutral-950 py-10 text-neutral-400 text-center text-sm border-t border-neutral-800">
      <div className="container mx-auto px-6">
        <p>© {new Date().getFullYear()} Orchids Travel. All rights reserved.</p>
      </div>
    </footer>
  </div>
);
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="animate-pulse text-neutral-500">Loading...</div>
      </div>
    }>
      <DestinationsContent />
    </Suspense>
  );
}
