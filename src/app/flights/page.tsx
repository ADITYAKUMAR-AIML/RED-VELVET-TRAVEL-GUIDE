"use client";

import * as React from "react";
import Link from "next/link";
import { Plane, PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Filter, Clock, ArrowRight, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
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

export default function FlightsPage() {
  const { t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);
    const [fromQuery, setFromQuery] = React.useState("");
    const [toQuery, setToQuery] = React.useState("");
    const [activeClass, setActiveClass] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [flights, setFlights] = React.useState<any[]>([]);
  
    React.useEffect(() => {
      setMounted(true);
      fetch("/api/admin/data?table=flights")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFlights(data);
          }
        })
        .catch(err => console.error("Error fetching flights:", err));
    }, []);

    React.useEffect(() => {
      setCurrentPage(1);
    }, [fromQuery, toQuery, activeClass]);
  
    const [isSearching, setIsSearching] = React.useState(false);

    const handleSearch = () => {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 800);
    };

    const filteredFlights = flights.filter(flight => {
      const from = flight.origin || "";
      const to = flight.destination || "";
      const matchesFrom = from.toLowerCase().includes(fromQuery.toLowerCase());
      const matchesTo = to.toLowerCase().includes(toQuery.toLowerCase());
      const matchesClass = activeClass === "All" || flight.class === activeClass;
      return matchesFrom && matchesTo && matchesClass;
    });

    const paginatedFlights = filteredFlights.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredFlights.length / ITEMS_PER_PAGE);


  if (!mounted) return null;

    const flightClasses = ["All", "Economy", "Premium Economy", "Business", "First Class"];
  
    const formatTime = (time: string) => {
      if (!time) return "12:00";
      if (time.includes("T")) {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      return time;
    };
  
    return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('flights')}</h1>
            <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('flightsDesc')}
            </p>
          </div>

            <Card className="mb-12 overflow-hidden border-none bg-neutral-50 dark:bg-neutral-900 shadow-inner">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 items-center">
                  <div className="md:col-span-4 relative">
                    <LocationAutocomplete 
                      placeholder="From (e.g. London)" 
                      value={fromQuery}
                      onChange={setFromQuery}
                      icon={<PlaneTakeoff className="h-5 w-5 text-red-600" />}
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-transform hover:rotate-180"
                      onClick={() => {
                        const temp = fromQuery;
                        setFromQuery(toQuery);
                        setToQuery(temp);
                      }}
                    >
                      <ArrowLeftRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="md:col-span-4 relative">
                    <LocationAutocomplete 
                      placeholder="To (e.g. Santorini)" 
                      value={toQuery}
                      onChange={setToQuery}
                      icon={<PlaneLanding className="h-5 w-5 text-red-600" />}
                    />
                  </div>

                    <div className="md:col-span-3">
                      <Button 
                        disabled={isSearching}
                        onClick={handleSearch}
                        className={`${RED_VELVET_GRADIENT} w-full rounded-xl py-6 text-white text-lg font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all`}
                      >
                        {isSearching ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Search className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <>
                            <Search className="mr-2 h-5 w-5" /> {t('search')}
                          </>
                        )}
                      </Button>
                    </div>

                </div>


              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-neutral-500">{t('popularCategories')}:</span>
                {flightClasses.map((cls) => (
                  <Badge 
                    key={cls}
                    variant={activeClass === cls ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 transition-all ${
                      activeClass === cls 
                        ? "bg-red-600 text-white border-red-600" 
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    }`}
                    onClick={() => setActiveClass(cls)}
                  >
                    {cls}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {paginatedFlights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/flights/${flight.id}`}>
                      <Card className="overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] group cursor-pointer">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="p-8 md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800">
                              <div className="mb-2 h-12 w-12 overflow-hidden rounded-full bg-neutral-100 p-2 group-hover:bg-red-50 transition-colors">
                                 <Plane className="h-full w-full text-red-600" />
                              </div>
                              <p className="font-bold text-neutral-900 dark:text-neutral-50">{flight.airline}</p>
                              <Badge variant="outline" className="mt-2 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400">
                                {flight.class}
                              </Badge>
                            </div>

                              <div className="flex flex-1 flex-col p-8 md:flex-row md:items-center md:justify-between gap-8">
                                <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
                                  <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold">{formatTime(flight.departure_time)}</p>
                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{flight.origin}</p>
                                  </div>
                                  
                                  <div className="flex flex-col items-center gap-1 flex-1 max-w-[150px]">
                                      <p className="text-xs text-neutral-400 font-medium">{flight.duration || "Direct"}</p>
                                      <div className="relative w-full h-[2px] bg-neutral-200 dark:bg-neutral-700">
                                          <motion.div 
                                            initial={{ left: 0 }}
                                            animate={{ left: "50%" }}
                                            transition={{ duration: 1.5, ease: "linear" }}
                                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                                          >
                                            <Plane className="h-3 w-3 text-red-600 rotate-90" />
                                          </motion.div>
                                      </div>
                                      <p className="text-xs text-red-600 font-bold uppercase">{flight.stops || "Non-stop"}</p>
                                    </div>
    
                                  <div className="text-center md:text-right">
                                    <p className="text-2xl font-bold">{formatTime(flight.arrival_time)}</p>
                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{flight.destination}</p>
                                  </div>
                                </div>


                              <div className="flex items-center justify-between md:flex-col md:items-end md:gap-2">
                                <div className="md:text-right">
                                  <p className="text-3xl font-bold text-red-900 dark:text-red-500">{flight.price}</p>
                                  <p className="text-xs text-neutral-500">per traveler</p>
                                </div>
                                <Button className={`${RED_VELVET_GRADIENT} rounded-xl px-8 text-white group-hover:shadow-md transition-all`}>
                                  {t('bookNow')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

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

            {filteredFlights.length === 0 && (
              <div className="py-24 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <Search className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('noDestinationsFound')}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">Try adjusting your origin or destination to find available flights.</p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => { setFromQuery(""); setToQuery(""); setActiveClass("All"); }}
                >
                  {t('clearAllFilters')}
                </Button>
              </div>
            )}
          </div>
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
