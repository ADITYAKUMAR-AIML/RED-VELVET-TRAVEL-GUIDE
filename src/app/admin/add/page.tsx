"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Hotel, 
  Package, 
  Plane,
  Image as ImageIcon,
  Save,
  Loader2,
  CheckCircle2,
  Plus,
  Star,
  List,
  Clock,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AddContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("destinations");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    
    // Transform data for specific types
    const data: any = { ...rawData };

    if (type === "hotels") {
      data.rating = parseInt(rawData.rating as string) || 5;
      data.amenities = (rawData.amenities as string).split(",").map(s => s.trim());
    }

    if (type === "packages") {
      data.features = (rawData.features as string).split(",").map(s => s.trim());
    }

    if (type === "destinations") {
      data.details = {
        bestTime: rawData.bestTime,
        activities: (rawData.activities as string || "").split(",").map(s => s.trim())
      };
      delete data.bestTime;
      delete data.activities;
    }

    try {
      const res = await fetch(`/api/admin/data?table=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Content added successfully!");
        setTimeout(() => {
          setSuccess(false);
          router.push("/admin");
        }, 2000);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add content");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-24 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/admin')}
          className="mb-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <Card className="border-none shadow-2xl bg-white dark:bg-neutral-900 overflow-hidden">
          <CardHeader className="bg-neutral-900 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-600 text-white">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Add New Content</CardTitle>
                <CardDescription className="text-neutral-400">Expand your platform with new travel options.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Content Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-14 rounded-xl border-neutral-200 dark:border-neutral-800">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-neutral-200 dark:border-neutral-800">
                    <SelectItem value="destinations">Destination</SelectItem>
                    <SelectItem value="packages">Tour Package</SelectItem>
                    <SelectItem value="hotels">Hotel Listing</SelectItem>
                    <SelectItem value="flights">Flight Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dynamic Fields based on Type */}
                
                {/* DESTINATIONS */}
                {type === "destinations" && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Title</Label>
                      <Input name="title" placeholder="e.g. Magical Maldives" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Country</Label>
                      <Input name="country" placeholder="e.g. Maldives" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Location</Label>
                      <Input name="location" placeholder="e.g. Male Atoll" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Tag</Label>
                      <Input name="tag" placeholder="e.g. Romantic" className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Best Time to Visit</Label>
                      <Input name="bestTime" placeholder="e.g. Nov to Apr" className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Activities (comma separated)</Label>
                      <Input name="activities" placeholder="Diving, Surfing, Dining" className="h-14 rounded-xl" />
                    </div>
                  </>
                )}

                {/* PACKAGES */}
                {type === "packages" && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Package Title</Label>
                      <Input name="title" placeholder="e.g. Golden Triangle Tour" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Main Destination</Label>
                      <Input name="destination" placeholder="e.g. North India" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Duration</Label>
                      <Input name="duration" placeholder="e.g. 5 Days / 4 Nights" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Max Group Size</Label>
                      <Input name="group_size" placeholder="e.g. 12 Persons" className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Key Features (comma separated)</Label>
                      <Input name="features" placeholder="Guided Tour, Luxury Hotels, All Meals" className="h-14 rounded-xl" />
                    </div>
                  </>
                )}

                {/* HOTELS */}
                {type === "hotels" && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Hotel Name</Label>
                      <Input name="name" placeholder="e.g. The Taj Mahal Palace" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Location</Label>
                      <Input name="location" placeholder="e.g. Mumbai, India" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Rating (1-5)</Label>
                      <Input name="rating" type="number" min="1" max="5" defaultValue="5" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Amenities (comma separated)</Label>
                      <Input name="amenities" placeholder="Pool, WiFi, Spa, Gym" className="h-14 rounded-xl" />
                    </div>
                  </>
                )}

                {/* FLIGHTS */}
                {type === "flights" && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Airline</Label>
                      <Input name="airline" placeholder="e.g. Emirates" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Flight Number</Label>
                      <Input name="flight_number" placeholder="e.g. EK-201" className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Origin</Label>
                      <Input name="origin" placeholder="e.g. Dubai (DXB)" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Destination</Label>
                      <Input name="destination" placeholder="e.g. New York (JFK)" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Departure Time</Label>
                      <Input name="departure_time" type="datetime-local" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Arrival Time</Label>
                      <Input name="arrival_time" type="datetime-local" required className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Class</Label>
                      <Select name="class" defaultValue="Economy">
                        <SelectTrigger className="h-14 rounded-xl">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="First Class">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Price (incl. currency)</Label>
                  <Input name="price" placeholder="e.g. $1,200" required className="h-14 rounded-xl" />
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Image URL</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input name="image_url" placeholder="https://images.unsplash.com/..." required className="h-14 rounded-xl" />
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Description</Label>
                  <Textarea 
                    name="description" 
                    placeholder="Provide details about this listing..." 
                    className="min-h-[120px] rounded-xl p-4"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || success}
                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : success ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save and Publish
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
