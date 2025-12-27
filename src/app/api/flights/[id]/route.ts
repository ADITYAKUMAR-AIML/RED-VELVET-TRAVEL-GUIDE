import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ehjvkszgyidkerornspx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Flight ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("flights")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Flight not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching flight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
