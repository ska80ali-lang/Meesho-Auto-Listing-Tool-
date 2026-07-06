import { STORE_CONFIG } from '../config/storeConfig';

export async function sendOrderConfirmationEmail(params: {
  email: string;
  orderId: string;
  planType: 'single' | 'combo';
  customerName?: string;
  amountPaid?: number;
}): Promise<{ success: boolean; message?: string }> {
  const { serviceId, templateId, publicKey, enabled } = STORE_CONFIG.emailjs;
  if (!enabled || !serviceId || !templateId || !publicKey) {
    console.warn("⚠️ EmailJS is disabled or missing credentials in storeConfig.ts");
    return { success: false, message: "EmailJS settings incomplete in storeConfig.ts" };
  }

  const isCombo = params.planType === 'combo';
  const toolName = isCombo ? "Meesho + Flipkart Combo Auto Listing Tool Suite" : "Meesho Auto Listing Tool Suite";
  const deliveryLink = isCombo ? STORE_CONFIG.comboDeliveryUrl : STORE_CONFIG.singleDeliveryUrl;
  const priceFormatted = params.amountPaid ? `₹${params.amountPaid}` : (isCombo ? "₹348" : "₹199");

  // We pass all possible template variable names to ensure complete compatibility with your EmailJS template placeholders
  const templateParams = {
    // Recipient email field variations
    to_email: params.email,
    email: params.email,
    customer_email: params.email,
    user_email: params.email,
    to: params.email,

    // Recipient name field variations
    to_name: params.customerName || "Valued Seller",
    customer_name: params.customerName || "Valued Seller",
    user_name: params.customerName || "Valued Seller",
    name: params.customerName || "Valued Seller",

    // Order ID variations
    order_id: params.orderId,
    id: params.orderId,

    // Product & Delivery links variations
    tool_name: toolName,
    package_name: toolName,
    product_name: toolName,
    delivery_link: deliveryLink,
    tool_link: deliveryLink,
    access_link: deliveryLink,
    link: deliveryLink,
    url: deliveryLink,

    // Support info & Price
    support_whatsapp: STORE_CONFIG.supportWhatsapp,
    support_email: STORE_CONFIG.supportEmail,
    price: priceFormatted,
    amount: priceFormatted
  };

  console.info("📤 Triggering EmailJS Automatic Delivery to:", params.email, "for Order ID:", params.orderId);

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.info("✅ EmailJS automatic tool delivery email sent successfully to:", params.email);
      return { success: true, message: "Email sent successfully" };
    } else {
      const errText = await response.text();
      console.error("❌ EmailJS API delivery failed:", response.status, errText);
      return { success: false, message: `EmailJS error (${response.status}): ${errText || 'Check template IDs'}` };
    }
  } catch (err: any) {
    console.error("❌ EmailJS network error:", err);
    return { success: false, message: err?.message || "Network error while sending email" };
  }
}
