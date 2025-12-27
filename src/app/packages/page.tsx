"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Gift, Sparkles, Search, ChevronRight, Star, Map as MapIcon, LayoutGrid, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { LikeButton } from "@/components/LikeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { LeafletMap } from "@/components/LeafletMap";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const INDIAN_STATES = [
  { name: "All", emoji: "🌏" },
  { name: "Andhra Pradesh", emoji: "🎡" },
  { name: "Arunachal Pradesh", emoji: "🏔️" },
  { name: "Assam", emoji: "☕" },
  { name: "Bihar", emoji: "🕉️" },
  { name: "Chhattisgarh", emoji: "🌳" },
  { name: "Goa", emoji: "🏖️" },
  { name: "Gujarat", emoji: "🦁" },
  { name: "Haryana", emoji: "🌾" },
  { name: "Himachal Pradesh", emoji: "🏂" },
  { name: "Jharkhand", emoji: "⛰️" },
  { name: "Karnataka", emoji: "🐘" },
  { name: "Kerala", emoji: "🛶" },
  { name: "Madhya Pradesh", emoji: "🐯" },
  { name: "Maharashtra", emoji: "🕌" },
  { name: "Manipur", emoji: "🌸" },
  { name: "Meghalaya", emoji: "☁️" },
  { name: "Mizoram", emoji: "🎋" },
  { name: "Nagaland", emoji: "🎭" },
  { name: "Odisha", emoji: "🛕" },
  { name: "Punjab", emoji: "🚜" },
  { name: "Rajasthan", emoji: "🏰" },
  { name: "Sikkim", emoji: "🧘" },
  { name: "Tamil Nadu", emoji: "🏛️" },
  { name: "Telangana", emoji: "🕍" },
  { name: "Tripura", emoji: "🏰" },
  { name: "Uttar Pradesh", emoji: "🕌" },
  { name: "Uttarakhand", emoji: "🏔️" },
  { name: "West Bengal", emoji: "🐅" },
  { name: "Andaman and Nicobar Islands", emoji: "🏝️" },
  { name: "Chandigarh", emoji: "🏙️" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", emoji: "🌳" },
  { name: "Delhi", emoji: "🗼" },
  { name: "Jammu and Kashmir", emoji: "❄️" },
  { name: "Ladakh", emoji: "🏔️" },
  { name: "Lakshadweep", emoji: "🐚" },
  { name: "Puducherry", emoji: "🥖" }
];

export default function PackagesPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedState, setSelectedState] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [packages, setPackages] = React.useState<any[]>([]);
  const [isMapView, setIsMapView] = React.useState(false);
  const [hoveredId, setHoveredId] = React.useState<string | number | null>(null);

  React.useEffect(() => {
    setMounted(true);
    fetch("/api/admin/data?table=packages")
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Error fetching packages:", err));
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState]);

  const filteredPackages = React.useMemo(() => {
    let result = packages;
    if (selectedState !== "All") {
      result = result.filter(p => p.state === selectedState || p.destination?.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (searchQuery) {
      result = result.filter(tour => 
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [searchQuery, packages, selectedState]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('curatedTourPackages')}</h1>
              <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
                {t('curatedTourPackagesDesc')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={!isMapView ? "default" : "outline"}
                onClick={() => setIsMapView(false)}
                className="rounded-xl px-6 h-12"
              >
                <LayoutGrid className="mr-2 h-5 w-5" /> Grid
              </Button>
              <Button 
                variant={isMapView ? "default" : "outline"}
                onClick={() => setIsMapView(true)}
                className="rounded-xl px-6 h-12"
              >
                <MapIcon className="mr-2 h-5 w-5" /> Map
              </Button>
            </div>
          </div>

          <div className="mb-12 space-y-6">
            <div className="overflow-x-auto pb-2 no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {INDIAN_STATES.map((state) => (
                  <Button
                    key={state.name}
                    variant={selectedState === state.name ? "default" : "outline"}
                    className={`rounded-full px-5 py-2 h-auto transition-all text-sm font-medium ${
                      selectedState === state.name 
                        ? "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-md" 
                        : "border-neutral-200 dark:border-neutral-800 hover:border-red-600 hover:text-red-600 bg-white dark:bg-neutral-900"
                    }`}
                    onClick={() => setSelectedState(state.name)}
                    onDoubleClick={() => setSelectedState("All")}
                  >
                    <span className="mr-2">{state.emoji}</span>
                    {state.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input 
                placeholder={t('searchPlaceholder')}
                className="pl-12 py-6 text-lg rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:border-red-600 focus:ring-red-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <Search className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('noDestinationsFound')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{t('noDestinationsFoundDesc')}</p>
              <Button 
                variant="outline" 
                className="mt-6 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => { setSearchQuery(""); setSelectedState("All"); }}
              >
                {t('clearAllFilters')}
              </Button>
            </div>
          ) : isMapView ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
              <div className="overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                  {paginatedPackages.map((tour) => (
                    <div 
                      key={tour.id}
                      onMouseEnter={() => setHoveredId(tour.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <Link href={`/packages/${tour.id}`}>
                        <Card className={`group overflow-hidden border transition-all hover:shadow-lg ${hoveredId === tour.id ? 'border-red-500 shadow-md ring-1 ring-red-500' : 'border-neutral-200 dark:border-neutral-800'}`}>
                          <div className="h-32 relative overflow-hidden">
                            <Image 
                              src={tour.image_url || tour.image} 
                              alt={tour.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="text-sm font-bold truncate group-hover:text-red-600 transition-colors">{tour.title}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                                <MapPin className="h-2 w-2" /> {tour.destination}
                              </p>
                              <span className="text-[10px] font-bold text-red-600">{tour.price}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-full rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800">
                <LeafletMap 
                  markers={paginatedPackages}
                  selectedId={hoveredId}
                />
              </div>
            </div>
          ) : (
            <section className="mb-16">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {paginatedPackages.map((tour, idx) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    onMouseEnter={() => setHoveredId(tour.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Link href={`/packages/${tour.id}`}>
                      <Card className="group max-w-[350px] mx-auto overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl cursor-pointer h-full">
                        <div className="relative h-48 overflow-hidden">
                          <Image 
                            src={tour.image_url || tour.image} 
                            alt={tour.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <LikeButton 
                            itemType="package" 
                            itemId={tour.id.toString()} 
                            className="absolute top-3 right-3" 
                            size="sm" 
                          />
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none text-[10px]">
                            Popular
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors text-sm">
                            {tour.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {tour.duration}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {tour.groupSize}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{tour.rating}</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                            <div>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">From </span>
                              <span className="text-lg font-bold text-red-600 dark:text-red-400">{tour.price}</span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            className="cursor-pointer"
                          >
                            {page}
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
            </section>
          )}
        </div>
      </main>

      <footer className="bg-neutral-950 py-10 text-white/50 text-center text-sm border-t border-neutral-800">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Orchids Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
