export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'URL is required.' });

  const apiKey = process.env.SEOPTIMER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Audit service not configured.' });

  try {
    const upstream = await fetch('https://api.seoptimer.com/v1/report/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json',
        'x-api-key':     apiKey,
      },
      body: JSON.stringify({ url }),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Could not reach the audit service. Try again.' });
  }
}
