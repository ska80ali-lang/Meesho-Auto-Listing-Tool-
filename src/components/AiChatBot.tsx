import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle as HelpIcon,
  ChevronRight,
  Phone,
  Settings,
  Flame,
  Wrench,
  Truck,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  Sparkle,
  Layers,
  ArrowUpRight,
  Play
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "🔥 Popular Offers",
    question: "🎁 Meesho + Flipkart Combo Offer Lifelong Bundle?",
    answer: "Haanji! Humare paas ek best-selling **Meesho + Flipkart Auto Listing combo pack** offer h:\n\n• **LIFETIME LICENCE:** Isme Meesho aur Flipkart dono ke premium Chrome Extension auto-listing tools mil jayeinge LIFETIME FREE updates ke sath.\n• **NO MONTHLY CHARGES:** Yeh permanent access h, isme koi periodic subscription ya hidden fees nahi h.\n• **Combo Savings:** Standard pricing ₹199 + ₹199 = ₹398 hoti h, par Combo bundle lene par **flat ₹50 discount** milta h. Toh yeh complete bundle aapko sirf **₹348** me milega.\n\nAap niche direct **BUY NOW (LIFETIME)** block button par select karke direct safe payment options proceed karein."
  },
  {
    category: "🎬 Video Tutorials",
    question: "📺 Meesho Auto-Listing Kaise Kaam Karta Hai? (Live Demo Video)",
    answer: "Neeche diye gaye video play player par click karke direct live demo screen recording dekhiye aur pure automatic listing process ko live samjhiye.\n\n• **Highlights:** 1-Click auto form pre-fill simulation, dimension optimization, low weight threshold trigger and AI titles generation.\n• **Access Terms:** Permanent access, is video me list huye templates lifetime permanent use ke liye hain!\n\nPLAY_VIDEO_URL:https://res.cloudinary.com/dutdmkrhc/video/upload/v1781288334/InShot_20260525_212334170_de2rkp_kdf2ho.mp4"
  },
  {
    category: "🎬 Video Tutorials",
    question: "📺 Flipkart Auto-Listing Tool Demo & Process Video Kaise Dekhein?",
    answer: "Yeh hai hamara Flipkart auto-listing extension tool ka highly-converting complete demonstration video tutorial. Isme pricing calculations aur parameters config ko beautifully show kiya gya h.\n\n• **Tool Value:** One-time investment, solid permanent workflow booster, absolutely LIFETIME FREE system access!\n\nPLAY_VIDEO_URL:https://res.cloudinary.com/ddcbu8j1p/video/upload/v1781892192/VID-20260526-WA0006_oz0kys.mp4"
  },
  {
    category: "🎬 Video Tutorials",
    question: "📺 1-Click Auto Fill Live Working Process Video Demo?",
    answer: "Dekhiye is powerful live demo video ko jisme live dikhaya gaya hai ki kaise extension dynamic inputs, parameters, sizes, colors, length aur weight metrics ko direct 1-click me automatically insert aur configure karta hai.\n\n• **Visual proof:** Is video me extension real-time me auto form pre-fill and bulk operations speed optimization live simulation show karta h!\n• **System Guarantee:** Absolute peace of mind lifetime product access with no periodic bills.\n\nPLAY_VIDEO_URL:https://res.cloudinary.com/ddcbu8j1p/video/upload/v1781892256/lv_0_20260529130324_lozzdg.mp4"
  },
  {
    category: "🛠️ Working & AI SEO",
    question: "⚙️ 1-Click Auto Fill System Kaise Kaam Karta Hai?",
    answer: "Yeh tool asaan step-by-step Chrome Extension automation workflow par kaam karta h:\n\n• **1. Extension Based 1-Click Auto Fill:** Yeh koi general database spreadsheets seed filling nahi hai! Jab aap Meesho ya Flipkart dashboard tab par 'Add Single Catalog' select page open karte hain, tab right-side panel me extension fully load ho jata h. 'Auto Fill' select touch par click karte hi yeh required form input attributes, dimensions, colors, packaging width/weight config, sizes check filters dynamically 1-click me select aur automatically autofill kar deta h! Is dauran aap non-blocking background me normal YouTube ya WhatsApp continue chala sakte hain.\n• **2. AI integrated SEO Optimizer:** In-built smart AI product parameters aur category ko automatically read karke dynamic high ranking titles, labels aur item description lists copy output instantly generate karta hai.\n• **Lifetime Access Guarantee:** Bina kisi active monthly bills ya future hidden fees ke yeh completely offline secure system permanent life update ke sath work karta h!"
  },
  {
    category: "🛠️ Working & AI SEO",
    question: "🚀 AI Integrated SEO Titles & Keyword Generator Kya Hai?",
    answer: "Hamara extension tool automatic deep category scan process apply karta hai:\n\n• **In-Built Smart AI Engine:** Keyword volume analysis and algorithms use karke automatic tags text aur descriptions create karta hai.\n• **High CTR Generation:** Optimized title lines likhta hai taaki customer reach badhe aur product listing rank safe target kar sake.\n• Yeh titles aur tags directly category attribute me automatically push ho jate hain 1-click fill process ke time!\n• Aapko permanent system access milta h standard LIFETIME update program ke under strictly gratis!"
  },
  {
    category: "🚚 Shipping & Shield",
    question: "📦 Volumetric Shipping Slabs Optimization Se Loss Kaise Bachayein?",
    answer: "Bahut se sellers listing catalog dimensions rules galti fill karke lakhs ka shipping loss bear karte hain. Iska solid system solution:\n\n• **Custom Packing Volume Maps:** Extension automated standards me standard dimensions (length, height, width) calculation use karta hai.\n• **Lowest Regional Rates (₹35-₹45 Slabs):** Tool system calculations ensures karta hai ki list kia hua parcels product legally correct packaging standard slab me lock ho jisse customer ko low rates and refund delivery save automatic optimize slabs generate karein.\n• **Lifetime Utility Solution:** Is mathematical module ko chalane ke liye koi dynamic service cost, dynamic subscription charge ya high maintenance monthly fees nahi h!"
  },
  {
    category: "🚚 Shipping & Shield",
    question: "🔒 Account Duplication Warning Bypass / Block Shield Kya Hai?",
    answer: "Meesho aur Flipkart duplicate listing entries warnings detect karte hain. Humara extension block shield system isko smart bypass karta hai:\n\n• **Dynamic Param Changer:** Jab aap ek hi single source category duplicate ya standard list generate karte hain, hamara AI code iske descriptors automatic changes rule trigger karega.\n• **Unique SKU, Titles & product ID configurations:** Har duplicate copies entries ke liye customized distinct titles lines aur automatic separate SKU combinations banega jisse duplicates warnings ya system blacklists warnings automatically bypass safe screen maintain reh sake!\n• **LIFETIME UNLIMITED ACCOUNTS:** Ek baar lifetime pay karke aap is block bypass features ko multi brand store accounts par lifelong permanently register bypass rules bypass enjoy kar sakte hain."
  },
  {
    category: "💸 Price & Lifetime",
    question: "💰 Koyi Hidden Charges Ya Monthly Renewals Hain Kya?",
    answer: "Nahi, bilkul clear, direct honest transparent pricing flow h! Hum high-profile sellers ka continuous trust value priority treat karte hain:\n\n• **LIFETIME ACCESS:** Aapko sirf one-time payment pay karna h. Koi auto-subscription, koi dynamic monthly renewals ya recurring payment cards block billing bilkul nahi h.\n• **No Hidden Cost:** Single tool Flipkart or Meesho ₹199 me complete **LIFETIME UNLIMITED ACCESS** aur direct daily system updates permanent safety backup features fully FREE milta h.\n• **Supersaver Combo Live:** Meesho + Flipkart bundle lifetime license ONLY **₹348** me permanent premium benefits list open direct access updates ke sath custom available h."
  },
  {
    category: "💸 Price & Lifetime",
    question: "📥 Payment Ke Baad Tool Mujhe Kaise Aur Kab Milega?",
    answer: "Bahut hi fast, bulletproof aur automatic setup direct delivery process apply kiya h:\n\n• **2-Second Auto Redirect:** Jaise hi aap payment gateway checkout se call success pass karenge, system purely **2 seconds ke andar redirect page automatically secure link download par move** kar dega!\n• **7-Minute step-by-step Hindi setup guide:** Download page par setup configurations clear instructions zip files software files aur complete step-by-step easy video training system list open milega.\n• **Backup Multi-Channel Notifications:** Humara auto checkout system automatically customer checkout details verify karke primary email aur phone WhatsApp message par automatic links copy copy forward backup instant send trigger kar dega.\n• Permanent standard Google sheet templates links live active links and setups lifelong secure access preserve backup support system h."
  },
  {
    category: "💸 Price & Lifetime",
    question: "💳 Kaun-Kaun Se Checkout Payment Modes Support Hain?",
    answer: "Humara payments module automatic fully active and safe features support karta hai:\n\n• **Supported Online Modes:** PhonePe, Google Pay (GPay), Paytm, FamPay primary ID, standard UPI handles, any major Debit/Credit card portals aur Net Banking checkout setups completely support triggers h.\n• Completely secure checkout gateway direct powered by certified server networks."
  },
  {
    category: "💸 Price & Lifetime",
    question: "🔄 24-Hour Item Replacement Aur Refund Policy Kya Hai?",
    answer: "Sellers ka continuous faith hamara absolute priority h:\n\n• **24-Hour refund or technical replacements:** Agar genuine installation errors ya standard product run system bugs se tools blockage phase me phase aata h to hum complete full replacement dynamic support check provide karte hain.\n• One day money refund features support guarantees h.\n• *Note:* Standard digital items product delivery hone ke baad visual design update change of mind patterns me downloads ke baad simple change of mind non-applicable h."
  },
  {
    category: "📞 Owner Contact",
    question: "📞 Owner Connect, Timing & Address Details?",
    answer: "Aap direct software developer dynamic creator and foundation head se support setup check kar sakte hain:\n\n• **Founder/Owner Lead:** Founder Sk Ali Asgar sir, based in Haldia, West Bengal, PIN Code: 721628.\n• **Primary Whatsapp Call/SMS Hotline:** **6295429762**.\n• **Helper assistant hours:** Support daily Morning 09:00 AM to Night 10:00 PM Jaipur and Surat sellers dynamic integrations ke liye active backup guides dynamic details calls supports provide karta h."
  }
];

interface MessageVideoProps {
  videoUrl: string;
  playingVideoUrl: string | null;
  onPlayVideo: (url: string | null) => void;
}

function MessageVideo({ videoUrl, playingVideoUrl, onPlayVideo }: MessageVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playingVideoUrl && playingVideoUrl !== videoUrl) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [playingVideoUrl, videoUrl]);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-pink-500/30 bg-[#0c051a] shadow-xl relative animate-fade-in">
      <video 
        ref={videoRef}
        src={videoUrl} 
        controls 
        playsInline
        preload="metadata"
        onPlay={() => onPlayVideo(videoUrl)}
        className="w-full aspect-video rounded-t-xl object-cover hover:scale-101 transition-transform duration-300"
      />
      <div className="bg-gradient-to-r from-purple-950/80 to-pink-950/80 px-3 py-1.5 border-t border-purple-500/10 text-[9px] text-pink-300 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          Demo Tutorial Live
        </span>
        <span className="uppercase text-[8.5px] font-extrabold tracking-wide text-gray-400">Play Video Enabled</span>
      </div>
    </div>
  );
}

// Helper to beautifully format raw response text, removing markdown starch (**bold stars**, raw bullets, list counts)
function renderFormattedContent(
  text: string,
  playingVideoUrl: string | null,
  onPlayVideo: (url: string | null) => void
) {
  if (!text) return null;

  // Split out the video components if present
  let mainText = text;
  let videoUrl = "";
  
  if (text.includes("PLAY_VIDEO_URL:")) {
    const parts = text.split("PLAY_VIDEO_URL:");
    mainText = parts[0].trim();
    videoUrl = parts[1].trim();
  }

  const lines = mainText.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        let trimmed = line.trim();
        if (trimmed === '') return <div key={lineIdx} className="h-1.5" />;

        // Check if list item (bullet symbol, dot or generic count)
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed);
        
        let cleanedText = trimmed;
        if (isBullet) {
          // Strip out the bullet marker at the head
          cleanedText = trimmed.replace(/^(•|-|\*|\d+\.\s*)/, '').trim();
        }

        // Parse bold markers (**word**) dynamically inside elements
        const parts = [];
        let index = 0;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let match;

        while ((match = boldRegex.exec(cleanedText)) !== null) {
          // Push normal text before match
          if (match.index > index) {
            parts.push(cleanedText.substring(index, match.index));
          }
          // Push bold text with pink highlighted gradient styling
          parts.push(
            <strong key={match.index} className="font-extrabold text-[#f472b6] tracking-wide">
              {match[1]}
            </strong>
          );
          index = boldRegex.lastIndex;
        }

        if (index < cleanedText.length) {
          parts.push(cleanedText.substring(index));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1.5 py-0.5 group text-[11.5px] leading-relaxed text-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shrink-0 mt-1.5 group-hover:scale-125 transition-transform" />
              <span>
                {parts.length > 0 ? parts : cleanedText}
              </span>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="text-[11.5px] leading-relaxed text-slate-150">
            {parts.length > 0 ? parts : cleanedText}
          </p>
        );
      })}

      {/* Dynamic video embed renderer inside dialogue speech bubbles */}
      {videoUrl && (
        <MessageVideo 
          videoUrl={videoUrl} 
          playingVideoUrl={playingVideoUrl} 
          onPlayVideo={onPlayVideo} 
        />
      )}
    </div>
  );
}

interface AiChatBotProps {
  isStickyVisible?: boolean;
}

export default function AiChatBot({ isStickyVisible = false }: AiChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Namaste! 🙏 Main aapka Sk Ali Asgar Official Tool Assistant hu.\n\nType karne ki bilkul tension mat lijiye! Neeche diye gaye dynamic categories se apne pasand ka question ya **🎬 Direct Video Demo** select karne ke liye tab click karein aur automatic instant detailed answer payein.\n\nHamare sabhi auto-listing tools aur combo packs permanent **LIFETIME ACCESS** ke sath aate hain (No monthly renewal billing & No hidden software taxes). Main aapko details Hinglish me batata hu. 👇" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("🔥 Popular Offers");
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(true);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { name: "🔥 Popular Offers", icon: Flame, color: "text-red-400 bg-red-500/10" },
    { name: "🎬 Video Tutorials", icon: Play, color: "text-pink-400 bg-pink-500/10" },
    { name: "🛠️ Working & AI SEO", icon: Wrench, color: "text-blue-400 bg-blue-500/10" },
    { name: "💸 Price & Lifetime", icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10" },
    { name: "📞 Owner Contact", icon: UserCheck, color: "text-amber-400 bg-amber-500/10" }
  ];

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Lock body scroll of parent page when chatbot dialog is actively open
  useEffect(() => {
    if (isOpen) {
      // Temporarily suppress body scroll so background page remains locked
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelectQuestion = (faq: FAQItem) => {
    if (loading) return;

    // 1. Add user clicked question to conversation log
    const newUserMessage: Message = { role: 'user', text: faq.question };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    // 2. Respond with high-fidelity local answer instantly to avoid network failures, lags or system overrides
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text: faq.answer }]);
      setLoading(false);
    }, 450);
  };

  const resetChat = () => {
    setMessages([
      { 
        role: 'model', 
        text: "Conversation reset ho chuki h. Neeche diye offers ya specifications me se kisi bhi question par browse karke check kijiye! 😊" 
      }
    ]);
  };

  return (
    <div id="ai-chat-root" className={`fixed right-4 sm:right-6 transition-all duration-300 z-50 font-sans text-gray-150 ${
      isStickyVisible 
        ? 'bottom-[92px] sm:bottom-[100px]' 
        : 'bottom-4 sm:bottom-6'
    }`}>
      
      {/* 1. FLOATING CHAT BALLOON ELEMENT */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-full shadow-[0_8px_30px_rgba(236,72,153,0.5)] border border-pink-400/40 flex items-center justify-center cursor-pointer transition-all duration-300"
        title="Open AI Support Assistant Chat"
        aria-label="Open AI Support Assistant Chat"
      >
        {/* Animated Double Icon Effect with a small green online dot */}
        <div className="relative flex items-center justify-center shrink-0">
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-5.5 h-5.5 animate-pulse text-white fill-white/10" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          )}
        </div>

        {/* Glowing surrounding wave reflection */}
        <span className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping opacity-35 pointer-events-none" style={{ animationDuration: '2.5s' }} />
      </motion.button>

      {/* 2. CHATBOX DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="absolute bottom-18 sm:bottom-22 right-0 w-[94vw] sm:w-[430px] h-[610px] max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_24px_65px_rgba(139,92,246,0.4)] border border-purple-500/20 bg-[#070310]/98 backdrop-blur-xl flex flex-col z-50 animate-fade-in"
          >
            {/* Header Area */}
            <div className="p-4 bg-gradient-to-r from-purple-950/80 via-[#0d0724]/90 to-purple-950/80 border-b border-purple-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white border border-pink-400/20">
                    <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#070310] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">Ali Asgar Interactive Bot</h4>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] px-1.2 py-0.5 rounded font-extrabold uppercase tracking-wider">Ready</span>
                  </div>
                  <p className="text-[9.5px] text-purple-300">⚡ Touch any question or tutorial tag for live player</p>
                </div>
              </div>

              {/* Refresh Action */}
              <button
                type="button"
                onClick={resetChat}
                className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-900/30 text-gray-400 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Reset conversation logs"
                aria-label="Reset conversation logs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Messages Log list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/30 overscroll-contain">
              
              {/* Official Assurance badge */}
              <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/10 rounded-2xl p-3 text-[11px] text-purple-200">
                <div className="flex items-center gap-1.5 font-bold text-pink-400 mb-1">
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                  <span>Ali Asgar's Official Policy:</span>
                </div>
                <p className="leading-relaxed opacity-95 pl-5">
                  ✅ <strong>LIFETIME FREE ACCESS</strong> (One-time pay, no monthly renewals, no hidden fees ever!). <br />
                  🛡️ <strong>24-Hour Refund protection</strong> agar actual setup config me error aaye.
                </p>
              </div>

              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(219,39,119,0.2)] border border-pink-400/10'
                      : 'bg-purple-950/50 border border-purple-900/20 text-gray-200 rounded-tl-none'
                  }`}>
                    {/* Render using the dynamic native beauty parser to fix double stars and raw dots */}
                    {renderFormattedContent(msg.text, playingVideoUrl, setPlayingVideoUrl)}
                    
                    {msg.role === 'model' && (
                      <div className="mt-2 pt-1 border-t border-purple-500/5 text-[9px] text-purple-400/60 flex items-center justify-between">
                        <span>Verified Guidance System</span>
                        <span className="text-[8px] uppercase tracking-wider text-pink-400 font-extrabold font-mono">Instant Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-purple-950/40 border border-purple-900/20 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </span>
                    <span className="font-mono text-[9px] text-purple-300">Analyzing criteria...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

             {/* Smart Interactive Navigation Dashboard (Predefined queries instead of search inputs) */}
            <div className="bg-[#0b051b]/98 border-t border-purple-500/15 flex flex-col">
              
              {/* Category tabs scroll panel */}
              <div className="p-2 border-b border-purple-500/10 bg-[#070311]/90 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                {categories.map((cat, idx) => {
                  const IconComponent = cat.icon;
                  const isCatActive = activeCategory === cat.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setIsOptionsExpanded(true); // Auto expand on tab select
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10.5px] font-black tracking-wide flex items-center gap-1.5 transition-all outline-none cursor-pointer ${
                        isCatActive 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/10 scale-102' 
                          : 'bg-purple-950/30 border border-purple-900/10 text-gray-400 hover:text-white hover:bg-purple-900/20'
                      }`}
                    >
                      <IconComponent className={`w-3 h-3 ${isCatActive ? 'text-white' : cat.color.split(' ')[0]}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Questions Container */}
              <div className="bg-[#090416] flex flex-col border-b border-purple-500/10">
                {/* Header Toggle bar */}
                <button
                  type="button"
                  onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
                  className="w-full flex items-center justify-between p-3 py-2.5 hover:bg-purple-950/20 transition-all outline-none text-left select-none border-b border-purple-500/5 cursor-pointer"
                >
                  <p className="text-[10px] text-purple-300 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <Sparkle className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                    <span>Select to Ask/Play:</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8.5px] text-pink-400 font-bold tracking-wide uppercase">
                      {isOptionsExpanded ? "Hide options [-]" : "Show options [+]"}
                    </span>
                    <motion.span
                      animate={{ rotate: isOptionsExpanded ? 90 : 0 }}
                      className="inline-block text-pink-500 font-bold"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    </motion.span>
                  </div>
                </button>

                {/* Question buttons animation container */}
                <AnimatePresence initial={false}>
                  {isOptionsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 max-h-[165px] overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-purple-950 overscroll-contain">
                        <div className="grid grid-cols-1 gap-2">
                          {FAQ_DATA.filter(faq => faq.category === activeCategory).map((faq, idx) => (
                            <motion.button
                              whileHover={{ scale: 1.015, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              key={idx}
                              type="button"
                              onClick={() => handleSelectQuestion(faq)}
                              disabled={loading}
                              className="w-full text-left p-2.5 rounded-xl bg-purple-950/35 hover:bg-pink-950/20 border border-purple-900/30 hover:border-pink-500/20 text-[11px] font-bold text-gray-200 hover:text-white flex items-center justify-between gap-2.5 transition-all outline-none cursor-pointer duration-200"
                            >
                              <span className="leading-snug">{faq.question}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Bottom Actions row with clickable converting links & official owner support contact */}
            <div className="p-3 px-4 bg-[#05020c] border-t border-purple-500/15 flex items-center justify-between gap-3">
              {/* Highlightive Pulsing BUY NOW Button */}
              <motion.a 
                href="https://superprofile.bio/vp/meesho-auto-listing---low-shipping-tool?checkout=true"
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] group bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 border border-pink-400 text-white text-[11px] font-black uppercase tracking-wider py-2 px-4 rounded-xl items-center justify-center gap-1.5 transition-all text-center flex-1 cursor-pointer"
              >
                <span>BUY NOW (LIFETIME)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform animate-pulse text-white shrink-0" />
              </motion.a>

              {/* Support Number link */}
              <a 
                href="https://wa.me/916295429762?text=Hello%20Sk%20Ali%20Asgar%20sir,%20I%20visited%20your%20Auto%20Listing%20Tool%20app..."
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-extrabold flex items-center gap-1 transition-colors hover:underline text-[10.5px] cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Call/WA: 6295429762</span>
              </a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
