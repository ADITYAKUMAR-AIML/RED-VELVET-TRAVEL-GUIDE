"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, Coffee, Utensils, Waves, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/Navbar";
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

const ITEMS_PER_PAGE = 2;
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const HOTELS = [
  {
    id: 1,
    name: "The Velvet Oasis",
    location: "Santorini, Greece",
    price: "$450",
    rating: 5,
    type: "Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    amenities: ["Free Wifi", "Breakfast", "Pool", "Spa"]
  },
  {
    id: 2,
    name: "Imperial Gardens",
    location: "Kyoto, Japan",
    price: "$380",
    rating: 5,
    type: "Boutique",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    amenities: ["Free Wifi", "Breakfast", "Zen Garden", "Tea Room"]
  },
  {
    id: 3,
    name: "Alpine Majesty Resort",
    location: "Zermatt, Switzerland",
    price: "$550",
    rating: 5,
    type: "Resort",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    amenities: ["Ski-in/Ski-out", "Spa", "Gourmet Dining", "Fireplace"]
  },
  {
    id: 4,
    name: "Azure Lagoon Retreat",
    location: "Bora Bora",
    price: "$890",
    rating: 5,
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=800&auto=format&fit=crop",
    amenities: ["Overwater Villa", "Private Beach", "Butler Service", "Diving"]
  },
  {
    id: 5,
    name: "The Grand Velvet",
    location: "Paris, France",
    price: "$620",
    rating: 5,
    type: "Boutique",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    amenities: ["Spa", "Michelin Restaurant", "Concierge", "City View"]
  }
];

export default function HotelsPage() {
  const { t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeType, setActiveType] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
  
    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery, activeType]);
  
    const filteredHotels = HOTELS.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || hotel.type === activeType;
      return matchesSearch && matchesType;
    });

    const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
    const paginatedHotels = filteredHotels.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  if (!mounted) return null;

  const hotelTypes = ["All", "Resort", "Boutique", "Luxury"];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('luxuryStays')}</h1>
            <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('luxuryStaysDesc')}
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
              {hotelTypes.map((type) => (
                <Badge 
                  key={type}
                  variant={activeType === type ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${
                    activeType === type 
                      ? "bg-red-600 text-white border-red-600" 
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                  onClick={() => setActiveType(type)}
                >
                  {type === "All" ? t('all') : type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {paginatedHotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/hotels/${hotel.id}`}>
                    <Card className="group overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-2xl cursor-pointer">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-64 w-full md:h-auto md:w-2/5">
                          <Image 
                            src={hotel.image} 
                            alt={hotel.name} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-8">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[...Array(hotel.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <Badge variant="outline" className="border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">
                              {t('recommended')}
                            </Badge>
                          </div>
                          <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{hotel.name}</h3>
                          <div className="mb-6 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                            <MapPin className="h-4 w-4" /> {hotel.location}
                          </div>
                          
                          <div className="mb-8 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                              <Wifi className="h-4 w-4 text-red-800 dark:text-red-500" /> Wifi
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                              <Coffee className="h-4 w-4 text-red-800 dark:text-red-500" /> Breakfast
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                              <Waves className="h-4 w-4 text-red-800 dark:text-red-500" /> Pool
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                              <Utensils className="h-4 w-4 text-red-800 dark:text-red-500" /> Dining
                            </div>
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
                            <div>
                              <p className="text-sm font-bold text-red-900 dark:text-red-400">{hotel.price}</p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('perNight')}</p>
                            </div>
                            <Button className={`${RED_VELVET_GRADIENT} rounded-xl text-white`}>
                              {t('bookStay')}
                            </Button>
                          </div>
                        </div>
                      </div>
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
                onClick={() => { setSearchQuery(""); setActiveType("All"); }}
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
