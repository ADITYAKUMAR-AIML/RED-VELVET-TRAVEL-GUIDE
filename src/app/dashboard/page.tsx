"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  Package, 
  Settings, 
  Bell, 
  MapPin, 
  Calendar,
  CreditCard,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

  export default function DashboardPage() {
    const { user, profile, loading, signOut } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (!mounted || loading || !user) return null;

    const displayName = profile?.full_name || user.user_metadata?.full_name || 'Traveler';
    const avatarSrc = profile?.avatar_url || user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`;

    const BOOKINGS = [
      {
        id: "VV-98421",
        destination: "Santorini, Greece",
        date: "Sept 12, 2024",
        status: "Confirmed",
        amount: "$2,748"
      }
    ];

    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        <Navbar />

        <main className="flex-1 pt-32 pb-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-red-800">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{t('welcome')}, {displayName}</h1>
                  <p className="text-neutral-500 dark:text-neutral-400">{user.email}</p>
                </div>
              </div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50">
                <Settings className="mr-2 h-4 w-4" /> {t('accountSettings')}
              </Button>
              <Button onClick={() => signOut()} variant="outline" className="border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8">
              <Card className="border-none bg-white dark:bg-neutral-900 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">{t('memberBenefits')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Badge className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 border-none">Gold</Badge>
                    <span>{t('premiumStatus')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Bell className="h-4 w-4 text-red-800 dark:text-red-500" />
                    <span>2 {t('exclusiveOffersAvailable')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <CreditCard className="h-4 w-4 text-red-800 dark:text-red-500" />
                    <span>$150 {t('travelCreditAvailable')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${RED_VELVET_GRADIENT} border-none text-white shadow-xl`}>
                <CardContent className="p-8">
                  <h3 className="mb-2 text-xl font-bold">{t('planNextTrip')}</h3>
                  <p className="mb-6 text-white/80 text-sm">{t('planNextTripDesc')}</p>
                  <Button className="w-full bg-white text-red-950 hover:bg-white/90" onClick={() => router.push('/destinations')}>
                    {t('exploreMore')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none bg-white dark:bg-neutral-900 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{t('myBookings')}</CardTitle>
                  <Link href="/destinations" className="text-sm font-bold text-red-800 dark:text-red-400 hover:underline">
                    {t('newBooking')}
                  </Link>
                </CardHeader>
                <CardContent>
                  {BOOKINGS.length > 0 ? (
                    <div className="space-y-4">
                      {BOOKINGS.map((booking) => (
                        <div key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${RED_VELVET_GRADIENT} text-white`}>
                              <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900 dark:text-neutral-50">{booking.destination}</p>
                              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.date}</span>
                                <span>ID: {booking.id}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-6 md:justify-end">
                            <div className="text-right">
                              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{booking.amount}</p>
                              <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 border-none">{booking.status}</Badge>
                            </div>
                            <Button variant="ghost" className="text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-900">
                              {t('viewDetailsBtn')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Package className="mx-auto mb-4 h-12 w-12 text-neutral-200 dark:text-neutral-700" />
                      <p className="text-neutral-500 dark:text-neutral-400">{t('noBookingsYet')}</p>
                      <Button className={`mt-6 ${RED_VELVET_GRADIENT} text-white`} onClick={() => router.push('/destinations')}>
                        {t('bookFirstTrip')}
                      </Button>
                    </div>
                  )}
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
