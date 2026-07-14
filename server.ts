import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { fileURLToPath } from "url";

dotenv.config();

// Deriving __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfigPath = path.join(__dirname, "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(express.json());

  // Lazy Initialization of Gemini SDK safegaurded against missing / empty keys
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey.trim() !== "" && apiKey !== "undefined") {
        try {
          aiClient = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });
        } catch (err) {
          console.warn("Failed to initialize GoogleGenAI class:", err);
          return null;
        }
      }
    }
    return aiClient;
  }

  // API Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const msgLower = message.toLowerCase().trim();
    
    // Robust system fallback response generator
    const getFallbackResponse = () => {
      if (msgLower.includes("combo") || msgLower.includes("both") || msgLower.includes("discount") || msgLower.includes("flipkart") || msgLower.includes("meesho + flipkart") || msgLower.includes("bundle") || msgLower.includes("pack") || msgLower.includes("offer") || msgLower.includes("dono")) {
        return "Haanji! Humare paas ek best-selling **Meesho + Flipkart Auto Listing combo pack** offer h:\n\n" +
          "• **Combo Features:** Isme Meesho aur Flipkart dono ke premium Chrome Extension auto-listing tools mil jayeinge standard lifetime update ke sath.\n" +
          "• **Plan Price:** Normal individual pricing ₹199 + ₹199 = ₹398 hoti h, par combo lene par **flat ₹50 discount** milta h. Toh aapko yeh bundle sirf **₹348** me milega.\n" +
          "• **Lifetime Support:** One-time purchase, lifetime update options, NO recurring monthly fees!\n\n" +
          "Aap niche buy now panel se directly humara highly popular Combo order complete select kar sakte hain.";
      }
      
      if (msgLower.includes("payment") || msgLower.includes("gpay") || msgLower.includes("phonepe") || msgLower.includes("paytm") || msgLower.includes("upi") || msgLower.includes("online") || msgLower.includes("fampay") || msgLower.includes("card") || msgLower.includes("pay ") || msgLower.includes("payme")) {
        return "Ji bilkul tension free rahiye! Sabhi automatic online checkout modes active aur fully secure hain:\n\n" +
          "• **Supported Modes:** Google Pay (GPay), PhonePe, Paytm, FamPay, any other UPI IDs, Net Banking, aur sabhi Credit/Debit Cards.\n" +
          "• Security check guaranteed aur complete fast payment integration h.";
      }

      if (msgLower.includes("kaise milega") || msgLower.includes("get the") || msgLower.includes("get tool") || msgLower.includes("download") || msgLower.includes("redirect") || msgLower.includes("milega") || msgLower.includes("purchase") || msgLower.includes("buy")) {
        return "Bahut hi safe aur asaan fast process hai. Buy karne ke baad yeh options automatically triggers ho jayenge:\n\n" +
          "• **2-Second Auto Redirect:** Jaise hi payment successfully clear hogi, purely **2 seconds ke andar system automatic secure download link page par load** kar dega!\n" +
          "• **Instant Guides:** Download page par Chrome Extension installation kit access files ke sath short step-by-step Hindi setup training guide video direct list play ho jayegi.\n" +
          "• **Secondary Backup:** Parallel me billing checkout details me fill kiye gaye Email ID aur primary WhatsApp contact par humare automation tools instant backup link send kar denge.";
      }

      if (msgLower.includes("how it works") || msgLower.includes("kaise kaam") || msgLower.includes("working") || msgLower.includes("work") || msgLower.includes("kaise kam") || msgLower.includes("fill") || msgLower.includes("feature") || msgLower.includes("chalega")) {
        return "Yeh tool asaan step-by-step Chrome Extension automation workflow par kaam karta h:\n\n" +
          "• **1. Extension Based 1-Click Auto Fill:** Yeh koi general database spreadsheets seed filling nahi hai! Jab aap Meesho ya Flipkart dashboard tab par 'Add Single Catalog' select page open karte hain, tab right-side panel me extension fully load ho jata h. 'Auto Fill' select touch par click karte hi yeh required form input attributes, dimensions, colors, packaging width/weight config, sizes check filters dynamically 1-click me select aur automatically autofill kar deta h! Is dauran aap non-blocking background me normal YouTube ya WhatsApp continue chala sakte hain.\n" +
          "• **2. AI integrated SEO Optimizer:** In-built smart AI product parameters read karke dynamic high ranking search tags tags, titles, description text list output ready karta h.\n" +
          "• **3. Shipping Fee optimization:** Legally correct packet volume configurations create karta h jis se standard packaging slabs map hokar shipping cost lowest rates (₹35 to ₹45 slabs) support me fix ho sake!\n" +
          "• **4. Dynamic Block Shield:** AI custom target details index changes apply karta h. Har copies catalog entries ke liye product ID, titles, unique SKU dynamically separate generate karega jisse warnings duplicate issues permanently avoid ho jayein.";
      }

      if (msgLower.includes("refund") || msgLower.includes("guarantee") || msgLower.includes("wapas") || msgLower.includes("replace") || msgLower.includes("policy") || msgLower.includes("safety")) {
        return "Sellers ka complete trust hi humari sabse badi policy h:\n\n" +
          "• **24-Hour refund/replacement promise:** Agar installation setups ya runtime block me koi genuine technical issue setup blocker aata hai to hum dynamic support check provide karte hain. 1-day (24 Hours) money refund or instant replacements guaranteed h!\n" +
          "• *Note:* Simple change of mind post-download par refund non-applicable h kyuki yeh premium digital software product h.";
      }

      if (msgLower.includes("lifetime") || msgLower.includes("monthly") || msgLower.includes("charges") || msgLower.includes("hidden") || msgLower.includes("one time") || msgLower.includes("kitna")) {
        return "Bilkul clear and honest pricing models h, koi monthly ya annual active loop charges nahi hain:\n\n" +
          "• **One-Time Buy:** Single Meesho or Flipkart tool ₹199 me lifetime access update details ke sath, Combo Pack is priced at flat **₹348** for both tools combined.\n" +
          "• Lifetime Updates aur live human installation details complete free features backup updates are included.";
      }

      if (msgLower.includes("support") || msgLower.includes("help") || msgLower.includes("contact") || msgLower.includes("phone") || msgLower.includes("whatsapp") || msgLower.includes("asgar") || msgLower.includes("call") || msgLower.includes("sir") || msgLower.includes("haldia")) {
        return "Aap direct developer and official setup managers se help support connect kar sakte hain:\n\n" +
          "• **Developer Owner:** Founder Sk Ali Asgar sir, from Haldia, West Bengal, PIN Pin Code: 721628.\n" +
          "• **Hotline Phone number:** WhatsApp call/messages directly on **6295429762**.\n" +
          "• **Hours:** Support active daily from Morning 9:00 AM to Night 10:00 PM for Jaipur & Surat sellers assistants setups.";
      }

      return "Namaste! 🙏 Sk Ali Asgar sir's 1-Click Chrome Extension Auto Listing Tool Support me aapka swagat h:\n\n" +
        "• **1-Click Auto Fill System:** Meesho & Flipkart seller portals catalogs page upload screen forms ko purely 1-click automatic auto fill karta h.\n" +
        "• **AI SEO Title/Description Tool:** Scans categories and crafts high-ranking SEO content copies automatically.\n" +
        "• **Shipping Fee Optimization:** Legally custom packing volume configuration setups to map parcel in regional rates (₹35-₹45 slabs).\n" +
        "• **Smart AI Unique Listing System:** Auto change titles, unique IDs, distinctive catalog values, and different SKU combinations to bypass product indexing duplication warning shields!\n" +
        "• **2-Second Auto Redirect:** After purchase, instantly redirects purely inside **2 seconds to direct secure download training screen** with step-by-step Hindi setup tutorials!\n" +
        "• **Unbeatable Pricing Offers:** Single Tool lifetime access at just **₹199**; Super popular Combo (Both tools combined) at just **₹348 Only**! No hidden active charges.\n\n" +
        "Aap niche button plans view kar sakte hain, ya support ke liye directly WhatsApp chat start kijiye!";
    };

    // Attempt Gemini call
    const client = getGeminiClient();
    if (!client) {
      console.info("Gemini client deactivated or secure keys empty. Serving rich fallback guides response instantly...");
      return res.json({ text: getFallbackResponse() });
    }

    try {
      const systemInstruction = `
You are the Official "Meesho & Flipkart Auto Listing Tool" Assistant Bot representing Sk Ali Asgar sir (Owner from Haldia, West Bengal, Pin 721628). You answer questions about the product in simple, polite, high-converting Hinglish or Hindi/English.

Exhaustive details you MUST follow for every customer question (Crucial Guidance):
1. Tool Nature (Extension-Based):
   - Clear Misunderstanding: Yeh koi background spreadsheet database seed compiler nahi hai! normal listing karte hain waise hi jab aap Meesho/Flipkart portal par 'Add Single Catalog' page upload select karte hain, toh Chrome Extension active hokar right pane me active visual panels load karta h. 
   - 1-Click Auto Fill System: 'Auto Fill' ke ek unique click se browser input fields, dimensions, packaging configurations (height/weight/depth), colors, sizes checkbox aur categories, metadata standard details ko auto list rules ke mutabik instantly automatically fill kar deta hai.
   - Non-blocking Background: Jab extension auto-fill feed process lead karti hai, is process ke dauraan check-out users continuous doosre tabs par YouTube videos dekh sakte hain ya WhatsApp messages use kar sakte hain bina listing workflow block kiye.

2. Product Features & Core Value:
   - Feature 1: One-Click Auto Fill System. Standard listing required fields, attributes, dimensions (length, height, width), SKU ID codes, variable checkbox filters automatically filled purely in 1-click.
   - Feature 2: AI SEO Keyword & Title Generator. Deep analytics scans categories, matches search volume keywords to dynamically generate high ranking seo optimized titles, labels & listing markup description texts.
   - Feature 3: AI Shipping Fee Optimization. Combines legally correct volumetric configurations and enhances visuals so listings maps legally in the lowest Regional shipping rates (₹35 to ₹45 slabs).
   - Feature 4: Smart AI Unique Listing. Each catalog duplication block shield prevents warnings by creating automatically fresh distinct copies of titles, descriptions, unique product IDs, and custom SKU codes!

3. Owner / Developer:
   - Sk Ali Asgar sir from Haldia, West Bengal, ZIP Pin Code 721628. Phone/WhatsApp: 6295429762.

4. Pricing plans & Updates (Strictly Lifetime Access):
   - Single target (Meesho Auto Listing Tool) price: ONLY ₹199 (Flat one-time buy, LIFETIME ACCESS!).
   - Single target (Flipkart Auto Listing Tool) price: ONLY ₹199 (Flat one-time buy, LIFETIME ACCESS!).
   - Combo Pack (Highly Popular Meesho + Flipkart listing bundle): standard ₹398, but flat ₹50 discount makes it only ₹348!
   - NO monthly billing, NO renewal charges, NO hidden subscription plans. Once purchased, active forever!

5. Support Line:
   - Active daily from 9:00 AM to 10:00 PM. Includes live human support guides who will guide you hand-to-hand if any setup errors come.
   - Genuine Surat and Jaipur seller assistance system setup guides are active to help.

6. Trusted Payments:
   - Supports PhonePe, Google Pay (GPay), Paytm, FamPay, UPI address portals, Net Banking, Debit cards etc.

7. Bulletproof Delivery redirects:
   - Jaise hi payment successfully complete hota hai, system purely **2 seconds ke andar automatic secure download page par redirect kar dega**.
   - Redirect download page par single click me standard files download karke step-by-step 7-minute Hindi video walkthrough play kar sakte hain. 
   - Side by side, dynamic email copy aur automated official WhatsApp backups instant send ho jate hain checkout credentials par.

8. Guarantee:
   - offer secure 24-Hour refund or automatic item replacements if real technical installer bugs block operations. No refund on simple change of mind after purchase.

Tone: Strictly text-oriented. No voice calls, mics, speaking, voice playback reference since we completely removed speech module. Keep replies beautifully organized in Hinglish bullet points, extremely friendly, motivating, simple, and polite. Always guide them to click buy or tap WhatsApp for further support.
`;

      // Ensure history starts with 'user' and alternates roles properly
      const chatHistory: any[] = [];
      let foundFirstUser = false;
      let lastRole = "";

      if (Array.isArray(history)) {
        for (const h of history) {
          const role = h.role === 'model' ? 'model' : 'user';
          if (role === 'user') {
            foundFirstUser = true;
          }
          if (foundFirstUser) {
            // Avoid duplicate consecutive roles to keep Gemini happy
            if (role !== lastRole) {
              const textContent = Array.isArray(h.parts) 
                ? (h.parts[0]?.text || "") 
                : (typeof h.parts === 'string' ? h.parts : "");
              
              if (textContent.trim()) {
                chatHistory.push({
                  role: role,
                  parts: [{ text: textContent }]
                });
                lastRole = role;
              }
            }
          }
        }
      }

      const contents = [...chatHistory];
      if (lastRole !== 'user') {
        contents.push({ role: "user", parts: [{ text: message }] });
      } else {
        // If last element was already user, overwrite or append.
        if (contents.length > 0) {
          contents[contents.length - 1] = { role: "user", parts: [{ text: message }] };
        } else {
          contents.push({ role: "user", parts: [{ text: message }] });
        }
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.warn("Gemini Chat failed. Serving rich fallback guides response instantly...");
      res.json({ text: getFallbackResponse() });
    }
  });

  // ==========================================
  // CASHFREE INTEGRATION API ENDPOINTS
  // ==========================================

  // 1. Create Checkout Session Order
  app.post("/api/create-order", async (req, res) => {
    try {
      const { name, email, phone, isCombo } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({ error: "Name, email, and phone are required." });
      }

      const cleanPhone = phone.replace(/[^a-zA-Z0-9]/g, "");
      if (cleanPhone.length < 10) {
        return res.status(400).json({ error: "Please enter a valid phone number (at least 10 digits)." });
      }

      const amount = isCombo ? 348 : 199;
      const purchaseType = isCombo ? "Combo" : "Single";
      const orderId = `order_ML_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      // Store in Firestore as PENDING
      const orderRef = doc(db, "orders", orderId);
      await setDoc(orderRef, {
        orderId,
        name,
        email,
        phone: cleanPhone,
        purchaseType,
        amount,
        paymentStatus: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const appId = process.env.CASHFREE_APP_ID || "1328720fa4876cfc5f2d083d40b0278231";
      const secretKey = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_191a5a5fa4c7f489f3101dbe6712549a_fcb45fb9";
      
      const origin = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
      const returnUrl = `${origin}/api/verify-payment?order_id=${orderId}`;

      const cashfreePayload = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `cust_${cleanPhone}`,
          customer_name: name,
          customer_email: email,
          customer_phone: cleanPhone
        },
        order_meta: {
          return_url: returnUrl
        }
      };

      console.log(`Initiating Cashfree Order: ${orderId} | Amount: ₹${amount}`);

      const cashfreeResponse = await fetch("https://api.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cashfreePayload)
      });

      if (!cashfreeResponse.ok) {
        const errorText = await cashfreeResponse.text();
        console.error("Cashfree API Order Creation Failed:", errorText);
        return res.status(500).json({ error: "Failed to initiate payment session with Cashfree.", details: errorText });
      }

      const responseData: any = await cashfreeResponse.json();
      console.log("Cashfree Order created successfully on payment gateway:", responseData.order_id);

      const paymentLink = responseData.payment_link || (responseData.payments && responseData.payments.payment_link);
      const paymentSessionId = responseData.payment_session_id;

      return res.json({
        success: true,
        order_id: orderId,
        payment_link: paymentLink,
        payment_session_id: paymentSessionId
      });

    } catch (err: any) {
      console.error("Error in /api/create-order:", err);
      return res.status(500).json({ error: "Internal server error during order creation." });
    }
  });

  // 2. Verify Payment Status & Redirect
  app.get("/api/verify-payment", async (req, res) => {
    try {
      const { order_id } = req.query;

      if (!order_id || typeof order_id !== "string") {
        return res.status(400).send("Order ID is missing or invalid.");
      }

      console.log("Verifying payment on Cashfree API for Order:", order_id);

      const appId = process.env.CASHFREE_APP_ID || "1328720fa4876cfc5f2d083d40b0278231";
      const secretKey = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_191a5a5fa4c7f489f3101dbe6712549a_fcb45fb9";

      const statusResponse = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json"
        }
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Cashfree status check failed:", errorText);
        return res.redirect(`/#/download?order_id=${order_id}&verified=false`);
      }

      const gatewayOrder: any = await statusResponse.json();
      const orderStatus = gatewayOrder.order_status;
      const paymentId = gatewayOrder.cf_order_id ? String(gatewayOrder.cf_order_id) : "";

      console.log(`Verified Status for ${order_id}: ${orderStatus}`);

      const orderDocRef = doc(db, "orders", order_id);

      if (orderStatus === "PAID") {
        await updateDoc(orderDocRef, {
          paymentStatus: "PAID",
          paymentId: paymentId,
          updatedAt: new Date().toISOString()
        });
        return res.redirect(`/#/download?order_id=${order_id}&verified=true`);
      } else {
        await updateDoc(orderDocRef, {
          paymentStatus: "FAILED",
          updatedAt: new Date().toISOString()
        });
        return res.redirect(`/#/download?order_id=${order_id}&verified=false`);
      }

    } catch (err: any) {
      console.error("Error in /api/verify-payment:", err);
      return res.status(500).send("Internal server error during payment verification.");
    }
  });

  // 3. Get Order Details & Secure Downloads Config
  app.get("/api/check-order-status", async (req, res) => {
    try {
      const { order_id } = req.query;

      if (!order_id || typeof order_id !== "string") {
        return res.status(400).json({ error: "Order ID is missing or invalid." });
      }

      const orderDocRef = doc(db, "orders", order_id);
      const orderDoc = await getDoc(orderDocRef);

      if (!orderDoc.exists()) {
        return res.status(404).json({ error: "Order not found." });
      }

      const orderData = orderDoc.data();

      if (orderData.paymentStatus !== "PAID") {
        return res.status(403).json({ error: "Access Denied. Payment is not verified." });
      }

      // Load Downloads Config
      const downloadsConfigPath = path.join(__dirname, "src", "downloads-config.json");
      const downloadsConfig = JSON.parse(fs.readFileSync(downloadsConfigPath, "utf-8"));

      // Filter based on purchase type
      const activeDownloads: any = {};
      activeDownloads.meesho = downloadsConfig.meesho;
      if (orderData.purchaseType === "Combo") {
        activeDownloads.flipkart = downloadsConfig.flipkart;
      }

      return res.json({
        success: true,
        order: {
          orderId: orderData.orderId,
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          purchaseType: orderData.purchaseType,
          amount: orderData.amount,
          createdAt: orderData.createdAt
        },
        downloads: activeDownloads
      });

    } catch (err: any) {
      console.error("Error in /api/check-order-status:", err);
      return res.status(500).json({ error: "Internal server error while retrieving download credentials." });
    }
  });

  // Export app for serverless or local execution
  export default app;

  // Conditional Server Start
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite asynchronously in development
    import("vite").then(({ createServer: createViteServer }) => {
      createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      }).then((vite) => {
        app.use(vite.middlewares);
        const PORT = 3000;
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Server running in development on http://localhost:${PORT}`);
        });
      });
    }).catch((err) => {
      console.error("Failed to load Vite dev server:", err);
    });
  } else if (!process.env.VERCEL) {
    // In production container (Cloud Run), serve static files and listen
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running in production on port ${PORT}`);
    });
  }
