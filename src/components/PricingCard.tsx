import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CONFIG } from '../data';
import { ShieldCheck, Zap, Star, Flame, Trophy, RefreshCw, AlertCircle } from 'lucide-react';

export default function PricingCard() {
  const [timeLeft, setTimeLeft] = useState(898); // ~14m 58s in seconds
  const [seatsLeft, setSeatsLeft] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 898; // auto reset countdown loop so they never see it hit zero
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slowly fluctuate seats left to make it look realistic
  useEffect(() => {
    const seatTimer = setInterval(() => {
      setSeatsLeft((prev) => {
        if (prev > 3) {
          // 25% chance of decreasing a seat
          if (Math.random() > 0.75) return prev - 1;
        } else {
          // If 3 seats left, reset to 8 after a while to avoid hitting 0
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

  const originalPrice = CONFIG.originalPrice;
  const price = CONFIG.discountedPrice;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const valueStack = [
    { title: "💻 1-Click Auto Listing Bulk Spreadsheet Script", desc: "Process and deploy 500+ catalogs automatically", value: "₹1,999" },
    { title: "📦 Under-the-Hood Low Weight Shipping Code", desc: "Secret formula to force Meesho's lowest delivery slab legally", value: "₹1,499" },
    { title: "📱 Mobile Upload Android Bypass Google Sheet", desc: "No PC needed! Upload straight from your smartphone", value: "₹999" },
    { title: "🎥 Hindi Step-by-Step 7-Minute Video Guide", desc: "Zero technical words, copy-paste visual screen demo", value: "₹499" },
    { title: "💬 1-on-1 Fast WhatsApp Specialist Support", desc: "Get direct manual configuration assistance anytime", value: "₹999" }
  ];

  const totalActualWorth = 5995;

  return (
    <section id="pricing-section" className="py-20 relative bg-radial from-[#12072f] via-[#03000a] to-[#03000a] overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-12">
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
            Stop Overpaying, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 glow-text-purple">Start Earning</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-lg mx-auto">
            Take instant action today. Save thousands in manual labor and listing manager fees.
          </p>
        </div>

        {/* Premium Glow Container Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md md:max-w-xl mx-auto rounded-3xl bg-[#090514]/90 border-2 border-pink-500/40 glow-pink p-5 sm:p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group"
        >
          {/* Top Decorative Floating Elements */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/25 transition-all pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

          {/* Tag */}
          <div className="absolute top-5 right-5 flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(236,72,153,0.3)]">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best Seller</span>
          </div>

          <div className="text-center md:text-left mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white font-display mb-1">
              Meesho Instant Listing Pack
            </h3>
            <p className="text-xs text-purple-300 font-sans tracking-wide">
              Complete automated bulk toolkit + secret weight formula
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

          {/* NEW: Dynamic Premium Value Stack Builder */}
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
                <p className="text-[9px] text-pink-400 font-mono uppercase tracking-wider font-bold mt-0.5">⚡ INCREDIBLE 97% LIFETIME SAVING</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 line-through font-mono font-medium">₹{totalActualWorth}</span>
                <p className="text-sm font-black text-[#22c55e] font-mono">FREE today</p>
              </div>
            </div>
          </div>

          {/* Conversion CTA */}
          <div className="space-y-4">
            <motion.a 
              href={CONFIG.ctaRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base flex justify-center items-center gap-3.5 border border-pink-400/20 cursor-pointer shadow-[0_0_30px_rgba(236,72,153,0.35)] transition-all duration-300 uppercase tracking-wider font-display"
            >
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
              Claim Access Now (₹{price})
            </motion.a>

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
          <div className="mt-6 pt-5 border-t border-purple-950/40 flex flex-wrap items-center justify-center gap-4.5 opacity-65">
            <img 
              src="https://checkout.razorpay.com/v1/checkout.js" 
              className="hidden" 
              alt="razorpay check" 
            />
            {/* Minimal visual security badge indicators */}
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-purple-950/20 text-purple-300 border border-purple-900/30 font-mono">UPI Protected</span>
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-purple-950/20 text-purple-300 border border-purple-900/30 font-mono">PCI-DSS Compliant</span>
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-purple-950/20 text-purple-300 border border-purple-900/30 font-mono">SSL 256 Encryption</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
