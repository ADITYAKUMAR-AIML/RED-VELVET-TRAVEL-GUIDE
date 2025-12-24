import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  try {
    let query = supabase.from('packages').select('*');
    
    if (location) {
      query = query.or(`destination.ilike.%${location}%,title.ilike.%${location}%`);
    }

    const { data, error } = await query.limit(8);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return NextResponse.json([]);
  }
}
