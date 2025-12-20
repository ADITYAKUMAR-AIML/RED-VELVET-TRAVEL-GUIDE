"use client";

import Link from "next/link";
import { LogIn, UserPlus, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginPromptDialog({ open, onOpenChange }: LoginPromptDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
            Save Your Favorites
          </DialogTitle>
          <DialogDescription className="text-neutral-600 dark:text-neutral-400 pt-2">
            Sign in to save your favorite destinations, hotels, and packages. Create your personalized travel wishlist!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/login" onClick={() => onOpenChange(false)}>
            <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold">
              <LogIn className="mr-2 h-5 w-5" />
              {t("login")}
            </Button>
          </Link>
          <Link href="/signup" onClick={() => onOpenChange(false)}>
            <Button 
              variant="outline" 
              className="w-full h-12 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {t("createAccount")}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
