import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Gift, 
  Loader2, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToHome: () => void;
}

export default function CheckoutPage({ onBackToHome }: CheckoutPageProps) {
  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isCombo, setIsCombo] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field validation helper
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Clean phone input
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: cleanPhone,
          isCombo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment session.');
      }

      // If success, redirect top-level window to Cashfree secure hosted gateway
      if (data.payment_link) {
        window.top!.location.href = data.payment_link;
      } else {
        throw new Error('Cashfree payment link not received.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred while initiating payment. Please try again.');
      setLoading(false);
    }
  };

  const basePrice = 199;
  const comboPrice = 348;
  const currentTotal = isCombo ? comboPrice : basePrice;

  return (
    <div id="checkout-container" className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white font-sans">
      
      {/* Decorative background visual graphics */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-white transition-all cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Secure Direct Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black font-display text-white uppercase tracking-tight">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">Order</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-md mx-auto">
            Get lifetime license keys, step-by-step training, and dedicated support instantly.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form Card */}
          <div className="md:col-span-7 bg-[#1E293B] border border-slate-800 rounded-2xl p-5 md:p-8 shadow-xl">
            
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
              <User className="w-5 h-5 text-blue-400" />
              <span>Customer Details</span>
            </h2>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs md:text-sm p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name" 
                    className="w-full h-12 bg-slate-900/80 border border-slate-800 rounded-xl pl-11 pr-4 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com" 
                    className="w-full h-12 bg-slate-900/80 border border-slate-800 rounded-xl pl-11 pr-4 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">WhatsApp Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs md:text-sm font-semibold font-mono text-slate-500 select-none">+91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    required
                    placeholder="10-digit number" 
                    className="w-full h-12 bg-slate-900/80 border border-slate-800 rounded-xl pl-12 pr-4 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">For instant activation key delivery & support.</span>
              </div>

              {/* Combo Offer Toggle Box */}
              <div className="pt-2">
                <div 
                  onClick={() => setIsCombo(!isCombo)}
                  className={`border p-4.5 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                    isCombo 
                      ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mt-1 shrink-0 ${
                    isCombo ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-700 bg-slate-950/50'
                  }`}>
                    {isCombo && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wide">
                        ADD FLIPKART AUTO LISTING TOOL
                      </span>
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 shadow-sm font-mono animate-pulse">
                        <Gift className="w-2.5 h-2.5 shrink-0" /> Combo Deal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                      Maximize sales! Save an extra ₹50. Get both Meesho & Flipkart automation extensions together for just <span className="text-blue-400 font-bold font-mono">₹348</span> instead of ₹398.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Action Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="buy-btn-effect w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-3 border border-blue-400/20 cursor-pointer shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-display"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5.5 h-5.5 animate-spin" />
                      <span>Initiating Secure Gateways...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                      <span>PROCEED TO PAY ₹{currentTotal}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secure note */}
              <div className="flex items-center justify-center gap-2.5 text-[10px] text-slate-500 pt-2 font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>PCI-DSS SSL Encrypted Security Protocol</span>
              </div>

            </form>
          </div>

          {/* Right: Order Summary Details Card */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Order Card */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 md:p-6 text-left shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6] mb-4 font-mono">
                Your Order Summary
              </h3>

              <div className="space-y-3 pb-4 border-b border-slate-800">
                {/* Item 1 */}
                <div className="flex justify-between items-start text-xs leading-normal">
                  <div className="max-w-[70%]">
                    <p className="font-bold text-white">Meesho Auto-Listing Extension</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Lifetime License & hindi videos</p>
                  </div>
                  <span className="font-bold font-mono text-slate-300">₹199</span>
                </div>

                {/* Item 2 (Optional Combo) */}
                {isCombo && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between items-start text-xs leading-normal pt-1 border-t border-slate-800/40"
                  >
                    <div className="max-w-[70%]">
                      <p className="font-bold text-emerald-400 flex items-center gap-1">
                        Flipkart Listing Extension Upgrade
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Exclusive combo addition</p>
                    </div>
                    <span className="font-bold font-mono text-emerald-400">+₹149</span>
                  </motion.div>
                )}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-4 mb-1">
                <span className="text-xs text-slate-300 font-bold">Grand Total (INR):</span>
                <span className="text-2xl font-black font-mono text-white">₹{currentTotal}</span>
              </div>

              {/* Savings indicator */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-2 text-[10px] font-mono font-bold text-center uppercase tracking-wide">
                🎉 SAVING {isCombo ? '₹450' : '₹300'} ON ORIGINAL VALUE TODAY
              </div>
            </div>

            {/* Satisfaction / Guarantee widget */}
            <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl p-5 text-left space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">100% Secure Gateways</h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Payments are handled safely by Cashfree checkout. Supports UPI (PhonePe, Google Pay, Paytm), Cards, and Net Banking.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 border-t border-slate-800/50 pt-3">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Instant Delivery</h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your verification completes dynamically inside the browser. Access is instantly enabled right after processing.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 text-center text-[10px] text-slate-500 font-mono">
        <p>© 2026 Direct Checkout Integrator. All transactions securely powered by Cashfree Payments.</p>
      </footer>

    </div>
  );
}
