import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FEATURED_DESTINATIONS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  try {
    let query = supabase.from('destinations').select('*');
    
    if (location) {
      query = query.or(`location.ilike.%${location}%,name.ilike.%${location}%`);
    }

    const { data, error } = await query.limit(8);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    const q = (location || '').toLowerCase();
    const fallback = FEATURED_DESTINATIONS
      .filter(d => 
        !q || 
        d.title?.toLowerCase().includes(q) || 
        d.country?.toLowerCase().includes(q)
      )
      .slice(0, 8);
    return NextResponse.json(fallback);
  }
}
