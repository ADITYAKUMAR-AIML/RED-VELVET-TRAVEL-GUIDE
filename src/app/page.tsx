"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Hotel, 
  Plane, 
  Camera, 
  Users, 
  ArrowRight, 
  Calendar,
  ChevronRight,
  Star,
  Clock,
  Gift,
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Utensils
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VIDEO_URL = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506929562872-bb421553b3f1?auto=format&fit=crop&q=80";
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const FEATURED_HOTELS = [
  {
    id: 1,
    name: "The Velvet Oasis",
    location: "Santorini, Greece",
    price: "$450",
    rating: 5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    amenities: ["Wifi", "Coffee", "Waves", "Utensils"]
  },
  {
    id: 2,
    name: "Imperial Gardens",
    location: "Kyoto, Japan",
    price: "$380",
    rating: 5,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    amenities: ["Wifi", "Coffee", "Waves", "Utensils"]
  }
];

const FEATURED_PACKAGES = [
  {
    id: 1,
    title: "Honeymoon in Paradise",
    destination: "Santorini, Greece",
    price: "$2,999",
    duration: "7 Days",
    groupSize: "2 Persons",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
    features: ["Sunset Cruise", "Candlelight Dinner"]
  },
  {
    id: 2,
    title: "Zen Cultural Journey",
    destination: "Kyoto & Tokyo, Japan",
    price: "$3,499",
    duration: "10 Days",
    groupSize: "Up to 6 Persons",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    features: ["Temple Tours", "Tea Ceremony"]
  },
  {
    id: 3,
    title: "Alpine Adventure Plus",
    destination: "Swiss Alps, Switzerland",
    price: "$4,200",
    duration: "8 Days",
    groupSize: "Up to 4 Persons",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800&auto=format&fit=crop",
    features: ["Ski Passes", "Helicopter Tour"]
  }
];

export default function HomePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`/api/destinations/search?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main>
        {/* Compact Header Section - Starts from the top */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-neutral-950 pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            {!videoError ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
                poster={FALLBACK_IMAGE}
              >
                <source src={VIDEO_URL} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={FALLBACK_IMAGE}
                alt="Travel background"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl text-left">
              <motion.h1 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight"
              >
                {t('heroTitle')}
              </motion.h1>
              <motion.p 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-neutral-200 mb-12 max-w-2xl"
              >
                {t('heroSubtitle')}
              </motion.p>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-neutral-900 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 relative"
              >
                <div className="flex-1 flex items-center px-6 gap-4 border-r border-neutral-200 dark:border-neutral-700">
                  <MapPin className="text-red-600" />
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')}
                    className="w-full py-4 outline-none bg-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="hidden md:flex flex-1 items-center px-6 gap-4 border-r border-neutral-200 dark:border-neutral-700">
                  <Calendar className="text-red-600" />
                  <span className="text-neutral-500 dark:text-neutral-400">{t('addDates')}</span>
                </div>
                <div className="hidden md:flex flex-1 items-center px-6 gap-4">
                  <Users className="text-red-600" />
                  <span className="text-neutral-500 dark:text-neutral-400">{t('travelers')}</span>
                </div>
                <button className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>{t('search')}</span>
                </button>

                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden z-50 p-4 border border-neutral-200 dark:border-neutral-700"
                    >
                      {suggestions.map((dest) => (
                        <Link 
                          key={dest.id} 
                          href={`/destinations/${dest.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-colors"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-neutral-900 dark:text-neutral-50">{dest.name}</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{dest.country}</p>
                          </div>
                          <ArrowRight className="ml-auto w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

          {/* Categories */}
          <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-left">
                <div>
                  <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-neutral-50">{t('popularCategories')}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('curatedTourPackagesDesc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Hotel, title: t("hotels"), description: t("luxuryStaysDesc"), href: "/hotels" },
                  { icon: Plane, title: t("flights"), description: t("flightsDesc"), href: "#" },
                  { icon: Camera, title: t("tours"), description: t("toursDesc"), href: "/packages" },
                ].map((cat, idx) => (
                  <motion.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={cat.href}>
                      <Card className="group h-full cursor-pointer overflow-hidden border-none bg-white dark:bg-neutral-800 shadow-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:shadow-xl">
                        <CardContent className="p-8 text-left">
                          <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110`}>
                            <cat.icon className="h-7 w-7" />
                          </div>
                          <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-50">{cat.title}</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">{cat.description}</p>
                          <div className="mt-6 flex items-center text-sm font-semibold text-red-600 opacity-0 transition-opacity group-hover:opacity-100">
                            {t('viewDetails')} <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Places */}
          <section className="py-24 bg-white dark:bg-neutral-950 transition-colors">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-left">
                <div>
                  <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-neutral-50">{t('featuredDestinations')}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('curatedTourPackagesDesc')}</p>
                </div>
                <Link href="/destinations">
                  <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/30">
                    {t('exploreMore')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "santorini",
                    title: "Santorini, Greece",
                    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
                    tag: t("romantic")
                  },
                  {
                    id: "kyoto",
                    title: "Kyoto, Japan",
                    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
                    tag: t("cultural")
                  },
                  {
                    id: "bora-bora",
                    title: "Bora Bora, French Polynesia",
                    image: "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?q=80&w=800&auto=format&fit=crop",
                    tag: t("luxury")
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/destinations/${item.id}`}>
                      <Card className="group relative h-[450px] overflow-hidden border-none rounded-[2rem] cursor-pointer">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-red-600 text-white border-none px-4 py-1.5 rounded-full uppercase tracking-wider text-[10px] font-bold">
                            {item.tag}
                          </Badge>
                        </div>
                        <div className="absolute bottom-8 left-8 right-8">
                          <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                          <div className="flex items-center text-white/80 text-sm font-medium gap-2 group-hover:gap-4 transition-all">
                            {t('viewDetails')} <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Packages */}
          <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors">
            <div className="container mx-auto px-6 text-left">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                  <Badge className="mb-4 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-none">{t('exclusiveOffers')}</Badge>
                  <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-neutral-50">{t('curatedTourPackages')}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('curatedTourPackagesDesc')}</p>
                </div>
                <Link href="/packages">
                  <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/30">
                    {t('viewAllPackages')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {FEATURED_PACKAGES.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/packages/${pkg.id}`}>
                      <Card className="flex h-full flex-col overflow-hidden border-none bg-white dark:bg-neutral-800 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
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

                          <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-700 pt-6">
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
              </div>
            </div>
          </section>

          {/* Featured Hotels */}
          <section className="py-24 bg-white dark:bg-neutral-950 transition-colors">
            <div className="container mx-auto px-6 text-left">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-neutral-50">{t('luxuryStays')}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('luxuryStaysDesc')}</p>
                </div>
                <Link href="/hotels">
                  <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/30">
                    {t('viewAllHotels')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {FEATURED_HOTELS.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
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
              </div>
            </div>
          </section>

        {/* Call to Action */}
        <section className="py-24 bg-white dark:bg-neutral-950 transition-colors">
          <div className="container mx-auto px-6">
            <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000] p-12 text-center text-white shadow-2xl md:p-24`}>
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="mb-6 text-4xl font-bold md:text-5xl">{t('readyForAdventure')}</h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
                  {t('readyForAdventureDesc')}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/destinations">
                    <Button className="h-14 bg-white px-8 text-lg font-bold text-red-950 hover:bg-white/90">
                      {t('bookNow')}
                    </Button>
                  </Link>
                  <Link href="/contact-agent">
                    <Button variant="outline" className="h-14 border-white/30 bg-white/10 px-8 text-lg font-bold text-white hover:bg-white/20">
                      {t('contactAgent')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white py-24 border-t border-neutral-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-3xl font-black tracking-tighter text-red-600 mb-8 block">
                ORCHIDS<span className="text-white">TRAVEL</span>
              </Link>
              <p className="text-neutral-400 max-w-sm mb-8">
                The world's first premium travel platform designed for the modern adventurer. Luxury, simplified.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-neutral-50">{t('exploreFooter')}</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><Link href="/destinations" className="hover:text-red-500 transition-colors">{t('destinations')}</Link></li>
                <li><Link href="/hotels" className="hover:text-red-500 transition-colors">{t('hotels')}</Link></li>
                <li><Link href="/packages" className="hover:text-red-500 transition-colors">{t('packages')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-neutral-50">{t('contactFooter')}</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><Link href="/contact-agent" className="hover:text-red-500 transition-colors">{t('contactAgent')}</Link></li>
                <li>support@orchidstravel.com</li>
                <li>+1 (555) 000-0000</li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-neutral-800 text-neutral-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Orchids Travel. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
