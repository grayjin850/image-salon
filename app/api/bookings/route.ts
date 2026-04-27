import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      client_name,
      client_phone,
      client_email,
      service_id,
      service_name,
      preferred_date,
      preferred_time,
      notes,
    } = body;

    if (!client_name || !client_phone || !service_name || !preferred_date || !preferred_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('bookings').insert({
      client_name,
      client_phone,
      client_email,
      service_id,
      service_name,
      preferred_date,
      preferred_time,
      notes,
      status: 'pending',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}