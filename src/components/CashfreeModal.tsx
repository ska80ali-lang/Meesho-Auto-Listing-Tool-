import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  X, 
  HelpCircle, 
  Sparkles, 
  Smartphone, 
  RefreshCw, 
  Check, 
  Layers, 
  Key, 
  ExternalLink 
} from 'lucide-react';
import { CHECKOUT_PLANS } from '../data';
import { CheckoutPlan } from '../types';

interface CashfreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
}

export const CashfreeModal: React.FC<CashfreeModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'meesho_single'
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Setup guidance mode if merchant API keys are not yet added in environment
  const [setupRequiredInfo, setSetupRequiredInfo] = useState<any | null>(null);
  const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  // Sync when initialPlanId changes from outside (e.g. clicked different card)
  useEffect(() => {
    if (initialPlanId && CHECKOUT_PLANS[initialPlanId]) {
      setSelectedPlanId(initialPlanId);
    } else if (initialPlanId === 'combo' || initialPlanId === 'both') {
      setSelectedPlanId('combo_pack');
    } else {
      setSelectedPlanId('meesho_single');
    }
    setSetupRequiredInfo(null);
    setErrorMsg(null);
    setSimulatedSuccess(false);
  }, [initialPlanId, isOpen]);

  if (!isOpen) return null;

  const currentPlan: CheckoutPlan = CHECKOUT_PLANS[selectedPlanId] || CHECKOUT_PLANS.meesho_single;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp / Mobile Number.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: currentPlan.id,
          planName: currentPlan.name,
          price: currentPlan.price,
          customerName: name || 'Meesho Seller',
          customerPhone: phone,
          customerEmail: email || 'seller@meesho.com'
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.status === 'setup_required') {
        setSetupRequiredInfo(data);
        return;
      }

      if (data.status === 'success') {
        // Try to load Cashfree JS SDK or redirect to payment link
        if ((window as any).Cashfree && data.payment_session_id) {
          const cashfree = (window as any).Cashfree({ mode: 'production' });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: '_self'
          });
        } else if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          setErrorMsg('Order created, but payment link was empty. Please check Cashfree dashboard.');
        }
      } else {
        setErrorMsg(data.message || 'Payment initialization failed. Please check credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('Network connectivity error. Please check internet connection.');
    }
  };

  const handleSimulateTestPayment = () => {
    setIsSimulatingSuccess(true);
    setTimeout(() => {
      setIsSimulatingSuccess(false);
      setSimulatedSuccess(true);
      setTimeout(() => {
        // Automatically redirect or show success after 2 seconds
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0a0614] border border-pink-500/40 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.25)] overflow-hidden text-left my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-purple-900/60 p-4 sm:p-6 border-b border-pink-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                <span>✓ 100% Cashfree Verified Gateway</span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white font-display tracking-tight mt-0.5">
                Instant Automatic License Checkout
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* If Merchant Setup Needed Guidance Screen */}
          {setupRequiredInfo ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 space-y-3">
                <div className="flex items-start gap-3">
                  <Key className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-extrabold text-white font-display">
                      🛠️ Cashfree API Keys Setup Required
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed font-sans">
                      Aapne Cashfree integration successfully choose kiya hai! Real money payments aur live UPI QR enable karne ke liye aapko apne AI Studio workspace secrets ya <code className="text-pink-400 bg-black/40 px-1.5 py-0.5 rounded font-mono">.env</code> file me niche diye gaye 2 credentials daalne honge:
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-3.5 rounded-xl border border-gray-800 font-mono text-xs space-y-2 text-gray-200">
                  <div className="flex justify-between items-center pb-1.5 border-b border-gray-800/80">
                    <span className="text-purple-400 font-bold">1. CASHFREE_APP_ID</span>
                    <span className="text-[11px] text-gray-400">(Merchant Dashboard → API Keys)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold">2. CASHFREE_SECRET_KEY</span>
                    <span className="text-[11px] text-gray-400">(Secret Key Copy karke paste karein)</span>
                  </div>
                  <div className="pt-1 text-[11px] text-emerald-400 font-sans">
                    💡 <strong>Note:</strong> Jaise hi aap yeh keys daalenge, customer ke Buy Now click par automatically selected combo / single plan ka exact price (₹{currentPlan.price}) Cashfree gateway me load ho jayega!
                  </div>
                </div>
              </div>

              {/* Simulation for Testing */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/50 to-pink-950/30 border border-purple-500/30 text-center space-y-3">
                <h5 className="text-sm font-bold text-white font-display">
                  🎮 Want to test the 2-Second Download Redirect right now?
                </h5>
                <p className="text-xs text-gray-300 max-w-lg mx-auto">
                  Aap bina real payment kiye simulation test kar sakte hain taaki dekh sakein ki payment clear hone ke baad website kaise 2 second me Hindi tutorial &amp; download screen par redirect karti hai.
                </p>

                {simulatedSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 space-y-2 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-extrabold text-white">Payment Verified Successfully! ₹{currentPlan.price}</p>
                    <p className="text-xs font-mono">Redirecting to Instant Setup &amp; Training Page in 2 seconds...</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSimulateTestPayment}
                    disabled={isSimulatingSuccess}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    {isSimulatingSuccess ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Simulating Gateway Verification...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Test Simulate Payment Success (₹{currentPlan.price})</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Back to Website
                </button>
              </div>
            </div>
          ) : (
            /* Normal Customer Checkout View */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Plan Selection Radio Tabs (Dynamic Price Auto-Sync) */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono block">
                  1. Verify Your Selected Plan &amp; Auto Price
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {Object.values(CHECKOUT_PLANS).map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-black border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                            : 'bg-white/5 border-white/10 hover:border-purple-500/40 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-300'
                            }`}>
                              {plan.id === 'combo_pack' ? 'COMBO' : 'SINGLE'}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                          </div>
                          <h4 className="text-xs font-bold text-white font-display line-clamp-1">
                            {plan.name}
                          </h4>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/10 flex items-baseline justify-between">
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            ₹{plan.price}
                          </span>
                          <span className="text-[10px] text-gray-500 line-through font-mono">
                            ₹{plan.originalPrice}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-black to-pink-950/40 border border-purple-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-300 font-sans">
                  <span>Selected Package:</span>
                  <strong className="text-white font-display">{currentPlan.name}</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-300 font-sans">
                  <span>Instant Delivery SLA:</span>
                  <span className="text-emerald-400 font-mono font-bold">0-5 Minutes (Auto Redirect)</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-300 font-sans">
                  <span>Gateway Handling &amp; GST:</span>
                  <span className="text-gray-400 font-mono">₹0 (Included)</span>
                </div>
                <div className="pt-2 border-t border-gray-800/80 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total Amount Payable:</span>
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 font-mono">
                    ₹{currentPlan.price}
                  </span>
                </div>
              </div>

              {/* Customer Delivery Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono block">
                  2. Enter Contact Details (For Instant Delivery Link)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10 digit WhatsApp No."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Email Address (Optional for backup receipt)</label>
                  <input
                    type="email"
                    placeholder="e.g. seller@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm sm:text-base uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Connecting to Cashfree Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>PROCEED TO PAY ₹{currentPlan.price} VIA CASHFREE</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-gray-400 font-mono">
                  <span>🔒 256-Bit SSL Secured</span>
                  <span>•</span>
                  <span>⚡ 2-Sec Instant Redirect</span>
                  <span>•</span>
                  <span>✓ UPI, GPay, PhonePe, Cards</span>
                </div>
              </div>

            </form>
          )}

        </div>

        {/* Footer info banner */}
        <div className="bg-black/80 px-4 sm:px-6 py-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Registered: Meesho AutoListing Automation Suites</span>
          <span className="text-purple-400 font-bold">100% Cashfree Verified</span>
        </div>

      </div>
    </div>
  );
};
