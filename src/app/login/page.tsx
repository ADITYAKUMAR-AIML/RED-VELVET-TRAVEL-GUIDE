"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

import { useAuth } from "@/context/AuthContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export default function LoginPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.push("/");
    }
  }, [mounted, authLoading, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  if (!mounted || authLoading) return null;

  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950 p-6 transition-colors duration-300">
      <Link href="/" className="absolute top-10 flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter text-red-600">
          ORCHIDS<span className="text-neutral-900 dark:text-neutral-50">TRAVEL</span>
        </span>
      </Link>

      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-neutral-900 border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{t('welcomeBack')}</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            {t('enterCredentials')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-900 dark:text-neutral-50">{t('email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-neutral-900 dark:text-neutral-50">{t('password')}</Label>
                <Link href="#" className="text-sm text-red-800 dark:text-red-400 hover:underline">
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${RED_VELVET_GRADIENT} py-6 text-lg font-bold text-white`}
              disabled={loading}
            >
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {t('noAccount')}{" "}
            <Link href="/signup" className="font-bold text-red-800 dark:text-red-400 hover:underline">
              {t('signup')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
