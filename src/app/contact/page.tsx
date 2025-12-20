"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageSquare, Lock } from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function ContactPage() {
  const { t } = useLanguage();
  const { user, profile, loading: authLoading } = useAuth();
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mounted, setMounted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Sync formData with auth state
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: profile?.full_name || prev.name || "",
        email: user.email || ""
      }));
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setStatus("sending");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData(prev => ({ ...prev, subject: "", message: "" }));
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-50 md:text-5xl">{t('speakWithSpecialist')}</h1>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {t('speakWithSpecialistDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-8">
              <Card className="border-none bg-white dark:bg-neutral-900 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="mb-6 text-xl font-bold text-neutral-900 dark:text-neutral-50">{t('contactFooter')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${RED_VELVET_GRADIENT} text-white`}>
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{t('emailUs')}</p>
                        <p className="text-neutral-600 dark:text-neutral-400">kumaradityasrm@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${RED_VELVET_GRADIENT} text-white`}>
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{t('callAnytime')}</p>
                        <p className="text-neutral-600 dark:text-neutral-400">+1 (555) 000-0000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${RED_VELVET_GRADIENT} text-white`}>
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Visit Us</p>
                        <p className="text-neutral-600 dark:text-neutral-400">123 Luxury Lane, Geneva, Switzerland</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${RED_VELVET_GRADIENT} border-none text-white shadow-xl`}>
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Live Chat</h3>
                  <p className="mb-6 text-white/80">Available 24/7 for our premium members.</p>
                  <Button variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-none bg-white dark:bg-neutral-900 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  {authLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
                    </div>
                  ) : !user ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
                      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
                        Please log in to your account to send an inquiry to our specialists.
                      </p>
                      <Link href="/login">
                        <Button className={`px-10 h-14 text-lg font-bold ${RED_VELVET_GRADIENT}`}>
                          Login to Continue
                        </Button>
                      </Link>
                    </div>
                  ) : status === "sent" ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400">
                        <Send className="h-10 w-10" />
                      </div>
                      <h3 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">{t('messageReceived')}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {t('messageReceivedDesc')}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-8 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                        onClick={() => setStatus("idle")}
                      >
                        {t('sendAnotherMessage')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-neutral-900 dark:text-neutral-50">{t('fullName')}</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          required 
                          className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-neutral-900 dark:text-neutral-50">{t('yourInquiry')}</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          required 
                          className="py-6 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-neutral-900 dark:text-neutral-50">{t('yourInquiry')}</Label>
                        <Textarea 
                          id="message" 
                          placeholder={t('inquiryPlaceholder')} 
                          required 
                          className="min-h-[150px] rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      <Button type="submit" disabled={status === "sending"} className={`w-full ${RED_VELVET_GRADIENT} py-7 text-lg font-bold shadow-xl text-white`}>
                        {status === "sending" ? t('sending') : t('sendInquiry')}
                      </Button>
                      <p className="text-xs text-center text-neutral-400">
                        Sending inquiry as <span className="text-red-600 font-bold">{user.email}</span>
                      </p>
                      {status === "error" && (
                        <p className="text-red-500 text-center text-sm font-medium">Something went wrong. Please try again later.</p>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
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
