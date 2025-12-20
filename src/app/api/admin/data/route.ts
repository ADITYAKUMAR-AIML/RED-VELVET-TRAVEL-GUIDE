import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ehjvkszgyidkerornspx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const validTables = ["destinations", "packages", "hotels", "inquiries", "bookings", "flights"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");

  if (!table) {
    return NextResponse.json({ error: "Table name is required" }, { status: 400 });
  }

  if (!validTables.includes(table)) {
    return NextResponse.json({ error: "Invalid table name" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const body = await req.json();

    if (!table) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    if (!validTables.includes(table)) {
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 });
    }

    // Handle any data transformations if needed
    // For example, parsing JSON strings if they come as strings
    const dataToInsert = { ...body };
    
    // Remove id if it exists to let database generate it
    delete dataToInsert.id;
    delete dataToInsert.created_at;

    const { data, error } = await supabase
      .from(table)
      .insert([dataToInsert])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
