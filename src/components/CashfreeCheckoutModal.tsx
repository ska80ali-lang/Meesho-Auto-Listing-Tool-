import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Tag, Check, ChevronDown, Info, Lock, Zap, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { CONFIG, STORE_CONFIG } from '../data';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

interface CashfreeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: 'single' | 'combo';
}

export default function CashfreeCheckoutModal({ isOpen, onClose, initialPlan = 'single' }: CashfreeCheckoutModalProps) {
  const [name, setName] = useState('Sk Ali Asgar');
  // Email removed from UI as requested by seller ("email id ko remove kar do"), using silent default
  const [email] = useState('ska80ali@gmail.com');
  const [phone, setPhone] = useState('7365890209');
  const [isCombo, setIsCombo] = useState(initialPlan === 'combo');
  
  // Full screen details modal state for Flipkart tool
  const [showFlipkartModal, setShowFlipkartModal] = useState(false);
  
  // Discount coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; desc: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const basePrice = CONFIG.discountedPrice || 199;
  const flipkartAddonPrice = 149;
  const originalFlipkartPrice = 199;
  
  const subTotal = isCombo ? basePrice + flipkartAddonPrice : basePrice;
  // If coupon discount is >= 900 (like TEST99 / TEST1RS), set discount to subTotal - 1 so user pays exactly ₹1 for live PG testing
  const discountAmount = appliedCoupon ? (appliedCoupon.amount >= 900 ? subTotal - 1 : appliedCoupon.amount) : 0;
  const totalAmount = Math.max(1, subTotal - discountAmount);

  // Apply discount code handler
  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const found = STORE_CONFIG.coupons.find(c => c.code.toUpperCase() === code && c.isActive);
    if (found) {
      setAppliedCoupon({
        code: found.code,
        amount: found.discountAmount,
        desc: found.description
      });
      setShowCouponInput(false);
      setCouponInput('');
    } else {
      setCouponError("Invalid or expired coupon code. Try 'TEST99', 'MEESHO50' or 'FLIPKART100'");
    }
  };

  const handleProceedToPay = async () => {
    setErrorMsg(null);
    if (!phone || phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      // Save plan type in localStorage so landing page can identify it immediately after redirect
      const planType = isCombo ? "combo" : "single";
      try {
        localStorage.setItem("cashfree_last_plan_type", planType);
      } catch (e) {
        console.warn("localStorage not available:", e);
      }

      // 1. Call dual backend API endpoint
      const response = await fetch("/api/create-cashfree-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: name || "Valued Seller",
          customer_phone: phone,
          customer_email: email,
          order_amount: totalAmount,
          plan_type: planType,
          return_url_base: window.location.origin
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || data?.details || "Failed to initiate Cashfree checkout session.");
      }

      // 2. If session was simulated (e.g. testing locally or fallback if Cashfree API keys reject test order)
      if (data.is_simulated) {
        console.info("Simulated checkout session active. Redirecting directly to instant delivery screen...");
        setTimeout(() => {
          window.location.href = `${window.location.origin}/?order_id=${data.order_id}&payment_status=PAID&plan=${planType}`;
        }, 1000);
        return;
      }

      // 3. Initialize Official Cashfree v3 SDK
      if (typeof window.Cashfree === "undefined") {
        throw new Error("Cashfree SDK failed to initialize. Please check your internet connection or disable ad-blockers.");
      }

      const cashfree = window.Cashfree({ mode: "production" });

      // 4. Trigger Cashfree Checkout
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self"
      });

    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      setErrorMsg(err?.message || "Something went wrong initiating checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* FULL SCREEN ON MOBILE (w-full h-full rounded-none), LARGE MODAL ON DESKTOP (max-w-lg max-h-[92vh] rounded-2xl) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-lg bg-[#ffffff] text-gray-900 sm:rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden font-sans border border-gray-200 flex flex-col my-auto"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base tracking-wide text-gray-900 font-display">CHECKOUT</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Customer Details (ONLY Name & Phone Number as requested, email removed) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700">
              Access to this purchase will be sent to your WhatsApp number
            </label>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-gray-500">Phone number (WhatsApp delivery) *</span>
              <div className="flex rounded-xl border border-gray-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 bg-white overflow-hidden transition-all">
                <div className="flex items-center gap-1 px-3 bg-gray-100 border-r border-gray-300 text-sm font-bold text-gray-700 select-none">
                  <span>+91</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="7365890209"
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 outline-none text-sm font-medium text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-gray-500">Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sk Ali Asgar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none text-sm font-medium bg-white text-gray-900 transition-all"
              />
            </div>
          </div>

          {/* Flipkart Auto Listing Tool Add-On Card (Clickable to open full banner & details!) */}
          <div className="rounded-2xl border-2 border-dashed border-blue-500 bg-blue-50/60 p-4 transition-all relative overflow-hidden">
            {/* Main Clickable Area to Open Full Screenshot Modal */}
            <div 
              onClick={() => setShowFlipkartModal(true)}
              className="flex items-start gap-3.5 cursor-pointer group"
              title="Click to view full image & features"
            >
              {/* Thumbnail Image */}
              <img
                src="https://media-cdn.cosmofeed.com/chat/1000055066-2026-27-05-04-34-47.png"
                alt="Flipkart Auto Listing Tool"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-blue-200 shadow-sm shrink-0 referrerPolicy group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 leading-tight font-display group-hover:text-blue-700 transition-colors">
                  Flipkart Auto Listing Tool + AI SEO Generator
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-blue-700">
                  <span>Flipkart Auto Listing Tool</span>
                  <span className="text-amber-600">⚡ Extra ₹50 OFF 💸</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-normal">
                  Ab products manually upload karne ka jhanjhat khatam 😮...
                </p>
                <div className="flex items-center gap-2 mt-2 font-mono">
                  <span className="text-sm font-extrabold text-gray-900">₹{flipkartAddonPrice}</span>
                  <span className="text-xs text-gray-400 line-through">₹{originalFlipkartPrice}</span>
                </div>
              </div>
            </div>

            {/* Checkbox Button & View Details link */}
            <div className="mt-3.5 pt-3 border-t border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setIsCombo(!isCombo)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                  isCombo
                    ? "bg-emerald-600 text-white border border-emerald-700 shadow-emerald-600/20"
                    : "bg-white text-gray-800 border border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  isCombo ? "bg-white border-white text-emerald-600" : "border-gray-400 bg-white"
                }`}>
                  {isCombo && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{isCombo ? "✓ Flipkart Tool Added to Combo" : "Add Flipkart Tool"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFlipkartModal(true)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer underline"
              >
                <Info className="w-3.5 h-3.5" />
                <span>View Full Banner &amp; AI Features ➔</span>
              </button>
            </div>
          </div>

          {/* Discount Coupon Code Section (Powered by STORE_CONFIG) */}
          <div className="rounded-xl bg-gray-100 border border-gray-200 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 text-purple-600" />
                <span>Have a Discount Code?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCouponInput(!showCouponInput);
                  setCouponError(null);
                }}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
              >
                {showCouponInput ? "Close" : appliedCoupon ? "Change" : "Add"}
              </button>
            </div>

            {/* Applied Coupon Display */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied! (-₹{discountAmount})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-red-600 hover:text-red-800 text-[11px] font-bold underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Input Box when clicking Add */}
            <AnimatePresence>
              {showCouponInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-1 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter code (e.g. TEST99)"
                      className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-gray-300 rounded-lg outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}
                  <p className="text-[10px] text-gray-500">
                    💡 Hint: Testing Code: <strong className="text-purple-700">TEST99</strong> (Pay only ₹1). Other codes: <strong>MEESHO50</strong>, <strong>FLIPKART100</strong>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">{errorMsg}</div>
            </div>
          )}

          {/* Price Summary Table */}
          <div className="space-y-2 border-t border-gray-200 pt-3 text-sm font-medium text-gray-700 font-sans">
            <div className="flex justify-between items-center">
              <span>Sub Total</span>
              <span className="font-mono font-bold text-gray-900">₹{subTotal}</span>
            </div>
            {isCombo && (
              <div className="flex justify-between items-center text-emerald-600 text-xs">
                <span>Combo Bundle Discount Applied</span>
                <span className="font-mono font-bold">- ₹50 OFF</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between items-center text-purple-700 text-xs font-semibold">
                <span>Coupon ({appliedCoupon.code}) Discount</span>
                <span className="font-mono font-bold">- ₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span className="font-mono text-lg text-purple-700">₹{totalAmount}</span>
            </div>
          </div>

        </div>

        {/* Bottom Action Footer Button */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 shrink-0 space-y-3">
          <button
            type="button"
            onClick={handleProceedToPay}
            disabled={loading}
            className="w-full h-14 rounded-xl bg-black hover:bg-gray-800 active:bg-gray-900 text-white font-extrabold text-base flex items-center justify-between px-6 shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{loading ? "Connecting Cashfree..." : "Pay Now & Unlock Access"}</span>
            </div>
            <span className="text-lg">➔</span>
          </button>
          
          <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 font-mono text-center">
            <span>🔒 100% Secure RBI Approved</span>
            <span>•</span>
            <span>⚡ Instant Auto Delivery</span>
            <span>•</span>
            <span>💬 WhatsApp Backup</span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* FULL SCREEN FLIPKART TOOL PREVIEW MODAL (EXACT SCREENSHOTS 3 & 4 DESIGN) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFlipkartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-lg bg-[#ffffff] text-gray-900 sm:rounded-2xl shadow-2xl overflow-y-auto flex flex-col font-sans"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white sticky top-0 z-10 shrink-0">
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 font-display">
                  Flipkart Auto Listing Tool + AI SEO Generator
                </h3>
                <button
                  onClick={() => setShowFlipkartModal(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full Width Banner Image (Exact requirement: "add on ka jo image hai vah pura dikhna chahie") */}
              <div className="w-full bg-blue-900 shrink-0">
                <img
                  src="https://media-cdn.cosmofeed.com/chat/1000055066-2026-27-05-04-34-47.png"
                  alt="Flipkart Auto Listing Tool Complete Banner"
                  className="w-full h-auto object-contain referrerPolicy block"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-4 flex-1 text-gray-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-gray-900">
                    <span>Flipkart Auto Listing Tool</span>
                    <span className="text-amber-600 text-xs sm:text-sm">⚡ Extra ₹50 OFF 💸</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Ab products manually upload karne ka jhanjhat khatam 😮...
                  </p>
                </div>

                {/* Checklist from Screenshot 4 */}
                <div className="space-y-2.5 pt-2 border-t border-gray-200 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>1-Click Bulk Listing</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>AI SEO Title Generator 🤖</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>AI Product Description Generator ✍️</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>Smart Keyword Suggestions 🔍</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>Faster Product Upload 🚀</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>Save Time &amp; Increase Orders 📈</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600 text-base">✅</span> <span>Beginner Friendly + Mobile Supported 📱</span></div>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-1 text-xs sm:text-sm font-bold text-gray-900">
                  <p>Thousands of sellers already using automation to scale faster 💰</p>
                  <p className="text-orange-600">Ab tum bhi smarter way mein Flipkart selling start karo 🔥</p>
                </div>
              </div>

              {/* Footer Action inside Flipkart Modal */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 sticky bottom-0 z-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCombo(true);
                    setShowFlipkartModal(false);
                  }}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Add Flipkart Tool to Order (+₹149) ➔</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlipkartModal(false)}
                  className="px-4 h-12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

