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
      { count: inquiryCount },
      { count: bookingCount }
    ] = await Promise.all([
      supabase.from("destinations").select("*", { count: "exact", head: true }),
      supabase.from("packages").select("*", { count: "exact", head: true }),
      supabase.from("hotels").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true })
    ]);

    return NextResponse.json({
      destinations: destCount || 0,
      packages: pkgCount || 0,
      hotels: hotelCount || 0,
      inquiries: inquiryCount || 0,
      bookings: bookingCount || 0
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
