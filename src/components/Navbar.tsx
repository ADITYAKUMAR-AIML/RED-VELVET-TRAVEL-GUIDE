"use client";

import * as React from "react";
import Link from "next/link";
import { Globe, User as UserIcon, LogOut, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";

const RED_VELVET_GRADIENT = "bg-gradient-to-r from-[#8a0000] via-[#c00000] to-[#8a0000]";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

    const NAV_LINKS = [
      { name: t("home"), href: "/" },
      { name: t("destinations"), href: "/destinations" },
      { name: t("hotels"), href: "/hotels" },
      { name: t("flights"), href: "/flights" },
      { name: t("packages"), href: "/packages" },
      { name: t("contact"), href: "/contact-agent" },
    ];

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-lg py-3" 
          : "bg-transparent py-5"
      }`}
    >
        <div className="flex items-center justify-start gap-8 px-8 w-full">
          <div className="flex items-center gap-8 shrink-0">
            {/* Language Dropdown - Most Left */}
            <div className="relative group">
              <button className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isScrolled ? "text-black dark:text-neutral-50" : "text-white"}`}>
                <Globe className="h-4 w-4" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                <div className="p-2 flex flex-col gap-1.5">
                  {["en", "es", "fr", "de"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as any)}
                      className={`text-left px-4 py-2 text-sm rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors uppercase text-neutral-900 dark:text-neutral-50 ${
                        language === lang ? "text-red-600 font-bold bg-red-50/50 dark:bg-red-900/10" : ""
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/" className="flex items-center gap-3 shrink-0">
              <span className={`text-2xl font-black tracking-tighter ${isScrolled ? "text-red-600" : "text-white"}`}>
                ORCHIDS<span className={isScrolled ? "text-black dark:text-neutral-50" : "text-white/80"}>TRAVEL</span>
              </span>
            </Link>

            {/* Theme Toggle - Left Aligned */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full transition-all duration-300 hover:rotate-12 shrink-0 bg-neutral-100/10 hover:bg-neutral-100/20 ${
                isScrolled 
                  ? "bg-neutral-100 dark:bg-neutral-900 text-black dark:text-neutral-50" 
                  : "text-white"
              }`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Book Now - Left Aligned */}
            <Link href="/destinations" className="shrink-0">
              <Button className="bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30 px-6 rounded-full text-xs font-bold whitespace-nowrap">
                {t("bookNow")}
              </Button>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex shrink-0">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold transition-all hover:text-red-600 hover:scale-105 whitespace-nowrap ${
                  isScrolled ? "text-black dark:text-neutral-50" : "text-white/90"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className={`px-3 ${isScrolled ? "text-black dark:text-neutral-50" : "text-white"}`}>
                    <UserIcon className="mr-2 h-4 w-4" /> {t("profile")}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className={`px-3 ${isScrolled ? "text-black dark:text-neutral-50" : "text-white"}`}
                >
                  <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={`px-3 ${isScrolled ? "text-black dark:text-neutral-50" : "text-white"}`}>
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white px-5 rounded-full text-xs whitespace-nowrap">
                    {t("signup")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
    </header>
  );
}
