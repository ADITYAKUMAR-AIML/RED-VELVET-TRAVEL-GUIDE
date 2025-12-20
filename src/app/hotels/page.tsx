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

const ITEMS_PER_PAGE = 8;
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const INDIAN_STATES = [
  { id: "rajasthan", name: "Rajasthan", icon: "🏰" },
  { id: "kerala", name: "Kerala", icon: "🌴" },
  { id: "goa", name: "Goa", icon: "🏖️" },
  { id: "maharashtra", name: "Maharashtra", icon: "🏛️" },
  { id: "karnataka", name: "Karnataka", icon: "🛕" },
];

const HOTELS_BY_STATE: Record<string, typeof HOTELS> = {
  rajasthan: [
    {
      id: 101,
      name: "Taj Lake Palace",
      location: "Udaipur, Rajasthan",
      price: "₹45,000",
      rating: 5,
      type: "Heritage",
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      amenities: ["Lake View", "Spa", "Heritage Tours", "Fine Dining"]
    },
    {
      id: 102,
      name: "Umaid Bhawan Palace",
      location: "Jodhpur, Rajasthan",
      price: "₹52,000",
      rating: 5,
      type: "Palace",
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
      amenities: ["Royal Spa", "Pool", "Museum", "Butler Service"]
    },
    {
      id: 103,
      name: "Rambagh Palace",
      location: "Jaipur, Rajasthan",
      price: "₹38,000",
      rating: 5,
      type: "Heritage",
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
      amenities: ["Peacock Garden", "Spa", "Polo Grounds", "Heritage Walk"]
    },
    {
      id: 104,
      name: "Suryagarh Jaisalmer",
      location: "Jaisalmer, Rajasthan",
      price: "₹28,000",
      rating: 5,
      type: "Resort",
      state: "rajasthan",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
      amenities: ["Desert Safari", "Pool", "Spa", "Cultural Shows"]
    },
  ],
  kerala: [
    {
      id: 201,
      name: "Kumarakom Lake Resort",
      location: "Kumarakom, Kerala",
      price: "₹32,000",
      rating: 5,
      type: "Resort",
      state: "kerala",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
      amenities: ["Backwater View", "Ayurveda Spa", "Houseboat", "Yoga"]
    },
    {
      id: 202,
      name: "Taj Bekal Resort & Spa",
      location: "Bekal, Kerala",
      price: "₹28,000",
      rating: 5,
      type: "Resort",
      state: "kerala",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
      amenities: ["Private Pool", "Ayurveda", "Beach Access", "Spa"]
    },
    {
      id: 203,
      name: "Spice Village Thekkady",
      location: "Thekkady, Kerala",
      price: "₹18,000",
      rating: 4,
      type: "Eco Resort",
      state: "kerala",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
      amenities: ["Spice Garden", "Wildlife Safari", "Pool", "Cooking Class"]
    },
    {
      id: 204,
      name: "Coconut Lagoon",
      location: "Kumarakom, Kerala",
      price: "₹22,000",
      rating: 5,
      type: "Heritage",
      state: "kerala",
      image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=800&auto=format&fit=crop",
      amenities: ["Houseboat", "Backwaters", "Ayurveda", "Bird Watching"]
    },
  ],
  goa: [
    {
      id: 301,
      name: "Taj Exotica Resort & Spa",
      location: "South Goa",
      price: "₹25,000",
      rating: 5,
      type: "Beach Resort",
      state: "goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
      amenities: ["Private Beach", "Spa", "Golf Course", "Pool"]
    },
    {
      id: 302,
      name: "W Goa",
      location: "North Goa",
      price: "₹22,000",
      rating: 5,
      type: "Luxury",
      state: "goa",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
      amenities: ["Beach Access", "Infinity Pool", "Nightclub", "Spa"]
    },
    {
      id: 303,
      name: "The Leela Goa",
      location: "South Goa",
      price: "₹20,000",
      rating: 5,
      type: "Resort",
      state: "goa",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop",
      amenities: ["Lagoon View", "Golf", "Spa", "Multiple Restaurants"]
    },
    {
      id: 304,
      name: "Alila Diwa Goa",
      location: "South Goa",
      price: "₹18,000",
      rating: 5,
      type: "Boutique",
      state: "goa",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
      amenities: ["Paddy Field View", "Infinity Pool", "Spa", "Yoga"]
    },
  ],
  maharashtra: [
    {
      id: 401,
      name: "Taj Mahal Palace",
      location: "Mumbai, Maharashtra",
      price: "₹35,000",
      rating: 5,
      type: "Heritage",
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
      amenities: ["Sea View", "Heritage Tours", "Spa", "Fine Dining"]
    },
    {
      id: 402,
      name: "The Oberoi Mumbai",
      location: "Mumbai, Maharashtra",
      price: "₹28,000",
      rating: 5,
      type: "Luxury",
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
      amenities: ["Ocean View", "Spa", "Rooftop Pool", "Business Center"]
    },
    {
      id: 403,
      name: "Della Resorts",
      location: "Lonavala, Maharashtra",
      price: "₹15,000",
      rating: 4,
      type: "Adventure Resort",
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop",
      amenities: ["Adventure Park", "Spa", "Pool", "Camp Fire"]
    },
    {
      id: 404,
      name: "Radisson Blu Pune",
      location: "Pune, Maharashtra",
      price: "₹12,000",
      rating: 4,
      type: "Business",
      state: "maharashtra",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
      amenities: ["Pool", "Gym", "Spa", "Business Lounge"]
    },
  ],
  karnataka: [
    {
      id: 501,
      name: "Taj West End",
      location: "Bengaluru, Karnataka",
      price: "₹18,000",
      rating: 5,
      type: "Heritage",
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
      amenities: ["Garden View", "Spa", "Pool", "Heritage Walk"]
    },
    {
      id: 502,
      name: "Evolve Back Coorg",
      location: "Coorg, Karnataka",
      price: "₹42,000",
      rating: 5,
      type: "Luxury Resort",
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1600100397608-e0c91c249fdd?q=80&w=800&auto=format&fit=crop",
      amenities: ["Private Pool", "Coffee Plantation", "Spa", "Wildlife"]
    },
    {
      id: 503,
      name: "JW Marriott Bengaluru",
      location: "Bengaluru, Karnataka",
      price: "₹15,000",
      rating: 5,
      type: "Business",
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      amenities: ["Rooftop Pool", "Spa", "Fine Dining", "Gym"]
    },
    {
      id: 504,
      name: "Orange County Kabini",
      location: "Kabini, Karnataka",
      price: "₹35,000",
      rating: 5,
      type: "Wildlife Resort",
      state: "karnataka",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
      amenities: ["Safari", "Pool", "Spa", "Nature Walks"]
    },
  ],
};

const HOTELS = Object.values(HOTELS_BY_STATE).flat();

export default function HotelsPage() {
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

  const filteredHotels = React.useMemo(() => {
    if (!searchQuery) return HOTELS;
    return HOTELS.filter(hotel => 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getFilteredHotels = (stateId: string) => {
    const stateHotels = HOTELS_BY_STATE[stateId] || [];
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
                              src={hotel.image} 
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

          <div className="mt-24">
            <LocationSection 
              title="Explore Mumbai"
              subtitle="The City of Dreams offers everything from heritage luxury to modern sea-view hotels."
              location="Mumbai"
              type="hotel"
              href="/hotels?location=Mumbai"
            />

            <LocationSection 
              title="Explore Rajasthan"
              subtitle="Live like royalty in our handpicked collection of heritage palaces and forts."
              location="Rajasthan"
              type="hotel"
              href="/hotels?location=Rajasthan"
            />

            <LocationSection 
              title="Explore Bengaluru"
              subtitle="Discover luxury in the Garden City, perfect for both business and leisure."
              location="Bengaluru"
              type="hotel"
              href="/hotels?location=Bengaluru"
            />

            <LocationSection 
              title="Explore Goa"
              subtitle="Unwind in premium beach resorts and boutique stays across the sunny coast."
              location="Goa"
              type="hotel"
              href="/hotels?location=Goa"
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
