import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(5);

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json([]);
    }

    // Map database fields to the structure expected by the frontend if necessary
    const results = data.map((dest: any) => ({
      id: dest.id,
      name: dest.name,
      country: dest.country || "India",
      image_url: dest.image_url || "https://images.unsplash.com/photo-1506929562872-bb421553b3f1?auto=format&fit=crop&q=80",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Internal Search error:", error);
    return NextResponse.json([]);
  }
}
