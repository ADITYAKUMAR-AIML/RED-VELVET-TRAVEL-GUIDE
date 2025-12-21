"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  Wifi,
  Coffee,
  Waves,
  Utensils
} from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { ReviewSection } from "@/components/ReviewSection";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const HOTELS = [
  {
    id: 1,
    name: "The Velvet Oasis",
    location: "Santorini, Greece",
    price: "$450",
    rating: 5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wifi", "Breakfast Included", "Infinity Pool", "Luxury Spa"],
    description: "Experience the pinnacle of luxury at The Velvet Oasis. Nestled on the cliffs of Oia, our hotel offers breathtaking views of the Aegean Sea and the famous Santorini sunset. Each suite is designed with elegance and comfort in mind, featuring private balconies and high-end amenities."
  },
  {
    id: 2,
    name: "Imperial Gardens",
    location: "Kyoto, Japan",
    price: "$380",
    rating: 5,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wifi", "Traditional Breakfast", "Zen Garden", "Private Tea Room"],
    description: "Imperial Gardens blends traditional Japanese architecture with modern luxury. Located in the heart of Kyoto's historic district, our ryokan-style hotel provides a serene escape with meticulously maintained gardens and authentic tea ceremonies."
  },
  {
    id: 3,
    name: "Alpine Majesty Resort",
    location: "Zermatt, Switzerland",
    price: "$550",
    rating: 5,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Ski-in/Ski-out", "Thermal Spa", "Gourmet Dining", "En-suite Fireplace"],
    description: "Perched high in the Swiss Alps, Alpine Majesty Resort is a haven for mountain lovers. Enjoy direct access to world-class ski slopes, relax in our state-of-the-art thermal spa, and dine at our Michelin-starred restaurant with views of the Matterhorn."
  },
  {
    id: 4,
    name: "Azure Lagoon Retreat",
    location: "Bora Bora",
    price: "$890",
    rating: 5,
    image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Overwater Villa", "Private Beach", "Butler Service", "Exclusive Diving"],
    description: "Discover paradise at Azure Lagoon Retreat. Our overwater villas offer direct access to the crystal-clear lagoon, where you can swim with tropical fish right from your deck. With personalized butler service and a private beach, your every wish is our command."
  }
];

export default function HotelDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  
  const hotel = HOTELS.find(h => h.id.toString() === id) || HOTELS[0];

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
            src={hotel.image} 
            alt={hotel.name} 
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
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToHotels') || 'Back to Hotels'}
              </Button>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-4 flex gap-1">
                    {[...Array(hotel.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold text-white md:text-6xl">{hotel.name}</h1>
                  <div className="mt-4 flex items-center gap-2 text-white/90">
                    <MapPin className="h-5 w-5 text-red-400" /> {hotel.location}
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-white/70">{t('startingFrom') || 'Starting from'}</p>
                  <p className="text-4xl font-bold text-white">{hotel.price}<span className="text-lg font-normal text-white/70">/{t('night') || 'night'}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('aboutTheHotel') || 'About the Hotel'}</h2>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {hotel.description}
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('featuredAmenities') || 'Featured Amenities'}</h2>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
                    <Wifi className="h-8 w-8 text-red-600" />
                    <span className="text-sm font-bold">Free Wifi</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
                    <Coffee className="h-8 w-8 text-red-600" />
                    <span className="text-sm font-bold">Breakfast</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
                    <Waves className="h-8 w-8 text-red-600" />
                    <span className="text-sm font-bold">Pool</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
                    <Utensils className="h-8 w-8 text-red-600" />
                    <span className="text-sm font-bold">Dining</span>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('allAmenities') || 'All Amenities'}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {hotel.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <ReviewSection itemId={hotel.id.toString()} itemType="hotel" />
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-2xl">
                <div className={`${RED_VELVET_GRADIENT} p-6 text-white`}>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-widest">{t('bestPriceGuaranteed') || 'Best Price Guaranteed'}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{hotel.price}</span>
                    <span className="opacity-80">/ {t('night') || 'night'}</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
<Button 
                        className={`w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}
                        onClick={() => router.push(`/booking?id=${hotel.id}&type=hotel`)}
                      >
                        {t('bookYourStay') || 'Book Your Stay'}
                      </Button>
                    <Button variant="outline" className="w-full border-red-900 dark:border-red-700 py-7 text-lg font-bold text-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                      {t('checkAvailability') || 'Check Availability'}
                    </Button>
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                      {t('freeCancellationHotel') || 'Free cancellation until 48h before check-in'}
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
