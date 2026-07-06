// ============================================================================
// 🛒 SELLER ADMIN & STORE CONFIGURATION FILE (दुकान की सेटिंग्स और कूपन कोड)
// ============================================================================
// यहाँ से आप अपने डिलीवरी लिंक्स (WhatsApp/Download link) और कूपन कोड (Discount Codes) 
// बहुत आसानी से बदल सकते हैं। जब भी कोई कस्टमर पेमेंट करेगा, उसको ऑटोमैटिकली 
// सही लिंक पर भेज दिया जाएगा (Single या Combo के हिसाब से)।
// ============================================================================

export interface CouponCode {
  code: string;           // कूपन कोड का नाम (जैसे: MEESHO50, WELCOME100, FLIPKART50)
  discountAmount: number; // कितने रुपये की छूट देनी है (जैसे: 50, 100)
  minAmount?: number;     // कम से कम कितने का आर्डर होना चाहिए (Optional)
  description: string;    // कूपन के बारे में छोटी जानकारी
  isActive: boolean;      // कूपन चालू (true) है या बंद (false)
}

export const STORE_CONFIG = {
  // ==========================================================================
  // 1. INSTANT DIGITAL DELIVERY LINKS (डिलीवरी लिंक्स कहाँ डालें?)
  // ==========================================================================
  // जब कस्टमर पेमेंट पूरा कर लेगा, तो 3 सेकंड बाद वो ऑटोमैटिकली इस लिंक पर Redirect 
  // हो जाएगा। आप यहाँ अपने WhatsApp Chat का लिंक या Google Drive / Video Tutorial 
  // का सीधा लिंक डाल सकते हैं।
  // ==========================================================================

  // 👉 (A) SINGLE PURCHASE DELIVERY LINK (सिर्फ Meesho टूल ₹199 खरीदने वाले के लिए):
  singleDeliveryUrl: "https://meesho-auto-listing-tool.vercel.app/",

  // 👉 (B) COMBO PURCHASE DELIVERY LINK (Meesho + Flipkart कॉम्बो ₹348 खरीदने वाले के लिए):
  comboDeliveryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=IN&is_targeted_country=false&media_type=all&q=Flipkart%20Auto%20Listing%20Tool&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc",

  // ==========================================================================
  // 2. DISCOUNT COUPON CODES (कूपन कोड और डिस्काउंट यहाँ से बनाएं)
  // ==========================================================================
  // आप नीचे जितने चाहें उतने नए कूपन कोड जोड़ सकते हैं। चेकआउट पेज पर कस्टमर 
  // जब कोड डालेगा, तो ऑटोमैटिकली डिस्काउंट कट जाएगा!
  // ==========================================================================
  coupons: [
    {
      code: "TEST99",
      discountAmount: 999, // 999 means special test coupon that makes final total exactly ₹1
      description: "⚡ 99.9% Testing Discount (Pay only ₹1 for Live PG Verification)",
      isActive: true,
    },
    {
      code: "TEST1RS",
      discountAmount: 999, // Makes final total exactly ₹1
      description: "🧪 Developer Testing Coupon (Pay only ₹1)",
      isActive: true,
    },
    {
      code: "MEESHO50",
      discountAmount: 50,
      description: "🎉 ₹50 Instant Discount on Auto Listing Tool!",
      isActive: true,
    },
    {
      code: "FLIPKART100",
      discountAmount: 100,
      description: "🔥 Special ₹100 Flat OFF for Flipkart Sellers!",
      isActive: true,
    },
    {
      code: "COMBO50",
      discountAmount: 50,
      description: "👑 Extra ₹50 OFF on Combo Package!",
      isActive: true,
    },
    {
      code: "FREETEST",
      discountAmount: 999, // Testing discount
      description: "⚡ Developer Testing Coupon (Pay only ₹1)",
      isActive: true,
    }
  ] as CouponCode[],

  // ==========================================================================
  // 3. AUTOMATIC EMAIL DELIVERY CONFIG (EmailJS - पेमेंट के बाद ऑटोमैटिक ईमेल भेजने के लिए)
  // ==========================================================================
  emailjs: {
    serviceId: "service_zaez5jj",      // Your EmailJS Service ID
    templateId: "template_v62f7oz",    // Your EmailJS Template ID
    publicKey: "CSaUWlrxqThlBwlRF",    // Your EmailJS Public Key
    enabled: true,                     // Automatically send delivery email when payment succeeds
  },

  // Support WhatsApp Number & Email
  supportWhatsapp: "6295429762",
  supportEmail: "ska80ali@gmail.com",
};
