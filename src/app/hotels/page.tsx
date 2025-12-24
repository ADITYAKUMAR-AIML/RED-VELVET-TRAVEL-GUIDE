"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, Coffee, Utensils, Waves, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { LikeButton } from "@/components/LikeButton";
import { LocationSection } from "@/components/LocationSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const INDIAN_STATES = [
  { id: "rajasthan", name: "Rajasthan", icon: "🏰" },
  { id: "kerala", name: "Kerala", icon: "🌴" },
  { id: "goa", name: "Goa", icon: "🏖️" },
  { id: "maharashtra", name: "Maharashtra", icon: "🏛️" },
  { id: "karnataka", name: "Karnataka", icon: "🛕" },
];

export default function HotelsPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hotels, setHotels] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    fetch("/api/admin/data?table=hotels")
      .then(res => res.json())
      .then(data => setHotels(data))
      .catch(err => console.error("Error fetching hotels:", err));
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredHotels = React.useMemo(() => {
    if (!searchQuery) return hotels;
    return hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, hotels]);

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getFilteredHotels = (stateId: string) => {
    const stateHotels = hotels.filter(h => h.state === stateId);
    if (!searchQuery) return stateHotels;
    return stateHotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <Badge className="mb-4 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-none">Explore India</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('luxuryStays')}</h1>
            <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('luxuryStaysDesc')}
            </p>
          </div>

          <div className="mb-12">
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

{paginatedHotels.length > 0 && (
              <section className="mb-16">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {paginatedHotels.map((hotel, idx) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link href={`/hotels/${hotel.id}`}>
                        <Card className="group overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl cursor-pointer h-full">
                            <div className="relative h-48 overflow-hidden">
                              <Image 
                                src={hotel.image_url || hotel.image} 
                                alt={hotel.name} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                              />
<LikeButton 
                              itemType="hotel" 
                              itemId={hotel.id.toString()} 
                              className="absolute top-3 right-3" 
                              size="sm" 
                            />
                            <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none text-[10px]">
                              Popular
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(hotel.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">{hotel.rating}.0</span>
                            </div>
                            <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                              <MapPin className="h-3 w-3" /> {hotel.location}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                              <div>
                                <span className="text-lg font-bold text-red-600 dark:text-red-400">{hotel.price}</span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400"> / night</span>
                              </div>
                              <Badge variant="outline" className="text-[10px] border-neutral-300 dark:border-neutral-700">
                                {hotel.type}
                              </Badge>
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

{filteredHotels.length === 0 && (
              <div className="py-24 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <Search className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('noDestinationsFound')}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">{t('noDestinationsFoundDesc')}</p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => setSearchQuery("")}
                >
                  {t('clearAllFilters')}
                </Button>
              </div>
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
