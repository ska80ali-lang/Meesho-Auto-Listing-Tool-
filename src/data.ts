import { Testimonial, VideoReview, FAQItem, ScreenshotSlide, FeatureItem, CheckoutPlan } from './types';

// ==========================================
// GLOBAL CONFIGURATION (EASY TO EDIT)
// ==========================================
export const CONFIG = {
  // Cashfree Checkout Integration Mode
  ctaRedirectUrl: "#checkout", 

  // Support details
  whatsappNumber: "6295429762",
  supportEmail: "ska80ali@gmail.com",

  // Pricing details
  originalPrice: 1999,
  discountedPrice: 199,
  currency: "₹",
  
  // Hero Video URL (Direct MP4 URL or embedded looping content)
  heroVideoUrl: "https://res.cloudinary.com/dutdmkrhc/video/upload/v1781288334/InShot_20260525_212334170_de2rkp_kdf2ho.mp4",
  
  // YouTube Backup ID if they want to use a YouTube embed instead of HTML5 video
  youtubeId: "", // e.g. "dQw4w9WgXcQ"
};

// ==========================================
// CASHFREE VERIFIED CHECKOUT PLANS
// ==========================================
export const CHECKOUT_PLANS: Record<string, CheckoutPlan> = {
  meesho_single: {
    id: 'meesho_single',
    name: 'Meesho Auto Listing Tool',
    badge: 'Standard Single Plan',
    price: 199,
    originalPrice: 1999,
    description: 'Complete 1-Click Auto Listing Extension with Low Shipping trick & AI SEO Optimizer for Meesho Sellers.',
    features: [
      '1-Click Auto Fill Catalog Forms',
      'Low Shipping Trick (₹35-₹45 Slabs)',
      'AI SEO Keyword & Title Generator',
      'Dynamic Duplication Warning Shield',
      'Instant 2-Sec Download & Hindi Guide',
      'Lifetime Access (No Monthly Fees)'
    ]
  },
  flipkart_single: {
    id: 'flipkart_single',
    name: 'Flipkart Auto Listing Tool',
    badge: 'Standard Single Plan',
    price: 199,
    originalPrice: 1999,
    description: 'High-speed automated bulk catalog lister and AI SEO tag booster for Flipkart Seller Portal.',
    features: [
      '1-Click Flipkart Auto Fill System',
      'Smart Attribute & Dimension Mapping',
      'AI SEO Title & Description Generator',
      'Bypass Indexing Duplication Errors',
      'Instant 2-Sec Download & Setup Kit',
      'Lifetime Access (No Monthly Fees)'
    ]
  },
  combo_pack: {
    id: 'combo_pack',
    name: 'Meesho + Flipkart Combo Suite',
    badge: '⚡ MOST POPULAR (FLAT ₹50 OFF)',
    price: 348,
    originalPrice: 3998,
    description: 'Get BOTH Meesho & Flipkart automation suites together at a discounted combo price. Maximize sales on both portals!',
    features: [
      'INCLUDES: Both Meesho & Flipkart Tools',
      'Flat ₹50 Combo Discount Applied',
      'Double Catalog Upload Speed & Reach',
      'Low Shipping Trick & AI SEO Suites',
      'Direct WhatsApp Setup Support Hotline',
      'Lifetime Access for Both Extensions'
    ]
  }
};


// ==========================================
// LANDING PAGE SECTIONS CONTENT
// ==========================================

export const TRUST_BADGES = [
  { id: '1', title: "Instant Access", desc: "Get download link immediately", icon: "Zap" },
  { id: '2', title: "Secure Payment", desc: "UPI, Cards, Netbanking", icon: "ShieldCheck" },
  { id: '3', title: "Lifetime Access", desc: "No monthly subscription", icon: "Award" },
  { id: '4', title: "Mobile Friendly", desc: "Works on phone & laptop", icon: "Smartphone" }
];

export const STATS = [
  { id: '1', value: 14200, suffix: "+", label: "Total Listings Uploaded", icon: "Layers" },
  { id: '2', value: 1850, suffix: "+", label: "Active Low-Shipping Sellers", icon: "Users" },
  { id: '3', value: 98, suffix: "%", label: "Seller Satisfaction Rate", icon: "TrendingUp" },
  { id: '4', value: 4.5, suffix: " Hrs", label: "Daily Time Saved Per Seller", icon: "Clock" }
];

export const SCREENSHOT_SLIDES: ScreenshotSlide[] = [
  {
    id: "slide-1",
    title: "1-Click Bulk Bulk Auto Listing Panel",
    description: "Upload up to 500 catalog items simultaneously. Automatically pre-fills product descriptions, dimensions, GST rates and optimized smart keywords.",
    imageUrl: "https://i.ibb.co/jZ44n77q/6091285828404448992.jpg"
  },
  {
    id: "slide-2",
    title: "Low Shipping Pricing Custom Engine",
    description: "The secret trick applied in action. It manipulates Meesho weight parameters safely to lock delivery charges to the bare minimum slab legally.",
    imageUrl: "https://i.ibb.co/k6DY8KSJ/6091285828404448990.jpg"
  },
  {
    id: "slide-3",
    title: "Dynamic Smart Orders Monitor Dashboard",
    description: "Track the immediate boost in listings impressions. Watch traffic and order pipelines multiply from Day 1 inside your official vendor panel.",
    imageUrl: "https://i.ibb.co/dqq928L/6091285828404448991.jpg"
  }
];

export const COMPARISONS = [
  {
    criteria: "Listings per Day",
    withoutTool: "Max 5 - 10 Listings (Manual)",
    withTool: "Unlimited (500+ in 1-Click)",
    highlight: true
  },
  {
    criteria: "Average Time Required",
    withoutTool: "3 to 4 Hours of boring manual typing",
    withTool: "Less than 5 Miniutes",
    highlight: true
  },
  {
    criteria: "Shipping Rates Slab",
    withoutTool: "₹79 - ₹120 standard rates",
    withTool: "₹35 - ₹45 (Low Shipping Trick Applied)",
    highlight: true
  },
  {
    criteria: "Device Compatibility",
    withoutTool: "Computer necessary for bulk templates",
    withTool: "Works fully on Mobile & Laptop",
    highlight: false
  },
  {
    criteria: "Tech Knowledge",
    withoutTool: "Needs advanced listing Excel skills",
    withTool: "Copy-paste easy (100% Beginner Friendly)",
    highlight: false
  },
  {
    criteria: "Updates",
    withoutTool: "Pay extra every time regulations change",
    withTool: "Lifetime Free Automated Updates",
    highlight: false
  }
];

export const PROBLEMS_SOLUTIONS = {
  title: "Why Meesho Sellers Fail vs How You Will Win",
  problems: [
    { title: "Manual Listing Burnout", desc: "Typing titles, tags, and uploading photos for 20 colors and sizes takes hours." },
    { title: "High Shipping Cost Killer", desc: "High logistics weights raise delivery cost. Buyers cancel orders instantly due to ₹99 shipping extra." },
    { title: "Zero Catalog Views", desc: "Manually created listings lack the volume needed for the Meesho algorithm to pick up impressions." }
  ],
  solutions: [
    { title: "No-Excel Auto Listing Tool", desc: "Fully automated robotic tool parses sheets or directories and uploads catalogs in seconds under human supervise." },
    { title: "Low-Weight Slab Algorithm", desc: "Unlock the hidden weight config parameters that automatically trigger Meesho's absolute lowest local shipping slabs (₹35-₹45)." },
    { title: "Algorithmic Inundation", desc: "Multiply listings immediately. High listings quantity triggers Meesho free booster points and pushes catalogs into search trends." }
  ]
};

export const FEATURES: FeatureItem[] = [
  {
    id: "f1",
    title: "Robotic Auto Listing",
    description: "Upload hundreds of items effortlessly. Say goodbye to manual back-breaking typing and single uploads.",
    icon: "Cpu"
  },
  {
    id: "f2",
    title: "Smart Bulk Spreadsheet",
    description: "Fully pre-configured template. Paste image links and catalog info, and let the robotic script loop through.",
    icon: "Table"
  },
  {
    id: "f3",
    title: "Low Shipping Code-Trick",
    description: "Exclusive weight dimension adjustment method that legalizes standard parcels to get classified under the lowest possible delivery charge slabs.",
    icon: "TrendingDown"
  },
  {
    id: "f4",
    title: "100% Mobile Friendly",
    description: "Do not own a computer? No problem. Use our specialized mobile bypass sheet to upload straight from your Android device.",
    icon: "Smartphone"
  },
  {
    id: "f5",
    title: "Beginner Friendly Video",
    description: "Includes simple 7-minute step-by-step video instructions in Hindi. Zero coding or technical background required.",
    icon: "Sparkles"
  },
  {
    id: "f6",
    title: "Time & Money Optimizer",
    description: "Saves up to 25+ hours of manual labor per week while significantly boosting daily orders by delivering maximum catalog exposure.",
    icon: "Clock"
  }
];

export const REVIEWS: Testimonial[] = [
  {
    id: "r1",
    name: "Sunil Sharma",
    location: "Surat, Gujarat",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 Days ago",
    review: "Surat cloth seller hu aur pehle manual catalog dalte sir dard ho jata tha. This tool is life saving! Ek click me automatic listings create ho jati hai. Best part is the low shipping trick - delivery rates ₹41 per piece ho gye!",
    verified: true
  },
  {
    id: "r2",
    name: "Pooja Mehta",
    location: "Jaipur, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "Yesterday",
    review: "Actually skeptical thi but ₹199 value is nothing compared to daily time savings. Mobile me setup clear hai, videos simplified hai. Highly recommended to beginners who don't want to hire listing managers.",
    verified: true
  },
  {
    id: "r3",
    name: "Mohammad Yusuf",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "4 Days ago",
    review: "Ordered more than 50 catalogs listings using the bulk script in 15 minutes. Low shipping formula actually worked. My listing shipping cost dropped from ₹85 to ₹39. Conversions increase 3x times next week itself! Value for money.",
    verified: true
  },
  {
    id: "r4",
    name: "Anjali Verma",
    location: "New Delhi, Delhi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "1 Week ago",
    review: "Outstanding customer service as well! I messaged them on WhatsApp via the button and got support setup help within 10 minutes. Extremely trustworthy brand, do not hesitate 🌟",
    verified: true
  }
];

export const VIDEO_REVIEWS: VideoReview[] = [
  {
    id: "v1",
    name: "Rahul Verma (Meesho Master)",
    role: "Rs. 4.5 Lakhs Monthly Profit Seller",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://res.cloudinary.com/ddkdxc1lj/video/upload/v1779724680/InShot_20260525_211127373_wjvbit.mp4"
  },
  {
    id: "v2",
    name: "Simran K. (Handicraft Vendor)",
    role: "Jaipur Boutique Owner",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://res.cloudinary.com/ddkdxc1lj/video/upload/v1779724689/InShot_20260525_211250193_qokyly.mp4"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Is this tool beginner friendly and language simple?",
    answer: "Yes, 100%! The tool is designed in simple English and the visual video explanations are in straightforward Hindi. Absolutely no computer coding background, no complex Excel scripting or API knowledge is required. It's copy-paste easy."
  },
  {
    id: "faq-2",
    question: "Does it work fully on Android and iOS Mobile phones?",
    answer: "Yes! While high-volume listing managers often use computers, we have designed a specialized bulk upload bypass sheet that is 100% optimized for Google Sheets on mobile phones. You can launch auto listings directly using your smartphone."
  },
  {
    id: "faq-3",
    question: "How will I gain access after purchasing? Is there a redirect?",
    answer: "Tension free rahiye! Jaise hi aapka payment complete hoga, system aapko automatically purely 2 seconds ke andar secure download page par redirect kar dega. Vahan aap 1-click me tools ko download kar sakte hain aur Hindi video guide par click karke direct play kar sakte hain instantly! Iske alawa, aapke billing details me diye gaye Email ID aur billing phone number par automatic backup support links dynamic WhatsApp aur Email ke jariye turant bhej diye jayenge."
  },
  {
    id: "faq-4",
    question: "Are updates included, or is there a monthly fee?",
    answer: "There are absolutely ZERO recurring fees! No active monthly subscription required. Your single purchase of ₹199 unlocks lifetime membership access including all future algorithms versions or updates free of charge."
  },
  {
    id: "faq-5",
    question: "What is this 'Low Shipping Trick' exactly? Is it legal and safe?",
    answer: "Absolutely 100% legal and risk-free. It does not violate any Meesho Vendor Terms of Service. It adjusts specific catalog packing weights and dimensional parameters within official rules to ensure Meesho automatically places your listings into the lowest shipping weight slabs (saving you ₹40-₹70 per parcel)."
  },
  {
    id: "faq-6",
    question: "How fast can I start seeing increased catalog views and orders?",
    answer: "Most of our active Meesho sellers report preparing and listing their first bulk catalogs within 25 minutes of download. Since Meesho's algorithm rewards daily volume, sellers usually see catalog impressions and initial orders trending up within 24-48 hours after auto uploads go live."
  },
  {
    id: "faq-7",
    question: "What payment methods are supported? Can I pay using GPay or PhonePe?",
    answer: "Yes, absolutely! Aap sabhi prakaar ke Online payments jaise PhonePe, Google Pay (GPay), Paytm, FamPay, any other UPI IDs, aur Net Banking ya Debit/Credit Cards se safely aur securely online payment instantly kar sakte hain."
  }
];
