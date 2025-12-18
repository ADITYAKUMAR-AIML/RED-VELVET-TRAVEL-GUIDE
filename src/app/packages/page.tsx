"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Gift, Sparkles, Search } from "lucide-react";
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

const ITEMS_PER_PAGE = 3;
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const PACKAGES = [
  {
    id: 1,
    title: "Honeymoon in Paradise",
    destination: "Santorini, Greece",
    price: "$2,999",
    duration: "7 Days",
    groupSize: "2 Persons",
    type: "Romantic",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
    features: ["Sunset Cruise", "Candlelight Dinner", "Luxury Suite", "Private Guide"]
  },
  {
    id: 2,
    title: "Zen Cultural Journey",
    destination: "Kyoto & Tokyo, Japan",
    price: "$3,499",
    duration: "10 Days",
    groupSize: "Up to 6 Persons",
    type: "Cultural",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    features: ["Temple Tours", "Tea Ceremony", "Bullet Train Pass", "Traditional Ryokan"]
  },
  {
    id: 3,
    title: "Alpine Adventure Plus",
    destination: "Swiss Alps, Switzerland",
    price: "$4,200",
    duration: "8 Days",
    groupSize: "Up to 4 Persons",
    type: "Adventure",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800&auto=format&fit=crop",
    features: ["Ski Passes", "Helicopter Tour", "Spa Access", "Luxury Chalet"]
  },
  {
    id: 4,
    title: "Tropical Bliss Escape",
    destination: "Bali, Indonesia",
    price: "$1,850",
    duration: "6 Days",
    groupSize: "2 Persons",
    type: "Tropical",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    features: ["Private Pool Villa", "Yoga Sessions", "Spa Treatments", "Beach Dinner"]
  },
  {
    id: 5,
    title: "Safari Wilderness Expedition",
    destination: "Serengeti, Tanzania",
    price: "$5,500",
    duration: "12 Days",
    groupSize: "Up to 8 Persons",
    type: "Adventure",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
    features: ["Game Drives", "Hot Air Balloon", "Luxury Camping", "Expert Guides"]
  },
  {
    id: 6,
    title: "Parisian Romance & Art",
    destination: "Paris, France",
    price: "$2,450",
    duration: "5 Days",
    groupSize: "2 Persons",
    type: "Romantic",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    features: ["Louvre Private Tour", "Seine Cruise", "Michelin Dinner", "Boutique Hotel"]
  },
  {
    id: 7,
    title: "Inca Trail Explorer",
    destination: "Machu Picchu, Peru",
    price: "$3,100",
    duration: "9 Days",
    groupSize: "Up to 10 Persons",
    type: "Cultural",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
    features: ["Hiking Passes", "Local Porter", "Cultural Workshops", "Train to Cusco"]
  },
  {
    id: 8,
    title: "Maldives Overwater Luxury",
    destination: "Malé, Maldives",
    price: "$6,800",
    duration: "7 Days",
    groupSize: "2 Persons",
    type: "Tropical",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop",
    features: ["Private Overwater Villa", "Diving Lessons", "Personal Butler", "All Meals Inc."]
  }
];

export default function PackagesPage() {
  const { t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeFilter, setActiveFilter] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
  
    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery, activeFilter]);
  
    const filteredPackages = PACKAGES.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || pkg.type === activeFilter;
      return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
    const paginatedPackages = filteredPackages.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  if (!mounted) return null;

  const filters = ["All", "Romantic", "Cultural", "Adventure", "Tropical"];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-none">{t('exclusiveOffers')}</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('curatedTourPackages')}</h1>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('curatedTourPackagesDesc')}
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
              {filters.map((filter) => (
                <Badge 
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${
                    activeFilter === filter 
                      ? "bg-red-600 text-white border-red-600" 
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === "All" ? t('all') : filter}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedPackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/packages/${pkg.id}`}>
                    <Card className="flex h-full flex-col overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                      <div className="relative h-64">
                        <Image 
                          src={pkg.image} 
                          alt={pkg.title} 
                          fill 
                          className="object-cover" 
                        />
                        <div className="absolute top-4 right-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur text-red-800 dark:text-red-400 shadow-lg">
                            <Sparkles className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="flex flex-1 flex-col p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-bold text-red-800 dark:text-red-400 uppercase">{pkg.destination}</p>
                          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pkg.duration}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {pkg.groupSize}</span>
                          </div>
                        </div>
                        <h3 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{pkg.title}</h3>
                        
                        <ul className="mb-8 space-y-3">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Gift className="h-4 w-4 text-red-800 dark:text-red-500" /> {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
                          <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">{t('allInclusive')}</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{pkg.price}</p>
                          </div>
                          <Button className={`${RED_VELVET_GRADIENT} rounded-xl px-8 py-6 text-white`}>
                            {t('bookNow')}
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
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
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
