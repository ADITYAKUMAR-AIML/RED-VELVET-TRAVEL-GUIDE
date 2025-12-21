"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  MapPin, 
  Hotel, 
  Package, 
  Users, 
  Plus, 
  TrendingUp,
  Calendar,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ActivityEngagementChart, 
  RevenuePerformanceChart, 
  InquiryTrendsChart, 
  TopPerformingHotels, 
  TrendingLocations 
} from "@/components/admin/DashboardCharts";

export default function AdminPage() {
  const [stats, setStats] = useState({
    destinations: 0,
    hotels: 0,
    packages: 0,
    bookings: 0,
    inquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Manage your travel platform content and bookings.
            </p>
          </div>
          <Link href="/admin/add">
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Add New Item
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard 
            title="Total Destinations" 
            value={stats.destinations} 
            icon={MapPin} 
            color="text-blue-500" 
          />
          <StatCard 
            title="Active Hotels" 
            value={stats.hotels} 
            icon={Hotel} 
            color="text-indigo-500" 
          />
          <StatCard 
            title="Tour Packages" 
            value={stats.packages} 
            icon={Package} 
            color="text-orange-500" 
          />
          <StatCard 
            title="Total Bookings" 
            value={stats.bookings} 
            icon={Calendar} 
            color="text-green-500" 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <ActivityEngagementChart />
          <RevenuePerformanceChart />
          <InquiryTrendsChart />
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="md:col-span-2">
            <TopPerformingHotels />
          </div>
          <div className="md:col-span-1">
            <TrendingLocations />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2 border-none shadow-md bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">New Booking Confirmed</p>
                      <p className="text-xs text-neutral-500">2 minutes ago • Santorini, Greece</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/add?type=destinations">
                <Button variant="outline" className="w-full justify-start gap-2 h-12">
                  <MapPin className="w-4 h-4 text-blue-500" /> Add Destination
                </Button>
              </Link>
              <Link href="/admin/add?type=hotels">
                <Button variant="outline" className="w-full justify-start gap-2 h-12">
                  <Hotel className="w-4 h-4 text-indigo-500" /> Add Hotel
                </Button>
              </Link>
              <Link href="/admin/add?type=packages">
                <Button variant="outline" className="w-full justify-start gap-2 h-12">
                  <Package className="w-4 h-4 text-orange-500" /> Add Package
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
