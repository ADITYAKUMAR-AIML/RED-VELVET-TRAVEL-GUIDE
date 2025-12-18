"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
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
  Star
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURED_HOTELS, FEATURED_PACKAGES, FEATURED_DESTINATIONS } from "@/lib/data";

const VIDEO_URL = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506929562872-bb421553b3f1?auto=format&fit=crop&q=80";
const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const EXPERIENCE_PACKAGES = [
  { nameKey: "heritageAndCulture", icon: "🏛️", href: "/packages?type=heritage", descKey: "heritageAndCultureDesc" },
  { nameKey: "adventureAndThrills", icon: "🏔️", href: "/packages?type=adventure", descKey: "adventureAndThrillsDesc" },
  { nameKey: "wildlifeSafari", icon: "🦁", href: "/packages?type=wildlife", descKey: "wildlifeSafariDesc" },
  { nameKey: "beachAndRelaxation", icon: "🏖️", href: "/packages?type=beach", descKey: "beachAndRelaxationDesc" },
  { nameKey: "spiritualJourneys", icon: "🕉️", href: "/packages?type=spiritual", descKey: "spiritualJourneysDesc" },
  { nameKey: "foodAndCulinary", icon: "🍛", href: "/packages?type=culinary", descKey: "foodAndCulinaryDesc" },
];

function ScrollTracingLine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const dotTop = useTransform(scaleY, (v) => `${v * 100}%`);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed left-6 md:left-12 top-0 bottom-0 w-px z-40 pointer-events-none hidden lg:block"
    >
      <div className="absolute inset-0 border-l-2 border-dotted border-neutral-300 dark:border-neutral-800" />
      <motion.div 
        className="absolute top-0 left-[-1px] w-[3px] bg-red-600 origin-top"
        style={{ scaleY, height: '100%' }}
      />
      <motion.div 
        className="absolute left-[-4px] w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        style={{ top: dotTop }}
      />
    </motion.div>
  );
}

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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />
      <ScrollTracingLine />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10" />
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
                className="text-xl text-white/90 mb-12 max-w-2xl"
              >
                {t('heroSubtitle')}
              </motion.p>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-neutral-900 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 relative"
              >
                <div className="flex-1 flex items-center px-6 gap-4 md:border-r border-neutral-200 dark:border-neutral-700">
                  <MapPin className="text-red-600" />
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')}
                    className="w-full py-4 outline-none bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="hidden md:flex flex-1 items-center px-6 gap-4 border-r border-neutral-200 dark:border-neutral-700">
                  <Calendar className="text-red-600" />
                  <span className="text-neutral-900 dark:text-white">{t('addDates')}</span>
                </div>
                <div className="hidden md:flex flex-1 items-center px-6 gap-4">
                  <Users className="text-red-600" />
                  <span className="text-neutral-900 dark:text-white">{t('travelers')}</span>
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
                            <h4 className="font-bold text-neutral-900 dark:text-white">{dest.name}</h4>
                            <p className="text-sm text-neutral-500">{dest.country}</p>
                          </div>
                          <ArrowRight className="ml-auto w-5 h-5 text-neutral-400" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-left">
              <div>
                <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">{t('popularCategories')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('curatedTourPackagesDesc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Hotel, title: t("hotels"), description: t("luxuryStaysDesc"), href: "/hotels" },
                { icon: Plane, title: t("flights"), description: t("flightsDesc"), href: "/flights" },
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
                    <Card className="group h-full overflow-hidden border-none bg-white dark:bg-neutral-800 shadow-sm transition-all hover:shadow-xl">
                      <CardContent className="p-8 text-left">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                          <cat.icon className="h-7 w-7" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">{cat.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">{cat.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Packages Section */}
        <section className="py-24 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-left">
              <div>
                <Badge className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-none">{t('experienceIndia')}</Badge>
                <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">{t('experiencePackages')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('experiencePackagesDesc')}</p>
              </div>
              <Link href="/packages">
                <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
                  {t('viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {EXPERIENCE_PACKAGES.map((exp, idx) => (
                <motion.div
                  key={exp.nameKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={exp.href}>
                    <Card className="group h-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all hover:shadow-xl hover:border-red-500 dark:hover:border-red-500">
                      <CardContent className="p-4 text-center flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-2xl group-hover:scale-110 transition-transform">
                          {exp.icon}
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2">{t(exp.nameKey)}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations Section - International Locations */}
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-left">
              <div>
                <Badge className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-none">{t('exploreWorld')}</Badge>
                <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">{t('popularDestinations')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('popularDestinationsDesc')}</p>
              </div>
              <Link href="/destinations">
                <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
                  {t('exploreMore')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_DESTINATIONS.slice(0, 8).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/destinations/${item.id}`}>
                    <Card className="group overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none text-[10px]">
                          {item.tag}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <MapPin className="h-3 w-3" /> {item.country}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-24 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-6 text-left">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div>
                <Badge className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-none">{t('exclusiveOffers')}</Badge>
                <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">{t('curatedTourPackages')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('curatedTourPackagesDesc')}</p>
              </div>
              <Link href="/packages">
                <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
                  {t('viewAllPackages')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_PACKAGES.slice(0, 8).map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/packages/${pkg.id}`}>
                    <Card className="group overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-xl cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={pkg.image} 
                          alt={pkg.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none text-[10px]">
                          {pkg.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase mb-1">{pkg.destination}</p>
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                          <Users className="h-3 w-3" /> {pkg.groupSize}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">{pkg.price}</span>
                          <span className="text-[10px] text-neutral-500">{t('allInclusive')}</span>
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
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-6 text-left">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">{t('luxuryStays')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">{t('luxuryStaysDesc')}</p>
              </div>
              <Link href="/hotels">
                <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
                  {t('viewAllHotels')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_HOTELS.slice(0, 8).map((hotel, idx) => (
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
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none text-[10px]">
                          {t('recommended')}
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
                            <span className="text-xs text-neutral-500 dark:text-neutral-400"> / {t('perNight')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-6">
            <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000] p-12 text-center shadow-2xl md:p-24`}>
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="mb-6 text-4xl font-bold md:text-5xl text-white">{t('readyForAdventure')}</h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">
                  {t('readyForAdventureDesc')}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/destinations">
                    <Button className="h-14 bg-white px-8 text-lg font-bold text-red-700 hover:bg-white/90 border-none">
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
      <footer className="bg-neutral-900 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-3xl font-black tracking-tighter text-red-500 mb-8 block">
                ORCHIDS<span className="text-white">TRAVEL</span>
              </Link>
              <p className="text-neutral-400 max-w-sm mb-8">
                {t('footerDesc')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">{t('exploreFooter')}</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><Link href="/destinations" className="hover:text-red-500 transition-colors">{t('destinations')}</Link></li>
                <li><Link href="/hotels" className="hover:text-red-500 transition-colors">{t('hotels')}</Link></li>
                <li><Link href="/packages" className="hover:text-red-500 transition-colors">{t('packages')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">{t('contactFooter')}</h4>
              <ul className="space-y-4 text-neutral-400">
                <li><Link href="/contact-agent" className="hover:text-red-500 transition-colors">{t('contactAgent')}</Link></li>
                <li>support@orchidstravel.com</li>
                <li>+1 (555) 000-0000</li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-neutral-800 text-neutral-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Orchids Travel. {t('allRightsReserved')}</p>
            <div className="flex gap-8">
              <span className="hover:text-neutral-300 cursor-pointer">{t('privacyPolicy')}</span>
              <span className="hover:text-neutral-300 cursor-pointer">{t('termsOfService')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
