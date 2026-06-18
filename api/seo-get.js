export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Report ID is required.' });

  const apiKey = process.env.SEOPTIMER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Audit service not configured.' });

  try {
    const upstream = await fetch(`https://api.seoptimer.com/v1/report/get/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    apiKey,
      },
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Could not fetch report status.' });
  }
}
