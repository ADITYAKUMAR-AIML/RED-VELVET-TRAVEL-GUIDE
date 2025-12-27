"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, User as UserIcon, LogOut, Sun, Moon, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isHomePage = pathname === "/";
  
    // Determine the display name:
    // 1. Profile full name
    // 2. User metadata full name or name
    // 3. Email username (formatted)
    // 4. Fallback "Traveler"
    const getDisplayName = () => {
      if (profile?.full_name) return profile.full_name;
      if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
      if (user?.user_metadata?.name) return user.user_metadata.name;
      
      if (user?.email) {
        const emailName = user.email.split("@")[0];
        // Capitalize first letter
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }
      
      return t("traveler");
    };

    const userName = getDisplayName();

    const userInitials = userName
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "T";
    
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
      <>
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
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className={`p-2 -ml-2 rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${textColorClass}`}
                >
                  <Menu className="h-5 w-5" />
                </button>
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

              <div className="flex items-center gap-2 md:gap-4 min-w-[120px] justify-end">
                {loading ? (
                  <div className="flex items-center justify-center w-10 h-10">
                    <Loader2 className={`h-5 w-5 animate-spin ${buttonGhostColorClass}`} />
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className={`${buttonGhostColorClass} px-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full`}>
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shrink-0">
                          {userInitials}
                        </div>
                        <span className="hidden md:inline font-bold">Hi, {userName}</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLogout}
                      className={`${buttonGhostColorClass} flex items-center gap-2 px-3 hover:text-red-600 transition-colors`}
                    >
                      <LogOut className="h-4 w-4" /> 
                      <span className="hidden md:inline">{t("logout")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
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
                  </div>
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

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[300px] bg-white dark:bg-neutral-950 z-[101] shadow-2xl flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xl font-black tracking-tighter text-red-600">
                    ORCHIDS<span className="text-black dark:text-white">TRAVEL</span>
                  </span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="h-5 w-5 text-neutral-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-900 dark:text-neutral-50 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                      <span className="font-bold text-lg">Option 1</span>
                    </button>
                    <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-900 dark:text-neutral-50 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                      <span className="font-bold text-lg">Option 2</span>
                    </button>
                    <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-900 dark:text-neutral-50 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                      <span className="font-bold text-lg">Option 3</span>
                    </button>
                  </nav>
                </div>
                <div className="p-6 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 font-medium">© 2024 Orchids Travel</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
}
