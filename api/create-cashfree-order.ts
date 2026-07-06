export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { planId, planName, price, customerName, customerPhone, customerEmail, returnUrl } = req.body || {};

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = (process.env.CASHFREE_ENVIRONMENT || "production").toLowerCase();

  if (!appId || !secretKey || appId.includes("your_") || appId.trim() === "") {
    return res.status(200).json({
      status: "setup_required",
      message: "Cashfree API credentials are not yet configured in Vercel Environment Variables.",
      requiredKeys: ["CASHFREE_APP_ID", "CASHFREE_SECRET_KEY", "CASHFREE_ENVIRONMENT"],
      amount: price,
      planName: planName || "Selected Automation Plan"
    });
  }

  const baseUrl = env === "sandbox"
    ? "https://sandbox.cashfree.com/pg/orders"
    : "https://api.cashfree.com/pg/orders";

  const orderId = `MEESHO_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const origin = req.headers?.origin || req.headers?.host ? (req.headers.origin || `https://${req.headers.host}`) : "https://meesho-auto-listing-tool.vercel.app";
  const finalReturnUrl = returnUrl || `${origin}/?order_id=${orderId}&payment_status={order_status}`;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: price || 199,
        order_currency: "INR",
        order_note: planName || "Automation Tool License",
        customer_details: {
          customer_id: customerPhone ? `cust_${customerPhone}` : `cust_${Date.now()}`,
          customer_name: customerName || "Meesho Seller",
          customer_email: customerEmail || "seller@meesho.com",
          customer_phone: customerPhone || "9999999999"
        },
        order_meta: {
          return_url: finalReturnUrl
        }
      })
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res.status(response.status).json({
        status: "error",
        message: data?.message || "Failed to initiate payment session with Cashfree.",
        details: data
      });
    }

    return res.status(200).json({
      status: "success",
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      payment_url: data.payment_link
    });
  } catch (err: any) {
    console.error("Cashfree Network Exception:", err);
    return res.status(500).json({
      status: "error",
      message: "Network error occurred while connecting to Cashfree payment gateway."
    });
  }
}
