export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const payload = req.body;
    console.log("Cashfree Webhook received on Vercel:", JSON.stringify(payload));
    return res.status(200).json({ status: "ok", received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ status: "error" });
  }
}
