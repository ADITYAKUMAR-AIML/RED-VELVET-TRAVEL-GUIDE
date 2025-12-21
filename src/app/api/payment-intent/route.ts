import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ITEM_PRICES: Record<string, Record<string, number>> = {
  hotel: {
    '1': 45000,
    '2': 38000,
    '3': 55000,
    '4': 89000,
  },
  package: {
    '1': 299900,
    '2': 349900,
    '3': 420000,
  },
  destination: {
    'santorini': 129900,
    'kyoto': 145000,
    'swiss-alps': 180000,
  },
};

function parsePriceToCents(priceStr: string): number {
  if (!priceStr) return 0;
  // Remove currency symbols, commas, and spaces
  const numeric = priceStr.replace(/[^0-9.]/g, '');
  return Math.round(parseFloat(numeric) * 100);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, itemType, travelers, dates, userId } = body;

    if (!itemId || !itemType || !travelers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let basePrice = ITEM_PRICES[itemType]?.[itemId];

    if (!basePrice) {
      // Fetch from Supabase if not in hardcoded list
      const table = itemType === 'hotel' ? 'hotels' : itemType === 'package' ? 'packages' : 'destinations';
      const { data, error } = await supabase
        .from(table)
        .select('price')
        .eq('id', itemId)
        .single();

      if (data && !error) {
        basePrice = parsePriceToCents(data.price);
      }
    }

    if (!basePrice) {
      // Fallback for demo if still not found
      basePrice = 10000; // $100.00
    }

    const totalAmount = basePrice * (itemType === 'hotel' ? 1 : travelers);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        itemId,
        itemType,
        travelers: travelers.toString(),
        dates: dates || '',
        userId: userId || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
