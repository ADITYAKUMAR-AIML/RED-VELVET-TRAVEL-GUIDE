"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, User as UserIcon, LogOut, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  
  // STRICT LOGIC: White only on home hero, black elsewhere
  const textColorClass = isHomePage 
    ? (isScrolled ? "text-black dark:text-white" : "text-white")
    : "text-black dark:text-white";

  const logoColorClass = isHomePage
    ? (isScrolled ? "text-red-600" : "text-white")
    : "text-red-600";

  const logoSpanColorClass = isHomePage
    ? (isScrolled ? "text-black dark:text-white" : "text-white/80")
    : "text-black dark:text-white";

  const buttonGhostColorClass = isHomePage
    ? (isScrolled ? "text-black dark:text-white" : "text-white")
    : "text-black dark:text-white";

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

  const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    zh: "Chinese",
    ja: "Japanese",
    vi: "Vietnamese",
    ru: "Russian",
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg py-3" 
          : (isHomePage ? "bg-transparent py-5" : "bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 py-3")
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group">
              <button className={`flex items-center gap-2 text-sm font-semibold transition-colors ${textColorClass}`}>
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{LANGUAGE_NAMES[language]}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                <div className="p-2 flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto">
{Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => setLanguage(code as any)}
                      className={`text-left px-4 py-2 text-sm rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-neutral-50 ${
                        language === code ? "text-red-600 font-bold bg-red-50/50 dark:bg-red-900/10" : ""
                      }`}
                    >
                      {name}
                    </button>
                  ))}

                </div>
              </div>
            </div>

            <Link href="/" className="flex items-center gap-3">
              <span className={`text-xl md:text-2xl font-black tracking-tighter ${logoColorClass}`}>
                ORCHIDS<span className={logoSpanColorClass}>TRAVEL</span>
              </span>
            </Link>

            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full transition-all duration-300 hover:rotate-12 ${
                isScrolled || !isHomePage
                  ? "bg-neutral-100 dark:bg-neutral-900 text-black dark:text-neutral-50" 
                  : "bg-white/10 text-white"
              }`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold transition-all hover:text-red-600 whitespace-nowrap ${
                  textColorClass
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className={buttonGhostColorClass}>
                    <UserIcon className="h-4 w-4 md:mr-2" /> 
                    <span className="hidden md:inline">{t("profile")}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className={buttonGhostColorClass}
                >
                  <LogOut className="h-4 w-4 md:mr-2" /> 
                  <span className="hidden md:inline">{t("logout")}</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className={buttonGhostColorClass}>
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white rounded-full text-xs">
                    {t("signup")}
                  </Button>
                </Link>
              </>
            )}
            <Link href="/destinations" className="hidden sm:block">
              <Button size="sm" className="bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 rounded-full text-xs font-bold">
                {t("bookNow")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
