import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FEATURED_HOTELS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  try {
    let query = supabase.from('hotels').select('*');
    
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.limit(8);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured hotels:', error);
    const q = (location || '').toLowerCase();
    const fallback = FEATURED_HOTELS
      .filter(h => 
        !q || 
        h.location?.toLowerCase().includes(q) || 
        h.name?.toLowerCase().includes(q)
      )
      .slice(0, 8);
    return NextResponse.json(fallback);
  }
}
