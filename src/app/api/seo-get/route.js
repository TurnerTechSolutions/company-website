import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Report ID is required.' }, { status: 400 });

  const apiKey = process.env.SEOPTIMER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Audit service not configured.' }, { status: 500 });

  try {
    const upstream = await fetch(`https://api.seoptimer.com/v1/report/get/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    apiKey,
      },
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Could not fetch report status.' }, { status: 500 });
  }
}
