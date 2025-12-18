"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  Plane
} from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function BookingPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const destinationId = searchParams.get("id") || "santorini";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/booking?id=${destinationId}`);
    }
  }, [user, loading, router, destinationId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  if (!mounted || loading) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-12 flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step >= s ? `${RED_VELVET_GRADIENT} text-white` : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-1 w-12 rounded-full ${step > s ? "bg-red-800" : "bg-neutral-200 dark:bg-neutral-800"}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{t('confirmBooking')}</h1>
                <p className="text-neutral-600 dark:text-neutral-400">{t('confirmBooking')}</p>
              </div>
              <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-neutral-900 dark:text-neutral-50 font-bold">
                        <Plane className="h-5 w-5 text-red-600" /> Journey to Santorini
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-900 dark:text-neutral-50">{t('travelDates')}</Label>
                        <Input type="date" defaultValue="2024-09-12" className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-900 dark:text-neutral-50">{t('numberOfTravelers')}</Label>
                        <Input type="number" defaultValue="2" className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800 p-6 space-y-4">
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-50">{t('total')}</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">{t('baseFare')}</span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">$2,598</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">{t('taxesFees')}</span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">$150</span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-between text-xl">
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">{t('total')}</span>
                        <span className="font-black text-red-600">$2,748</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className={`mt-8 w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}
                    onClick={() => setStep(2)}
                  >
                    {t('completeBooking')} <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{t('paymentDetails')}</h1>
                <p className="text-neutral-600 dark:text-neutral-400">{t('secureCheckout')}</p>
              </div>
              <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardContent className="p-8">
                  <form onSubmit={handleBooking} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-neutral-900 dark:text-neutral-50">{t('cardholderName')}</Label>
                      <Input placeholder="John Doe" required className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-900 dark:text-neutral-50">{t('cardNumber')}</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                        <Input placeholder="0000 0000 0000 0000" required className="py-6 pl-10 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-neutral-900 dark:text-neutral-50">MM/YY</Label>
                        <Input placeholder="MM/YY" required className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-900 dark:text-neutral-50">CVV</Label>
                        <Input placeholder="123" required className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950 p-4 text-sm text-blue-700 dark:text-blue-300">
                      <ShieldCheck className="h-5 w-5" /> {t('secureCheckout')}
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" type="button" className="flex-1 py-7 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isProcessing}
                        className={`flex-[2] ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}
                      >
                        {isProcessing ? t('processing') : t('completeBooking')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-none shadow-2xl text-center overflow-hidden bg-white dark:bg-neutral-900">
                <div className={`${RED_VELVET_GRADIENT} py-12 text-white`}>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                  <h2 className="text-4xl font-bold">{t('messageReceived')}</h2>
                  <p className="mt-2 text-white/80">Reservation #VV-98421-2024</p>
                </div>
                <CardContent className="p-12">
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                    {t('messageReceivedDesc')}
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row justify-center">
                    <Button 
                      className={`${RED_VELVET_GRADIENT} px-8 py-6 text-white`}
                      onClick={() => router.push('/dashboard')}
                    >
                      {t('viewDetailsBtn')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                      onClick={() => router.push('/')}
                    >
                      {t('home')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="bg-neutral-950 py-10 text-neutral-400 text-center text-sm border-t border-neutral-800">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Orchids Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
