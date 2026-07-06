const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || "1328720fa4876cfc5f2d083d40b0278231";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_191a5a5fa4c7f489f3101dbe6712549a_fcb45fb9";
const CASHFREE_API_URL = "https://api.cashfree.com/pg/orders";

const setCorsHeaders = (res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-client-id, x-client-secret"
  );
};

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { customer_name, customer_phone, customer_email, order_amount, plan_type, return_url_base } = req.body || {};

    if (!order_amount || !customer_phone) {
      return res.status(400).json({ error: "order_amount and customer_phone are required" });
    }

    const cleanPhone = String(customer_phone).replace(/\D/g, "").slice(-10) || "9999999999";
    const cleanEmail = customer_email || "ska80ali@gmail.com";
    const cleanName = customer_name || "Valued Seller";
    const plan = plan_type === "combo" ? "combo" : "single";

    const timestamp = Date.now();
    const order_id = `order_${plan}_${timestamp}_${Math.floor(Math.random() * 1000)}`;
    const customer_id = `cust_${cleanPhone}_${Math.floor(Math.random() * 10000)}`;

    // Construct return URL with plan parameter
    const origin = return_url_base || (req.headers.origin || "https://superprofile.bio");
    const returnUrl = `${origin}/?order_id={order_id}&payment_status={order_status}&plan=${plan}`;

    const payload = {
      order_amount: Number(order_amount),
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: customer_id,
        customer_phone: cleanPhone,
        customer_email: cleanEmail,
        customer_name: cleanName
      },
      order_meta: {
        return_url: returnUrl
      },
      order_note: plan === "combo" ? "Meesho + Flipkart Auto Listing Tool Combo" : "Meesho Auto Listing Tool Single"
    };

    console.log("Creating Cashfree Order:", order_id, "for plan:", plan, "amount: ₹" + order_amount);

    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.warn("Cashfree API returned error or missing session:", data);
      // Fallback simulation session if API key credentials reject or fail in non-prod environment
      return res.status(200).json({
        success: true,
        order_id: order_id,
        payment_session_id: data.payment_session_id || `sim_session_${order_id}`,
        order_status: data.order_status || "ACTIVE",
        plan_type: plan,
        is_simulated: !data.payment_session_id,
        raw_error: !data.payment_session_id ? data : undefined
      });
    }

    return res.status(200).json({
      success: true,
      order_id: data.order_id || order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
      plan_type: plan
    });
  } catch (err: any) {
    console.error("Error creating Cashfree order:", err);
    return res.status(500).json({ 
      error: "Internal Server Error during order creation", 
      details: err?.message || String(err) 
    });
  }
}
