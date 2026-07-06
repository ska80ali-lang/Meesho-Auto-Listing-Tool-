import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CONFIG } from '../data';
import { ShieldCheck, Zap, Star, Flame, Trophy, RefreshCw, AlertCircle, Check, Layers, Sparkles } from 'lucide-react';

interface PricingCardProps {
  onOpenCheckout?: (planId: string) => void;
}

export default function PricingCard({ onOpenCheckout }: PricingCardProps) {
  const [timeLeft, setTimeLeft] = useState(898); // ~14m 58s in seconds
  const [seatsLeft, setSeatsLeft] = useState(8);
  
  // Plan switch: 'meesho_single' | 'flipkart_single' | 'combo_pack'
  const [selectedTab, setSelectedTab] = useState<'meesho_single' | 'flipkart_single' | 'combo_pack'>('combo_pack');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 898;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const seatTimer = setInterval(() => {
      setSeatsLeft((prev) => {
        if (prev > 3) {
          if (Math.random() > 0.75) return prev - 1;
        } else {
          if (Math.random() > 0.95) return 8;
        }
        return prev;
      });
    }, 12000);
    return () => clearInterval(seatTimer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  };

  const isCombo = selectedTab === 'combo_pack';
  const price = isCombo ? 348 : 199;
  const originalPrice = isCombo ? 3998 : 1999;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const valueStack = [
    { 
      title: isCombo ? "💻 BOTH Meesho & Flipkart 1-Click Auto Listing Suites" : "💻 1-Click Auto Listing Bulk Spreadsheet Script", 
      desc: isCombo ? "Double your marketplace reach! Process 500+ catalogs on both portals" : "Process and deploy 500+ catalogs automatically", 
      value: isCombo ? "₹3,998" : "₹1,999" 
    },
    { 
      title: "📦 Under-the-Hood Low Weight Shipping Code", 
      desc: "Secret formula to force lowest delivery slabs legally (₹35-₹45)", 
      value: "₹1,499" 
    },
    { 
      title: "🤖 AI SEO Keyword, Title & Duplication Shield", 
      desc: "Auto-generates ranking keywords and avoids indexing duplicate blocks", 
      value: "₹1,299" 
    },
    { 
      title: "📱 Mobile Upload Android Bypass Google Sheet", 
      desc: "No PC needed! Upload straight from your smartphone", 
      value: "₹999" 
    },
    { 
      title: "🎥 Hindi Step-by-Step 7-Minute Setup Guide", 
      desc: "Zero technical words, copy-paste visual screen demo", 
      value: "₹499" 
    },
    { 
      title: "💬 1-on-1 Fast WhatsApp Specialist Support", 
      desc: "Get direct manual configuration assistance anytime", 
      value: "₹999" 
    }
  ];

  const totalActualWorth = isCombo ? 9293 : 7293;

  return (
    <section id="pricing-section" className="py-20 relative bg-radial from-[#12072f] via-[#03000a] to-[#03000a] overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-950/20 text-xs font-bold text-pink-400 mb-4 font-mono uppercase shadow-[0_0_15px_rgba(236,72,153,0.15)]"
          >
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            Limited Period Offer
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-display uppercase tracking-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 glow-text-purple">Automation License</span>
          </h2>
          <p className="text-gray-300 text-xs md:text-sm mt-2 max-w-lg mx-auto font-sans">
            Choose Single Tool for ₹199 or get our most popular Combo Suite for ₹348 (Save Flat ₹50!).
          </p>

          {/* Plan Tabs Selector */}
          <div className="mt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-black/60 border border-purple-500/30">
            
            <button
              type="button"
              onClick={() => setSelectedTab('meesho_single')}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold font-display transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                selectedTab === 'meesho_single'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>Meesho Single</span>
                {selectedTab === 'meesho_single' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-mono text-purple-200">₹199 Lifetime</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('flipkart_single')}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold font-display transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                selectedTab === 'flipkart_single'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>Flipkart Single</span>
                {selectedTab === 'flipkart_single' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-mono text-purple-200">₹199 Lifetime</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('combo_pack')}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold font-display transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                selectedTab === 'combo_pack'
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-yellow-400/50'
                  : 'bg-amber-500/10 text-amber-300 hover:text-white hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <div className="absolute -top-2.5 right-2 bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono shadow">
                Save ₹50
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
                <span>COMBO SUITE</span>
                {selectedTab === 'combo_pack' && <Check className="w-3.5 h-3.5 text-yellow-300" />}
              </div>
              <span className="text-[11px] font-mono font-bold text-yellow-200">₹348 (Both Tools)</span>
            </button>

          </div>
        </div>

        {/* Premium Glow Container Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative max-w-md md:max-w-xl mx-auto rounded-3xl bg-[#090514]/90 border-2 transition-all p-5 sm:p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group ${
            isCombo ? 'border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 'border-pink-500/40 glow-pink'
          }`}
        >
          {/* Top Decorative Floating Elements */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/25 transition-all pointer-events-none" />
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isCombo ? 'from-amber-400 via-pink-500 to-purple-500' : 'from-purple-500 to-pink-500'}`} />

          {/* Tag */}
          <div className={`absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider font-mono shadow ${
            isCombo ? 'bg-gradient-to-r from-amber-500 to-pink-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            <Trophy className="w-3.5 h-3.5" />
            <span>{isCombo ? '⚡ 85% SELLERS PICK THIS' : 'Standard License'}</span>
          </div>

          <div className="text-center md:text-left mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white font-display mb-1">
              {selectedTab === 'meesho_single' && 'Meesho Auto Listing Suite'}
              {selectedTab === 'flipkart_single' && 'Flipkart Auto Listing Suite'}
              {selectedTab === 'combo_pack' && 'Meesho + Flipkart Super Combo'}
            </h3>
            <p className="text-xs text-purple-300 font-sans tracking-wide">
              {isCombo ? 'Get full lifetime access to BOTH automation extensions with instant savings!' : 'Complete automated bulk toolkit + secret weight shipping formula'}
            </p>
          </div>

          {/* Scarcity Notice Strip */}
          <div className="mb-4 bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 text-left">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs text-amber-300 font-semibold leading-tight">
                Hurry! Only <span className="text-white bg-amber-500/30 px-1.5 py-0.5 rounded font-bold font-mono text-shadow">{seatsLeft} Licenses Left</span> at this giveaway price.
              </p>
              <div className="w-full bg-amber-950/40 h-1.5 mt-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "90%" }}
                  animate={{ width: `${(seatsLeft / 10) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-purple-950/50 py-5 my-5">
            <div className="text-center sm:text-left">
              <span className="text-xs text-gray-400 line-through font-mono">
                M.R.P: {CONFIG.currency}{originalPrice}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white font-display text-shadow">
                  {CONFIG.currency}{price}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  {discountPercent}% OFF LIVE
                </span>
              </div>
            </div>

            {/* Timer countdown visual box */}
            <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-xl flex flex-col items-center min-w-[130px] shadow-[0_0_15px_rgba(239,68,68,0.05)]">
              <span className="text-[10px] uppercase font-mono font-bold text-red-400 tracking-wider">
                PRICE RISES IN
              </span>
              <span className="text-base font-bold text-gray-100 font-mono mt-0.5 text-shadow-red animate-pulse">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Dynamic Premium Value Stack Builder */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between border-b border-purple-950 pb-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest font-mono">
                COMPREHENSIVE VALUE STACK:
              </h4>
              <span className="text-[10px] text-gray-400 font-mono font-semibold">EST. VALUE</span>
            </div>
            
            <div className="space-y-3">
              {valueStack.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed text-gray-300 border-b border-purple-950/20 pb-3 last:border-0 last:pb-0">
                  <div className="mt-0.5 bg-pink-500/10 text-pink-400 rounded-full p-0.5 border border-pink-500/20 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-white text-xs leading-tight">{item.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{item.desc}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 shrink-0">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Total Value Calculation Block */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/20 border border-pink-500/10 flex justify-between items-center text-xs">
              <div className="text-left">
                <span className="text-gray-400 font-medium">Total Package Worth:</span>
                <p className="text-[9px] text-pink-400 font-mono uppercase tracking-wider font-bold mt-0.5">⚡ INCREDIBLE LIFETIME SAVINGS</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 line-through font-mono font-medium">₹{totalActualWorth}</span>
                <p className="text-sm font-black text-[#22c55e] font-mono">FREE today</p>
              </div>
            </div>
          </div>

          {/* Conversion CTA Button - Connects directly to Cashfree Modal */}
          <div className="space-y-4">
            <motion.button 
              type="button"
              onClick={() => onOpenCheckout?.(selectedTab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`buy-btn-effect w-full h-14 rounded-2xl text-white font-bold text-base flex justify-center items-center gap-3.5 border cursor-pointer transition-all duration-300 uppercase tracking-wider font-display shadow-lg ${
                isCombo
                  ? 'bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-pink-500 border-yellow-400/40 shadow-[0_0_35px_rgba(245,158,11,0.35)]'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 border-pink-400/20 shadow-[0_0_30px_rgba(236,72,153,0.35)]'
              }`}
            >
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
              <span>PROCEED TO PAY ₹{price} VIA CASHFREE</span>
            </motion.button>

            {/* Satisfaction / Security Notice Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 pt-2 font-mono">
              <div className="flex items-center gap-1.5 justify-center">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>4.9 Star Verified Vendor Rating</span>
              </div>
              
              <div className="flex items-center gap-1.5 justify-center">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                <span>100% Automatic Refund Guarantee</span>
              </div>
            </div>
          </div>

          {/* Security logos */}
          <div className="mt-6 pt-5 border-t border-purple-950/40 flex flex-wrap items-center justify-center gap-4.5 opacity-75">
            <span className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Cashfree Gateway
            </span>
            <span className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded bg-purple-950/30 text-purple-300 border border-purple-900/40 font-mono">UPI &amp; GPay Protected</span>
            <span className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded bg-purple-950/30 text-purple-300 border border-purple-900/40 font-mono">SSL 256 Encryption</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
