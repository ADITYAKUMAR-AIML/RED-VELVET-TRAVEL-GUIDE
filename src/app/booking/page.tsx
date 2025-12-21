"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  Plane,
  MapPin,
  Hotel,
  Package,
  Loader2,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

const ITEMS: Record<string, Record<string, { name: string; location: string; price: number; image: string }>> = {
  hotel: {
    '1': { name: "The Velvet Oasis", location: "Santorini, Greece", price: 450, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop" },
    '2': { name: "Imperial Gardens", location: "Kyoto, Japan", price: 380, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop" },
    '3': { name: "Alpine Majesty Resort", location: "Zermatt, Switzerland", price: 550, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop" },
    '4': { name: "Azure Lagoon Retreat", location: "Bora Bora", price: 890, image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=400&auto=format&fit=crop" },
  },
  package: {
    '1': { name: "Honeymoon in Paradise", location: "Santorini, Greece", price: 2999, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=400&auto=format&fit=crop" },
    '2': { name: "Zen Cultural Journey", location: "Kyoto & Tokyo, Japan", price: 3499, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop" },
    '3': { name: "Alpine Adventure Plus", location: "Swiss Alps", price: 4200, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=400&auto=format&fit=crop" },
  },
  destination: {
    'santorini': { name: "Santorini, Greece", location: "Cyclades, Greece", price: 1299, image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=400&auto=format&fit=crop" },
    'kyoto': { name: "Kyoto, Japan", location: "Kansai, Japan", price: 1450, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop" },
    'swiss-alps': { name: "Swiss Alps, Switzerland", location: "Bernese Oberland", price: 1800, image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=400&auto=format&fit=crop" },
  },
};

function PaymentForm({ 
  onSuccess, 
  onBack,
  amount 
}: { 
  onSuccess: () => void; 
  onBack: () => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50 max-h-[400px] overflow-y-auto">
        <PaymentElement 
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>
      
      {errorMessage && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 p-4 text-sm text-blue-700 dark:text-blue-300">
        <ShieldCheck className="h-5 w-5 flex-shrink-0" /> 
        Secured by Stripe. Your payment information is encrypted.
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          type="button" 
          className="flex-1 py-7 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" 
          onClick={onBack}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing || !isReady}
          className={`flex-[2] ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white disabled:opacity-50`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ${(amount / 100).toLocaleString()}</>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function BookingPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    }>
      <BookingContent />
    </React.Suspense>
  );
}

function BookingContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = React.useState(1);
  const [mounted, setMounted] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState(0);
  const [isCreatingIntent, setIsCreatingIntent] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<string | null>(null);

  const [travelers, setTravelers] = React.useState(2);
  const [dates, setDates] = React.useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });

  const [item, setItem] = React.useState<{ name: string; location: string; price: number; image: string } | null>(null);

  const itemId = searchParams.get("id") || "santorini";
  const itemType = (searchParams.get("type") || "destination") as "hotel" | "package" | "destination";

  React.useEffect(() => {
    setMounted(true);
    
    // Check hardcoded list first
    const hardcodedItem = ITEMS[itemType]?.[itemId];
    if (hardcodedItem) {
      setItem(hardcodedItem);
    } else {
      // Fetch from Supabase
      const fetchItem = async () => {
        try {
          const table = itemType === 'hotel' ? 'hotels' : itemType === 'package' ? 'packages' : 'destinations';
          const nameField = itemType === 'hotel' ? 'name' : 'title';
          const { data, error } = await supabase
            .from(table)
            .select(`${nameField}, price, location, image_url`)
            .eq('id', itemId)
            .single();

          if (data && !error) {
            setItem({
              name: data[nameField],
              location: data.location || '',
              price: parseInt(data.price.replace(/[^0-9]/g, '')) || 100,
              image: data.image_url || 'https://images.unsplash.com/photo-1506929562872-bb421553b3f1?auto=format&fit=crop&q=80',
            });
          } else {
            // Final fallback
            setItem(ITEMS.destination.santorini);
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setItem(ITEMS.destination.santorini);
        }
      };
      fetchItem();
    }
  }, [itemId, itemType]);

  const basePrice = (item?.price || 0) * 100;
  const taxFee = itemType === 'hotel' ? 5000 : 15000;
  const calculatedTotal = (itemType === 'hotel' ? basePrice : basePrice * travelers) + taxFee;

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/booking?id=${itemId}&type=${itemType}`);
    }
  }, [user, authLoading, router, itemId, itemType]);

  const createPaymentIntent = async () => {
    setIsCreatingIntent(true);
    try {
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType,
          travelers,
          dates,
          userId: user?.id || '',
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setAmount(data.amount);
        setStep(2);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const itemIdColumn = itemType === 'hotel' ? 'hotel_id' : 
                           itemType === 'package' ? 'package_id' : 'destination_id';

      const { data, error } = await supabase.from('bookings').insert({
        user_id: user?.id,
        [itemIdColumn]: itemId,
        item_type: itemType,
        travelers,
        dates,
        total_price: (amount / 100).toString(),
        status: 'confirmed',
        payment_intent_id: paymentIntentId,
      }).select().single();

      if (error) throw error;
      setBookingId(data?.id);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
    setStep(3);
  };

  const getIcon = () => {
    switch (itemType) {
      case 'hotel': return <Hotel className="h-5 w-5 text-red-600" />;
      case 'package': return <Package className="h-5 w-5 text-red-600" />;
      default: return <Plane className="h-5 w-5 text-red-600" />;
    }
  };

  if (!mounted || authLoading) return null;

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
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 3 && <div className={`h-1 w-12 rounded-full ${step > s ? "bg-red-800" : "bg-neutral-200 dark:bg-neutral-800"}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Confirm Your Booking</h1>
                <p className="text-neutral-600 dark:text-neutral-400">Review your selection and proceed to payment</p>
              </div>
              <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50 font-bold">
                            {getIcon()} {item.name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            <MapPin className="h-4 w-4" /> {item.location}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {t('travelDates') || 'Travel Date'}
                          </Label>
                          <Input 
                            type="date" 
                            value={dates}
                            onChange={(e) => setDates(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                            <Users className="h-4 w-4" /> {t('numberOfTravelers') || 'Number of Travelers'}
                          </Label>
                          <Input 
                            type="number" 
                            value={travelers}
                            onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            max={10}
                            className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800 p-6 space-y-4">
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-50">Price Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {itemType === 'hotel' ? 'Per Night' : `Base Price × ${travelers}`}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">
                          ${itemType === 'hotel' ? item.price.toLocaleString() : (item.price * travelers).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Taxes & Fees</span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">${(taxFee / 100).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-between text-xl">
                        <span className="font-bold text-neutral-900 dark:text-neutral-50">Total</span>
                        <span className="font-black text-red-600">${(calculatedTotal / 100).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`mt-8 w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white disabled:opacity-50`}
                    onClick={createPaymentIntent}
                    disabled={isCreatingIntent}
                  >
                    {isCreatingIntent ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Preparing Payment...
                      </>
                    ) : (
                      <>
                        Continue to Payment <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && clientSecret && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Payment Details</h1>
                <p className="text-neutral-600 dark:text-neutral-400">Complete your secure payment</p>
              </div>
              <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardContent className="p-8">
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#c00000',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <PaymentForm 
                      onSuccess={handlePaymentSuccess} 
                      onBack={() => setStep(1)}
                      amount={amount}
                    />
                  </Elements>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-none shadow-2xl text-center overflow-hidden bg-white dark:bg-neutral-900">
                <div className={`${RED_VELVET_GRADIENT} py-12 text-white`}>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <h2 className="text-4xl font-bold">Booking Confirmed!</h2>
                  {bookingId && (
                    <p className="mt-2 text-white/80">Confirmation #{bookingId.slice(0, 8).toUpperCase()}</p>
                  )}
                </div>
                <CardContent className="p-12">
                  <div className="mb-8 space-y-2">
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{item.name}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">{item.location}</p>
                    <p className="text-sm text-neutral-500">
                      {dates} • {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-4">
                      ${(amount / 100).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    A confirmation email has been sent to your registered email address with all the booking details.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row justify-center">
                    <Button 
                      className={`${RED_VELVET_GRADIENT} px-8 py-6 text-white`}
                      onClick={() => router.push('/dashboard')}
                    >
                      View My Bookings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                      onClick={() => router.push('/')}
                    >
                      Back to Home
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
