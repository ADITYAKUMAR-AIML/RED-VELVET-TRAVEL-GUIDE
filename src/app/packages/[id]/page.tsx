"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Clock, 
  Users, 
  Gift, 
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { ReviewSection } from "@/components/ReviewSection";
import { supabase } from "@/lib/supabase";
import { LeafletMap } from "@/components/LeafletMap";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function PackageDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [pkg, setPkg] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    setMounted(true);
    const fetchPackage = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', id)
          .single();
        
          if (data) {
            let features = data.features;
            if (typeof features === 'string') {
              try {
                features = JSON.parse(features);
              } catch {
                features = features.split(',').map((f: string) => f.trim());
              }
            }
            if (!Array.isArray(features)) {
              features = ["Travel Guide", "Transport", "Sightseeing"];
            }

            setPkg({
              ...data,
              image: data.image_url || data.image,
              features: features,
            });
          }
        } catch (err) {
          console.error("Error fetching package:", err);
        } finally {
          setLoading(false);
        }

    };
    fetchPackage();
  }, [id]);

  if (!mounted || loading || !pkg) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pb-24">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image 
            src={pkg.image} 
            alt={pkg.title} 
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
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToPackages') || 'Back to Packages'}
              </Button>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Badge className="mb-4 bg-red-600 text-white border-none px-4 py-1 text-sm">
                    {pkg.destination}
                  </Badge>
                  <h1 className="text-4xl font-bold text-white md:text-6xl">{pkg.title}</h1>
                  <div className="mt-4 flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-400" /> {pkg.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-red-400" /> {pkg.groupSize}
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-red-400" /> {t('allInclusive') || 'All Inclusive'}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-white/70">{t('startingFrom') || 'Starting from'}</p>
                  <p className="text-4xl font-bold text-white">{pkg.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">{t('packageDescription') || 'Package Description'}</h2>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {pkg.description}
                </p>
              </section>

                <section className="mb-12">
                  <h2 className="mb-6 text-3xl font-bold">{t('whatsIncluded') || "What's Included"}</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.isArray(pkg.features) && pkg.features.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 p-4">
                        <Gift className="h-6 w-6 text-red-600" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 p-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <span className="font-medium">{t('insuranceIncluded') || 'Travel Insurance Included'}</span>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="mb-6 text-3xl font-bold">Location</h2>
                  <LeafletMap 
                      lat={pkg.latitude} 
                      lng={pkg.longitude} 
                      name={pkg.title}
                      image={pkg.image}
                      location={pkg.destination}
                    />
                </section>

                <ReviewSection itemId={pkg.id.toString()} itemType="package" />
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-2xl">
                <div className={`${RED_VELVET_GRADIENT} p-6 text-white`}>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-widest">{t('bestValue') || 'Best Value'}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="opacity-80">/ {t('perPackage') || 'total'}</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('selectDepartureDate') || 'Select Departure Date'}</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                        <select className="w-full rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-3 pl-10 pr-4">
                          <option>Next Month</option>
                          <option>In 3 Months</option>
                          <option>In 6 Months</option>
                        </select>
                      </div>
                    </div>

<Button 
                        className={`w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}
                        onClick={() => router.push(`/booking?id=${pkg.id}&type=package`)}
                      >
                        {t('bookPackageNow') || 'Book This Package'}
                      </Button>
                    <Button variant="outline" className="w-full border-red-900 dark:border-red-700 py-7 text-lg font-bold text-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                      {t('customizeItinerary') || 'Customize Itinerary'}
                    </Button>
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                      {t('priceIncludesTax') || 'Price includes all taxes and fees'}
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
