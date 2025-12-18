"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  Hotel
} from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ReviewSection } from "@/components/ReviewSection";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const DESTINATIONS = [
  {
    id: "santorini",
    title: "Santorini, Greece",
    price: "$1,299",
    location: "Cyclades, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop",
    tag: "Romantic",
    rating: 4.9,
    reviews: 128,
    description: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater). They overlook the sea, small islands to the west and beaches made up of black, red and white lava pebbles.",
    highlights: ["Sunset in Oia", "Private Boat Tour", "Wine Tasting", "Black Sand Beaches"],
    amenities: ["Boutique Hotel", "Private Pool", "Daily Breakfast", "Airport Transfer"]
  },
  {
    id: "kyoto",
    title: "Kyoto, Japan",
    price: "$1,450",
    location: "Kansai, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    tag: "Cultural",
    rating: 4.8,
    reviews: 95,
    description: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It's also known for formal traditions such as kaiseki dining, consisting of multiple courses of precise dishes, and geisha, female entertainers often found in the Gion district.",
    highlights: ["Arashiyama Bamboo Grove", "Kinkaku-ji (Golden Pavilion)", "Gion District Walk", "Traditional Tea Ceremony"],
    amenities: ["Ryokan Stay", "Kaiseki Meals", "Local Guide", "Pocket Wi-Fi"]
  },
  {
    id: "swiss-alps",
    title: "Swiss Alps, Switzerland",
    price: "$1,800",
    location: "Bernese Oberland, Switzerland",
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1200&auto=format&fit=crop",
    tag: "Adventure",
    rating: 5.0,
    reviews: 210,
    description: "The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland. Because of their central location within the entire Alpine range, they are also known as the Central Alps. The highest summit in the Swiss Alps is Monte Rosa (4,634 metres), near the Swiss-Italian border.",
    highlights: ["Jungfraujoch Sphinx Observatory", "Glacier Express Train", "Interlaken Paragliding", "Lucerne Lake Cruise"],
    amenities: ["Alpine Resort", "Ski Pass", "Wellness Spa", "Train Passes"]
  }
];

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  
  const destination = DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pb-24">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image 
            src={destination.image} 
            alt={destination.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-12">
            <div className="container mx-auto">
              <Button 
                variant="ghost" 
                className="mb-6 text-white hover:bg-white/10"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToDestinations')}
              </Button>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Badge className={`${RED_VELVET_GRADIENT} mb-4 border-none px-4 py-1 text-sm text-white`}>
                    {destination.tag}
                  </Badge>
                  <h1 className="text-4xl font-bold text-white md:text-6xl">{destination.title}</h1>
                  <div className="mt-4 flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-5 w-5 text-red-400" /> {destination.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {destination.rating} ({destination.reviews} reviews)
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-white/70">{t('startingFrom')}</p>
                  <p className="text-4xl font-bold text-white">{destination.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('aboutJourney')}</h2>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {destination.description}
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('journeyHighlights')}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {destination.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 p-4 shadow-sm">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('whatsIncluded')}</h2>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  {destination.amenities.map((item) => (
                    <div key={item} className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-400">
                        {item.includes('Hotel') || item.includes('Resort') || item.includes('Stay') ? <Hotel className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
                      </div>
                      <span className="text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <ReviewSection itemId={destination.id} itemType="destination" />
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-2xl">
                <div className={`${RED_VELVET_GRADIENT} p-6 text-white`}>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-widest">{t('premiumPackage')}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{destination.price}</span>
                    <span className="opacity-80">/ person</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('selectDate')}</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                        <select className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-3 pl-10 pr-4 focus:border-red-800 focus:ring-red-800">
                          <option>September 12, 2024</option>
                          <option>October 05, 2024</option>
                          <option>November 20, 2024</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('travelers')}</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                        <select className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-3 pl-10 pr-4 focus:border-red-800 focus:ring-red-800">
                          <option>1 Adult</option>
                          <option>2 Adults</option>
                          <option>2 Adults, 1 Child</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">{t('basePrice')} (2 Adults)</span>
                        <span className="font-bold">$2,598</span>
                      </div>
                      <div className="mb-4 flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">{t('serviceFee')}</span>
                        <span className="font-bold">$150</span>
                      </div>
                      <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-4 text-lg">
                        <span className="font-bold">{t('total')}</span>
                        <span className="font-black text-red-900 dark:text-red-400">$2,748</span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}
                      onClick={() => router.push(`/booking/${destination.id}`)}
                    >
                      {t('bookTripNow')}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full border-red-900 dark:border-red-700 py-7 text-lg font-bold text-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => router.push('/contact-agent')}
                    >
                      {t('contactAgent')}
                    </Button>

                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                      {t('freeCancellation')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
