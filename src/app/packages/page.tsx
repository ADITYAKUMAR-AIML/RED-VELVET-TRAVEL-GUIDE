"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Gift, Sparkles, Search, ChevronRight, Heart, Star } from "lucide-react";
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

const ITEMS_PER_PAGE = 8;
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const INDIAN_STATES = [
  { id: "rajasthan", name: "Rajasthan", icon: "🏰" },
  { id: "kerala", name: "Kerala", icon: "🌴" },
  { id: "goa", name: "Goa", icon: "🏖️" },
  { id: "maharashtra", name: "Maharashtra", icon: "🏛️" },
  { id: "karnataka", name: "Karnataka", icon: "🛕" },
];

const TOURS_BY_STATE: Record<string, any[]> = {
  rajasthan: [
    {
      id: 101,
      title: "Royal Rajasthan Heritage Tour",
      destination: "Jaipur, Udaipur & Jodhpur",
      price: "₹45,000",
      duration: "7 Days",
      groupSize: "Up to 8",
      rating: 4.9,
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop",
      features: ["Palace Tours", "Desert Safari", "Cultural Shows"]
    },
    {
      id: 102,
      title: "Jaipur Pink City Explorer",
      destination: "Jaipur, Rajasthan",
      price: "₹18,000",
      duration: "3 Days",
      groupSize: "Up to 12",
      rating: 4.8,
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop",
      features: ["Amber Fort", "City Palace", "Local Markets"]
    },
    {
      id: 103,
      title: "Desert Nights Jaisalmer",
      destination: "Jaisalmer, Rajasthan",
      price: "₹25,000",
      duration: "4 Days",
      groupSize: "Up to 6",
      rating: 4.7,
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1545126178-862cdb469409?q=80&w=800&auto=format&fit=crop",
      features: ["Camel Safari", "Desert Camp", "Fort Visit"]
    },
    {
      id: 104,
      title: "Lakes & Palaces Udaipur",
      destination: "Udaipur, Rajasthan",
      price: "₹22,000",
      duration: "4 Days",
      groupSize: "2 Persons",
      rating: 4.9,
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=800&auto=format&fit=crop",
      features: ["Lake Pichola Cruise", "City Palace", "Romantic Dinner"]
    },
  ],
  kerala: [
    {
      id: 201,
      title: "Kerala Backwaters Bliss",
      destination: "Alleppey & Kumarakom",
      price: "₹35,000",
      duration: "5 Days",
      groupSize: "2-4 Persons",
      rating: 4.9,
      state: "kerala",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
      features: ["Houseboat Stay", "Ayurveda Spa", "Village Tour"]
    },
    {
      id: 202,
      title: "Munnar Tea Garden Retreat",
      destination: "Munnar, Kerala",
      price: "₹22,000",
      duration: "4 Days",
      groupSize: "Up to 6",
      rating: 4.8,
      state: "kerala",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop",
      features: ["Tea Plantation Tour", "Trekking", "Wildlife Spotting"]
    },
    {
      id: 203,
      title: "Thekkady Wildlife Safari",
      destination: "Thekkady, Kerala",
      price: "₹28,000",
      duration: "4 Days",
      groupSize: "Up to 8",
      rating: 4.7,
      state: "kerala",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
      features: ["Periyar Safari", "Spice Garden", "Bamboo Rafting"]
    },
    {
      id: 204,
      title: "Kovalam Beach Escape",
      destination: "Kovalam, Kerala",
      price: "₹20,000",
      duration: "3 Days",
      groupSize: "2 Persons",
      rating: 4.6,
      state: "kerala",
      image: "https://images.unsplash.com/photo-1590123825626-1c2c9b2d7c90?q=80&w=800&auto=format&fit=crop",
      features: ["Beach Resort", "Ayurveda", "Lighthouse Visit"]
    },
  ],
  goa: [
    {
      id: 301,
      title: "Goa Beach Party Package",
      destination: "North Goa",
      price: "₹18,000",
      duration: "4 Days",
      groupSize: "Up to 10",
      rating: 4.7,
      state: "goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
      features: ["Beach Hopping", "Nightlife", "Water Sports"]
    },
    {
      id: 302,
      title: "Heritage Goa Explorer",
      destination: "Old Goa & Panjim",
      price: "₹15,000",
      duration: "3 Days",
      groupSize: "Up to 12",
      rating: 4.8,
      state: "goa",
      image: "https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=800&auto=format&fit=crop",
      features: ["Church Tours", "Portuguese Heritage", "Local Cuisine"]
    },
    {
      id: 303,
      title: "South Goa Serenity",
      destination: "South Goa",
      price: "₹25,000",
      duration: "5 Days",
      groupSize: "2 Persons",
      rating: 4.9,
      state: "goa",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
      features: ["Private Beach", "Spa Retreat", "Sunset Cruise"]
    },
    {
      id: 304,
      title: "Goa Adventure Sports",
      destination: "Goa",
      price: "₹22,000",
      duration: "4 Days",
      groupSize: "Up to 8",
      rating: 4.6,
      state: "goa",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
      features: ["Scuba Diving", "Parasailing", "Jet Skiing"]
    },
  ],
  maharashtra: [
    {
      id: 401,
      title: "Mumbai City Heritage Walk",
      destination: "Mumbai, Maharashtra",
      price: "₹12,000",
      duration: "2 Days",
      groupSize: "Up to 15",
      rating: 4.7,
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
      features: ["Gateway of India", "Street Food Tour", "Bollywood Tour"]
    },
    {
      id: 402,
      title: "Lonavala Hill Station Retreat",
      destination: "Lonavala, Maharashtra",
      price: "₹15,000",
      duration: "3 Days",
      groupSize: "Up to 8",
      rating: 4.6,
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop",
      features: ["Waterfalls", "Caves", "Adventure Activities"]
    },
    {
      id: 403,
      title: "Ajanta Ellora Heritage",
      destination: "Aurangabad, Maharashtra",
      price: "₹20,000",
      duration: "3 Days",
      groupSize: "Up to 12",
      rating: 4.9,
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1590123825626-1c2c9b2d7c90?q=80&w=800&auto=format&fit=crop",
      features: ["UNESCO Sites", "Cave Paintings", "History Tours"]
    },
    {
      id: 404,
      title: "Mahabaleshwar Getaway",
      destination: "Mahabaleshwar, Maharashtra",
      price: "₹18,000",
      duration: "3 Days",
      groupSize: "Up to 6",
      rating: 4.7,
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
      features: ["Strawberry Farms", "Valley Views", "Boating"]
    },
  ],
  karnataka: [
    {
      id: 501,
      title: "Bengaluru Tech & Culture",
      destination: "Bengaluru, Karnataka",
      price: "₹14,000",
      duration: "3 Days",
      groupSize: "Up to 10",
      rating: 4.6,
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
      features: ["Palace Visit", "Craft Beer Tour", "Street Food"]
    },
    {
      id: 502,
      title: "Coorg Coffee Trail",
      destination: "Coorg, Karnataka",
      price: "₹28,000",
      duration: "4 Days",
      groupSize: "2-4 Persons",
      rating: 4.9,
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1600100397608-e0c91c249fdd?q=80&w=800&auto=format&fit=crop",
      features: ["Coffee Plantation", "Waterfall Trek", "Tibetan Camp"]
    },
    {
      id: 503,
      title: "Hampi Heritage Explorer",
      destination: "Hampi, Karnataka",
      price: "₹18,000",
      duration: "3 Days",
      groupSize: "Up to 12",
      rating: 4.8,
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop",
      features: ["UNESCO Ruins", "Boulder Climbing", "Sunset Points"]
    },
    {
      id: 504,
      title: "Mysore Royal Experience",
      destination: "Mysore, Karnataka",
      price: "₹22,000",
      duration: "4 Days",
      groupSize: "Up to 8",
      rating: 4.8,
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
      features: ["Palace Tour", "Brindavan Gardens", "Silk Shopping"]
    },
  ],
};

const PACKAGES = Object.values(TOURS_BY_STATE).flat();

export default function PackagesPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPackages = React.useMemo(() => {
    if (!searchQuery) return PACKAGES;
    return PACKAGES.filter(tour => 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getFilteredTours = (stateId: string) => {
    const stateTours = TOURS_BY_STATE[stateId] || [];
    if (!searchQuery) return stateTours;
    return stateTours.filter(tour => 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('curatedTourPackages')}</h1>
            <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('curatedTourPackagesDesc')}
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

{paginatedPackages.length > 0 && (
              <section className="mb-16">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {paginatedPackages.map((tour, idx) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link href={`/packages/${tour.id}`}>
                        <Card className="group overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl cursor-pointer h-full">
                          <div className="relative h-48 overflow-hidden">
                            <Image 
                              src={tour.image} 
                              alt={tour.title} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-neutral-900/80 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors">
                              <Heart className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
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

{filteredPackages.length === 0 && (
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
