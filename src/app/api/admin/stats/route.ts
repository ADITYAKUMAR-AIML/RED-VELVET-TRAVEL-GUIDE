import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ehjvkszgyidkerornspx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const [
      { count: destCount },
      { count: pkgCount },
      { count: hotelCount },
      { count: flightCount },
      { count: inquiryCount },
      { count: bookingCount },
      { data: inquiriesData },
      { data: bookingsData },
      { data: topHotels },
      { data: destinations }
    ] = await Promise.all([
      supabase.from("destinations").select("*", { count: "exact", head: true }),
      supabase.from("packages").select("*", { count: "exact", head: true }),
      supabase.from("hotels").select("*", { count: "exact", head: true }),
      supabase.from("flights").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("created_at, destination_id").order("created_at", { ascending: false }).limit(1000),
      supabase.from("bookings").select("created_at, destination_id, total_price").order("created_at", { ascending: false }).limit(1000),
      supabase.from("hotels").select("name, rating").order("rating", { ascending: false }).limit(5),
      supabase.from("destinations").select("id, title")
    ]);

    // Process trend data (last 6 months)
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        monthYear: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        bookings: 0,
        inquiries: 0,
        revenue: 0
      });
    }

    inquiriesData?.forEach(inq => {
      const date = new Date(inq.created_at);
      const my = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const mIdx = months.findIndex(m => m.monthYear === my);
      if (mIdx !== -1) months[mIdx].inquiries++;
    });

    bookingsData?.forEach(bk => {
      const date = new Date(bk.created_at);
      const my = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const mIdx = months.findIndex(m => m.monthYear === my);
      if (mIdx !== -1) {
        months[mIdx].bookings++;
        // Try to parse revenue from "total_price" (e.g., "$1,200")
        const priceStr = bk.total_price || "0";
        const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        months[mIdx].revenue += numericPrice;
      }
    });

    // Top Destinations by engagement
    const destStats: Record<string, { name: string, count: number }> = {};
    destinations?.forEach(d => {
      destStats[d.id] = { name: d.title, count: 0 };
    });

    [...(inquiriesData || []), ...(bookingsData || [])].forEach(item => {
      if (item.destination_id && destStats[item.destination_id]) {
        destStats[item.destination_id].count++;
      }
    });

    const popularDestinations = Object.values(destStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      destinations: destCount || 0,
      packages: pkgCount || 0,
      hotels: hotelCount || 0,
      flights: flightCount || 0,
      inquiries: inquiryCount || 0,
      bookings: bookingCount || 0,
      trend: months,
      topHotels: topHotels || [],
      popularDestinations
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({
      destinations: 0,
      packages: 0,
      hotels: 0,
      flights: 0,
      inquiries: 0,
      bookings: 0,
      trend: [],
      topHotels: [],
      popularDestinations: []
    });
  }
}
