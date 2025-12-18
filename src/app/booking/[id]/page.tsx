"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { CreditCard, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [destination, setDestination] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    dates: "",
    travelers: 2
  });

  React.useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
    
    fetch(`/api/destinations/${id}`)
      .then(res => res.json())
      .then(data => setDestination(data))
      .catch(err => console.error(err));
  }, [id, user, router]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          destination_id: id,
          dates: formData.dates,
          travelers: formData.travelers,
          total_price: destination.price
        })
      });
      
      if (res.ok) {
        router.push('/dashboard?message=Booking confirmed!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !destination) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">{t('confirmBooking')}</h2>
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2 block">{t('travelDates')}</label>
                    <Input 
                      placeholder="e.g. June 12 - June 20" 
                      required 
                      className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                      value={formData.dates}
                      onChange={e => setFormData({...formData, dates: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2 block">{t('numberOfTravelers')}</label>
                    <Input 
                      type="number" 
                      min="1" 
                      required 
                      className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                      value={formData.travelers}
                      onChange={e => setFormData({...formData, travelers: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-white dark:bg-neutral-900 border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                    <CreditCard className="h-5 w-5 text-red-800 dark:text-red-500" /> {t('paymentDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder={t('cardholderName')} required className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                  <Input placeholder={t('cardNumber')} required className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" required className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                    <Input placeholder="CVC" required className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={loading} className={`w-full h-16 text-xl font-bold ${RED_VELVET_GRADIENT} text-white`}>
                {loading ? t('processing') : `${t('completeBooking')} - ${destination.price}`}
              </Button>
            </form>
          </div>

          <div>
            <Card className="bg-white dark:bg-neutral-900 border-none shadow-xl overflow-hidden">
              <div className="relative h-48">
                <img src={destination.image_url} alt={destination.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">{destination.title}</h3>
                <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <div className="flex justify-between font-medium text-neutral-700 dark:text-neutral-300">
                    <span>{t('baseFare')}</span>
                    <span>{destination.price}</span>
                  </div>
                  <div className="flex justify-between font-medium text-neutral-700 dark:text-neutral-300">
                    <span>{t('taxesFees')}</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t border-neutral-100 dark:border-neutral-800 pt-4 text-red-950 dark:text-red-400">
                    <span>{t('total')}</span>
                    <span>{destination.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
