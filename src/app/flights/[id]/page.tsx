"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Plane, 
  PlaneTakeoff, 
  PlaneLanding, 
  Calendar, 
  Users, 
  Clock, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Coffee,
  Wifi,
  Monitor,
  Armchair,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const FlightMap = dynamic(() => import("@/components/FlightMap"), { ssr: false });

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function FlightDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [flight, setFlight] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    setMounted(true);
    const fetchFlight = async () => {
      try {
        const res = await fetch(`/api/flights/${id}`);
        const data = await res.json();
        if (data && !data.error) {
          setFlight(data);
        }
      } catch (err) {
        console.error("Error fetching flight:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  if (!mounted || loading || !flight) return null;

  const formatTime = (time: string) => {
    if (!time) return "12:00";
    if (time.includes("T")) {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return time;
  };

  const formatDate = (time: string) => {
    if (!time) return "Today";
    return new Date(time).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const amenities = [
    { icon: <Briefcase className="h-5 w-5" />, label: "Checked Baggage", value: "25kg included" },
    { icon: <Coffee className="h-5 w-5" />, label: "Meals", value: "Complimentary" },
    { icon: <Wifi className="h-5 w-5" />, label: "Wi-Fi", value: "High-speed" },
    { icon: <Monitor className="h-5 w-5" />, label: "Entertainment", value: "On-demand" },
    { icon: <Armchair className="h-5 w-5" />, label: "Legroom", value: "32-34 inches" },
    { icon: <ShieldCheck className="h-5 w-5" />, label: "Insurance", value: "Standard included" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Button 
            variant="ghost" 
            className="mb-8 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToFlights') || "Back to Flights"}
          </Button>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <section className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <Badge className={`${RED_VELVET_GRADIENT} mb-4 border-none px-4 py-1 text-sm text-white`}>
                      {flight.class}
                    </Badge>
                    <h1 className="text-4xl font-bold md:text-5xl">{flight.airline} {flight.flight_number}</h1>
                    <p className="mt-2 text-neutral-500 flex items-center gap-2">
                      <Plane className="h-4 w-4" /> Non-stop Flight • Boeing 787 Dreamliner
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Starting From</p>
                    <p className="text-5xl font-black text-red-900 dark:text-red-500">{flight.price}</p>
                  </div>
                </div>

                <Card className="overflow-hidden border-none bg-neutral-50 dark:bg-neutral-900 p-8 mb-12">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <PlaneTakeoff className="h-6 w-6 text-red-600" />
                        <span className="text-sm font-bold text-red-600 uppercase tracking-tighter">Departure</span>
                      </div>
                        <p className="text-4xl font-black">{formatTime(flight.departure_time)}</p>
                        <p className="text-xl font-bold mt-1">{flight.origin}</p>
                        <p className="text-sm text-neutral-500 mt-1">{formatDate(flight.departure_time)}</p>
                      </div>

                    <div className="flex flex-col items-center flex-1 max-w-[200px]">
                      <p className="text-sm font-bold text-neutral-400 mb-2">{flight.duration || "Direct"}</p>
                      <div className="relative w-full h-[2px] bg-neutral-200 dark:bg-neutral-700">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-50 dark:bg-neutral-900 px-3 py-1">
                          <Plane className="h-5 w-5 text-red-600 rotate-90" />
                        </div>
                      </div>
                      <p className="text-xs text-red-600 font-bold uppercase mt-2">Non-stop</p>
                    </div>

                    <div className="flex-1 text-center md:text-right">
                      <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                        <span className="text-sm font-bold text-red-600 uppercase tracking-tighter">Arrival</span>
                        <PlaneLanding className="h-6 w-6 text-red-600" />
                      </div>
                        <p className="text-4xl font-black">{formatTime(flight.arrival_time)}</p>
                        <p className="text-xl font-bold mt-1">{flight.destination}</p>
                        <p className="text-sm text-neutral-500 mt-1">{formatDate(flight.arrival_time)}</p>
                      </div>
                  </div>
                </Card>

                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold">Flight Information</h2>
                    <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {flight.description || "Experience unparalleled comfort and service on our direct flights. Our modern fleet ensures a smooth journey while you enjoy premium amenities and world-class hospitality."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {amenities.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-red-100 transition-colors">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950 text-red-600">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{item.label}</p>
                            <p className="text-sm text-neutral-500">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold mb-6">Flight Route</h2>
                      <FlightMap origin={flight.origin} destination={flight.destination} />
                    </div>
                  </div>

              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-bold">In-Flight Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1540339832862-47451913f384?q=80&w=800" alt="Cabin" fill className="object-cover" />
                    </div>
                    <h3 className="font-bold">Premium Cabin</h3>
                    <p className="text-sm text-neutral-500">Ergonomic seating with adjustable headrests and extra legroom for your comfort.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1506013391221-ce841b250326?q=80&w=800" alt="Dining" fill className="object-cover" />
                    </div>
                    <h3 className="font-bold">Gourmet Dining</h3>
                    <p className="text-sm text-neutral-500">Chef-inspired meals with a selection of premium beverages and snacks.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1517404212776-9f94b9665796?q=80&w=800" alt="Entertainment" fill className="object-cover" />
                    </div>
                    <h3 className="font-bold">Onboard Wi-Fi</h3>
                    <p className="text-sm text-neutral-500">Stay connected throughout your journey with our high-speed satellite Wi-Fi.</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 overflow-hidden border-none bg-white dark:bg-neutral-900 shadow-2xl">
                <div className={`${RED_VELVET_GRADIENT} p-8 text-white`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{flight.class} Class</p>
                      <h3 className="text-2xl font-black mt-1">Booking Options</h3>
                    </div>
                    <Badge variant="outline" className="text-white border-white/30">Available</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{flight.price}</span>
                    <span className="opacity-80 font-bold">/ traveler</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-neutral-500 uppercase">Travel Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                        <select className="w-full rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 py-4 pl-12 pr-4 font-bold focus:border-red-600 focus:ring-red-600 appearance-none">
                          <option>{formatDate(flight.departure_time)}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-neutral-500 uppercase">Passengers</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                        <select className="w-full rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 py-4 pl-12 pr-4 font-bold focus:border-red-600 focus:ring-red-600 appearance-none">
                          <option>1 Adult</option>
                          <option>2 Adults</option>
                          <option>3 Adults</option>
                          <option>4 Adults</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-red-50/50 dark:bg-red-950/20 p-6 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Base Fare (1 Traveler)</span>
                        <span className="font-bold">{flight.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Taxes & Fees</span>
                        <span className="font-bold">$45.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Booking Fee</span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                        <span className="font-black text-lg">Total</span>
                        <span className="text-2xl font-black text-red-900 dark:text-red-500">
                          ${(parseFloat(flight.price.replace(/[^0-9.]/g, '')) + 45).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${RED_VELVET_GRADIENT} py-8 text-xl font-black shadow-xl text-white rounded-2xl hover:scale-[1.02] transition-transform`}
                      onClick={() => router.push(`/booking?id=${flight.id}&type=flight`)}
                    >
                      Secure Booking
                    </Button>

                    <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <Info className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Prices are subject to change until booking is confirmed. 
                        Free cancellation within 24 hours of booking.
                      </p>
                    </div>
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
