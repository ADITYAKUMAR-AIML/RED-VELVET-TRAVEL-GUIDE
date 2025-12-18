"use client";

import * as React from "react";
import { Plane, PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Filter, Clock, ArrowRight } from "lucide-react";
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

const FLIGHTS = [
  {
    id: 1,
    airline: "Velvet Airways",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=100&auto=format&fit=crop",
    from: "London (LHR)",
    to: "Santorini (JTR)",
    departure: "08:30 AM",
    arrival: "02:15 PM",
    duration: "3h 45m",
    price: "$299",
    type: "Direct",
    class: "Business"
  },
  {
    id: 2,
    airline: "Global Elite",
    logo: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=100&auto=format&fit=crop",
    from: "New York (JFK)",
    to: "Tokyo (NRT)",
    departure: "11:00 AM",
    arrival: "03:30 PM (+1)",
    duration: "13h 30m",
    price: "$1,250",
    type: "Direct",
    class: "First Class"
  },
  {
    id: 3,
    airline: "Alpine Wings",
    logo: "https://images.unsplash.com/photo-1544016768-982d1554f0b9?q=80&w=100&auto=format&fit=crop",
    from: "Paris (CDG)",
    to: "Zermatt (ZRH)",
    departure: "09:15 AM",
    arrival: "11:45 AM",
    duration: "2h 30m",
    price: "$180",
    type: "Direct",
    class: "Economy"
  },
  {
    id: 4,
    airline: "Velvet Airways",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=100&auto=format&fit=crop",
    from: "Dubai (DXB)",
    to: "Bali (DPS)",
    departure: "02:00 AM",
    arrival: "01:30 PM",
    duration: "9h 30m",
    price: "$750",
    type: "Direct",
    class: "Business"
  }
];

export default function FlightsPage() {
  const { t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);
    const [fromQuery, setFromQuery] = React.useState("");
    const [toQuery, setToQuery] = React.useState("");
    const [activeClass, setActiveClass] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
  
    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      setCurrentPage(1);
    }, [fromQuery, toQuery, activeClass]);
  
    const filteredFlights = FLIGHTS.filter(flight => {
      const matchesFrom = flight.from.toLowerCase().includes(fromQuery.toLowerCase());
      const matchesTo = flight.to.toLowerCase().includes(toQuery.toLowerCase());
      const matchesClass = activeClass === "All" || flight.class === activeClass;
      return matchesFrom && matchesTo && matchesClass;
    });

    const totalPages = Math.ceil(filteredFlights.length / ITEMS_PER_PAGE);
    const paginatedFlights = filteredFlights.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  if (!mounted) return null;

  const flightClasses = ["All", "Economy", "Business", "First Class"];

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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
                <div className="relative">
                  <PlaneTakeoff className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                  <Input 
                    placeholder="From (e.g. London)" 
                    className="pl-12 py-6 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                    value={fromQuery}
                    onChange={(e) => setFromQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <PlaneLanding className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                  <Input 
                    placeholder="To (e.g. Santorini)" 
                    className="pl-12 py-6 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                    value={toQuery}
                    onChange={(e) => setToQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <Input 
                    type="date"
                    className="pl-12 py-6 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                  />
                </div>
                <Button className={`${RED_VELVET_GRADIENT} h-full rounded-xl py-6 text-white text-lg font-bold`}>
                  <Search className="mr-2 h-5 w-5" /> {t('search')}
                </Button>
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
                    <Card className="overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="p-8 md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800">
                            <div className="mb-2 h-12 w-12 overflow-hidden rounded-full bg-neutral-100 p-2">
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
                                <p className="text-2xl font-bold">{flight.departure}</p>
                                <p className="text-sm text-neutral-500">{flight.from}</p>
                              </div>
                              
                              <div className="flex flex-col items-center gap-1 flex-1 max-w-[150px]">
                                <p className="text-xs text-neutral-400 font-medium">{flight.duration}</p>
                                <div className="relative w-full h-[2px] bg-neutral-200 dark:bg-neutral-700">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 px-2">
                                    <Plane className="h-4 w-4 text-red-600 rotate-90" />
                                  </div>
                                </div>
                                <p className="text-xs text-red-600 font-bold uppercase">{flight.type}</p>
                              </div>

                              <div className="text-center md:text-right">
                                <p className="text-2xl font-bold">{flight.arrival}</p>
                                <p className="text-sm text-neutral-500">{flight.to}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end md:gap-2">
                              <div className="md:text-right">
                                <p className="text-3xl font-bold text-red-900 dark:text-red-500">{flight.price}</p>
                                <p className="text-xs text-neutral-500">per traveler</p>
                              </div>
                              <Button className={`${RED_VELVET_GRADIENT} rounded-xl px-8 text-white`}>
                                {t('bookNow')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
