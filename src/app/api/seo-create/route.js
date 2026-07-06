import { NextResponse } from 'next/server';

export async function POST(request) {
  const { url } = await request.json().catch(() => ({}));
  if (!url) return NextResponse.json({ error: 'URL is required.' }, { status: 400 });

  const apiKey = process.env.SEOPTIMER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Audit service not configured.' }, { status: 500 });

  try {
    const upstream = await fetch('https://api.seoptimer.com/v1/report/create', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept:          'application/json',
        'x-api-key':     apiKey,
      },
      body: JSON.stringify({ url }),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Could not reach the audit service. Try again.' }, { status: 500 });
  }
}
