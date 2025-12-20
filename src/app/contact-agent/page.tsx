"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function ContactPage() {
  const { t } = useLanguage();
  const { user, profile, loading: authLoading } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");

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
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">{t('speakWithSpecialist')}</h1>
            <p className="text-xl text-neutral-500 dark:text-neutral-400">{t('speakWithSpecialistDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${RED_VELVET_GRADIENT} text-white`}>
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-50">{t('emailUs')}</h4>
                  <p className="text-neutral-500 dark:text-neutral-400">kumaradityasrm@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${RED_VELVET_GRADIENT} text-white`}>
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-50">{t('callAnytime')}</h4>
                  <p className="text-neutral-500 dark:text-neutral-400">+1 (555) 000-0000</p>
                </div>
              </div>
            </div>

            <Card className="md:col-span-2 border-none bg-white dark:bg-neutral-900 shadow-2xl p-8">
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
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{t('messageReceived')}</h2>
                  <p className="text-neutral-500 dark:text-neutral-400">{t('messageReceivedDesc')}</p>
                  <Button onClick={() => setStatus("idle")} className="mt-8">{t('sendAnotherMessage')}</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase text-neutral-500 dark:text-neutral-400">{t('fullName')}</label>
                    <Input 
                      placeholder="John Doe" 
                      required 
                      className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase text-neutral-500 dark:text-neutral-400">{t('yourInquiry')}</label>
                    <Textarea 
                      placeholder={t('inquiryPlaceholder')}
                      className="h-40 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" 
                      required 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={status === "sending"} className={`w-full h-16 text-xl font-bold ${RED_VELVET_GRADIENT} text-white`}>
                    {status === "sending" ? t('sending') : t('sendInquiry')}
                  </Button>
                  <p className="text-xs text-center text-neutral-400">
                    Sending inquiry as <span className="text-red-600 font-bold">{user.email}</span>
                  </p>
                </form>
              )}
            </Card>
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
