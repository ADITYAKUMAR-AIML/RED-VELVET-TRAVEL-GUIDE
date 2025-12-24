"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Gift, Sparkles, Search, ChevronRight, Star } from "lucide-react";
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

export default function PackagesPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [packages, setPackages] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    fetch("/api/admin/data?table=packages")
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Error fetching packages:", err));
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPackages = React.useMemo(() => {
    if (!searchQuery) return packages;
    return packages.filter(tour => 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, packages]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getFilteredTours = (stateId: string) => {
    const stateTours = packages.filter(p => p.state === stateId);
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

          <div className="mt-24">
            <LocationSection 
              title="Explore Kerala"
              subtitle="Unwind in God's Own Country with serene backwaters and tea-covered hills."
              location="Kerala"
              type="package"
              href="/packages?location=Kerala"
            />

            <LocationSection 
              title="Explore Rajasthan"
              subtitle="Experience royal hospitality in the land of kings with our curated heritage tours."
              location="Rajasthan"
              type="package"
              href="/packages?location=Rajasthan"
            />

            <LocationSection 
              title="Explore Goa"
              subtitle="Beyond the beaches: discover the colonial history and lush landscapes of Goa."
              location="Goa"
              type="package"
              href="/packages?location=Goa"
            />

            <LocationSection 
              title="Historic Hampi"
              subtitle="Step back in time at the ruins of the Vijayanagara Empire, a UNESCO World Heritage site."
              location="Hampi"
              type="package"
              href="/packages?location=Hampi"
            />
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
