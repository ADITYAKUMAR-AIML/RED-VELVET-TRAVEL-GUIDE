"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  MapPin 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activityData = [
  { name: 'Jul', bookings: 400, inquiries: 240 },
  { name: 'Aug', bookings: 300, inquiries: 139 },
  { name: 'Sep', bookings: 200, inquiries: 980 },
  { name: 'Oct', bookings: 278, inquiries: 390 },
  { name: 'Nov', bookings: 189, inquiries: 480 },
  { name: 'Dec', bookings: 239, inquiries: 380 },
];

const revenueData = [
  { name: 'Aug', value: 2000 },
  { name: 'Sep', value: 4000 },
  { name: 'Oct', value: 3000 },
  { name: 'Nov', value: 6000 },
  { name: 'Dec', value: 5000 },
];

const inquiryData = [
  { name: 'Aug', value: 1000 },
  { name: 'Sep', value: 2000 },
  { name: 'Oct', value: 1500 },
  { name: 'Nov', value: 3000 },
  { name: 'Dec', value: 2500 },
];

const hotelsData = [
  { id: 1, name: "The Oberoi Mumbai", rating: 5.0 },
  { id: 2, name: "The Taj Mahal Palace", rating: 5.0 },
  { id: 3, name: "ITC Maratha", rating: 5.0 },
  { id: 4, name: "JW Marriott Sahar", rating: 5.0 },
  { id: 5, name: "The St. Regis Mumbai", rating: 5.0 },
];

const locationsData = [
  { name: "Lalbagh Botanical Garden", popularity: 95 },
  { name: "Bangalore Palace", popularity: 88 },
  { name: "Cubbon Park", popularity: 82 },
  { name: "Bannerghatta Park", popularity: 75 },
  { name: "ISKCON Temple", popularity: 70 },
];

export function ActivityEngagementChart() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <CardTitle className="text-base">Activity Engagement</CardTitle>
        </div>
        <CardDescription>Monthly bookings and inquiries</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inquiries" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenuePerformanceChart() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <CardTitle className="text-base">Revenue Performance</CardTitle>
        </div>
        <CardDescription>Estimated monthly revenue trend</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function InquiryTrendsChart() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          <CardTitle className="text-base">Inquiry Trends</CardTitle>
        </div>
        <CardDescription>Inquiries volume over time</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={inquiryData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopPerformingHotels() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <CardTitle className="text-base">Top Performing Hotels</CardTitle>
        </div>
        <CardDescription>Ranked by user ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hotelsData.map((hotel, index) => (
            <div key={hotel.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-white">{hotel.name}</p>
                  <div className="flex text-yellow-400 text-[10px] mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200">
                {hotel.rating} Rating
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendingLocations() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <CardTitle className="text-base">Trending Locations</CardTitle>
        </div>
        <CardDescription>Popularity by engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 relative min-h-[300px] flex flex-col justify-center">
             {/* Simulating the word cloud layout from the image with a list for now as word clouds are complex to do perfectly responsive without a library */}
             <div className="flex flex-wrap gap-4 justify-center items-center h-full py-8">
                {locationsData.map((loc, i) => {
                    // Randomize size slightly for "word cloud" effect
                    const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"];
                    const size = sizes[i % sizes.length];
                    const opacities = ["opacity-60", "opacity-80", "opacity-100", "opacity-70", "opacity-90"];
                    const opacity = opacities[i % opacities.length];
                    
                    return (
                        <div key={i} className={`text-center ${size} ${opacity} font-medium text-neutral-700 dark:text-neutral-300 p-2`}>
                            {loc.name.split(" ").map((word, w) => (
                                <div key={w}>{word}</div>
                            ))}
                        </div>
                    );
                })}
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
