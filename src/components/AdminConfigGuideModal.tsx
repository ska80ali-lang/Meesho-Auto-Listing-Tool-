import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Tag, ExternalLink, Sparkles, CheckCircle2, FileCode, HelpCircle, Zap, ArrowRight, Settings, Mail } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { sendOrderConfirmationEmail } from '../utils/emailService';

interface AdminConfigGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestDelivery: (plan: 'single' | 'combo') => void;
  onOpenCheckout: (plan: 'single' | 'combo') => void;
}

export default function AdminConfigGuideModal({
  isOpen,
  onClose,
  onTestDelivery,
  onOpenCheckout
}: AdminConfigGuideModalProps) {
  const [testEmail, setTestEmail] = useState('ska80ali@gmail.com');
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testMsg, setTestMsg] = useState('');

  const handleSendTestEmail = async () => {
    setTestStatus('sending');
    setTestMsg('⏳ Sending test delivery email via EmailJS...');
    const res = await sendOrderConfirmationEmail({
      email: testEmail,
      orderId: 'TEST_' + Math.floor(100000 + Math.random() * 900000),
      planType: 'combo',
      customerName: 'Sk Ali Asgar (Seller Live Test)',
      amountPaid: 348
    });
    if (res.success) {
      setTestStatus('success');
      setTestMsg('✅ Test Email Sent! Check your inbox (' + testEmail + ')');
    } else {
      setTestStatus('error');
      setTestMsg('❌ Failed: ' + (res.message || 'Check EmailJS template setup'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0e0720] text-white rounded-3xl shadow-[0_25px_80px_rgba(168,85,247,0.4)] border-2 border-purple-500/40 p-6 sm:p-8 space-y-6 font-sans my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-50 h-50 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-50 h-50 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-purple-950/60 text-gray-400 hover:text-white border border-purple-800/50 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold font-mono tracking-wider uppercase">
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>Store Admin &amp; Delivery Links Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            🔧 डिलीवरी लिंक्स (Delivery Links) और कूपन कोड कैसे काम करते हैं?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
            आपके कहने पर हमने एक स्पेशल फ़ाइल <code className="text-yellow-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-700 font-mono">src/config/storeConfig.ts</code> बना दी है, जहाँ से आप सब कुछ 1 सेकंड में बदल सकते हैं!
          </p>
        </div>

        {/* Section 1: Delivery Links Explanation */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
            <Zap className="w-5 h-5 shrink-0" />
            <span>1. डिलीवरी लिंक कहाँ पर डालना है? (Instant Delivery URL)</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            जब कोई कस्टमर पेमेंट पूरा कर लेता है, तो हमारा सिस्टम ऑटोमैटिकली 3 सेकंड में उसे आपके दिए गए लिंक (WhatsApp या Download Page) पर भेज देता है।
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-gray-800 font-mono text-xs space-y-2 text-gray-300">
            <div>
              <span className="text-pink-400 font-bold">👉 Single Tool (₹199):</span>
              <div className="text-gray-400 truncate mt-0.5 text-[11px]">{STORE_CONFIG.singleDeliveryUrl}</div>
            </div>
            <div className="pt-2 border-t border-gray-800">
              <span className="text-emerald-400 font-bold">👉 Combo Tool (₹348):</span>
              <div className="text-gray-400 truncate mt-0.5 text-[11px]">{STORE_CONFIG.comboDeliveryUrl}</div>
            </div>
          </div>
          <p className="text-[11px] text-yellow-300 font-medium">
            💡 <strong>बदलने का तरीका:</strong> अपने कोड एडिटर में <code className="bg-purple-900 px-1 rounded">src/config/storeConfig.ts</code> फ़ाइल खोलें और वहाँ <code className="text-pink-300">singleDeliveryUrl</code> और <code className="text-emerald-300">comboDeliveryUrl</code> में अपनी पसंद का लिंक पेस्ट कर दें!
          </p>
        </div>

        {/* Section 2: Coupon Codes Explanation */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm sm:text-base">
            <Tag className="w-5 h-5 shrink-0" />
            <span>2. कूपन कोड (Discount Codes) कैसे बनाएं और कितने का डिस्काउंट दें?</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            कस्टमर जब चेकआउट पेज पर <strong>Have a Discount Code? Add</strong> पर क्लिक करेगा, तो वो कूपन कोड डाल सकेगा।
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {STORE_CONFIG.coupons.map((coupon, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-purple-700/40 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-yellow-300 tracking-wider">{coupon.code}</span>
                  <div className="text-[11px] text-gray-400 mt-0.5">{coupon.description}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 font-mono">
                    {coupon.discountAmount >= 900 ? "99.9% (-₹198)" : `-₹${coupon.discountAmount}`}
                  </span>
                  <div className="text-[10px] text-gray-500">{coupon.isActive ? "Active ✅" : "Disabled ❌"}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-yellow-300 font-medium">
            💡 <strong>नया कूपन बनाने का तरीका:</strong> <code className="bg-purple-900 px-1 rounded">src/config/storeConfig.ts</code> में <code className="text-pink-300">coupons</code> लिस्ट के अंदर नया कोड लिख दें (जैसे: <code className="text-white">code: "DIWALI100", discountAmount: 100</code>)।
          </p>
        </div>

        {/* Section 3: EmailJS Automatic Delivery Setup & Test */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-indigo-950/60 border border-blue-500/40 space-y-3 text-left font-sans">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm sm:text-base">
              <Mail className="w-5 h-5 shrink-0" />
              <span>3. ऑटोमैटिक ईमेल डिलीवरी (EmailJS Active ✅)</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold uppercase">
              Live &amp; Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            आपके दिए गए <strong>Service Key</strong> (<code className="text-pink-300">service_zaez5jj</code>), <strong>Template ID</strong> (<code className="text-emerald-300">template_v62f7oz</code>) और <strong>Public Key</strong> को सिस्टम में कनेक्ट कर दिया गया है! पेमेंट के तुरंत बाद कस्टमर को ऑटोमैटिक ईमेल और टूल का लिंक चला जाएगा।
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-gray-800 space-y-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-400 font-medium">टेस्ट ईमेल आईडी:</span>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="ska80ali@gmail.com"
                className="flex-1 bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg text-white font-mono text-xs outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <button
              onClick={handleSendTestEmail}
              disabled={testStatus === 'sending'}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-md"
            >
              <span>{testStatus === 'sending' ? "⏳ ईमेल भेज रहे हैं..." : "🧪 अभी लाइव टेस्ट ईमेल भेजें (Send Test Email Now)"}</span>
            </button>
            {testMsg && (
              <div className={`p-2.5 rounded-xl text-[11px] font-medium text-center ${testStatus === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'}`}>
                {testMsg}
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-400">
            💡 <strong>टिप:</strong> आप ऊपर अपनी ईमेल आईडी डालकर <strong className="text-yellow-300">"अभी लाइव टेस्ट ईमेल भेजें"</strong> बटन दबाएं। कुछ ही सेकंड में आपके इनबॉक्स में आर्डर डिलीवरी ईमेल आ जाएगा!
          </p>
        </div>

        {/* Section 4: Live Test Actions for Seller */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-purple-950/50 to-emerald-950/50 border border-emerald-500/40 space-y-3 text-center">
          <h4 className="font-bold text-sm text-emerald-300">⚡ 1-Click Live Simulator (बिना पेमेंट किए टेस्ट करें)</h4>
          <p className="text-xs text-gray-300">
            नीचे दिए गए बटन्स दबाकर आप देख सकते हैं कि कस्टमर को चेकआउट और पेमेंट के बाद डिलीवरी स्क्रीन कैसी दिखेगी:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                onClose();
                onTestDelivery('single');
              }}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>🚀 Test Single Delivery (₹199)</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onTestDelivery('combo');
              }}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>👑 Test Combo Delivery (₹348)</span>
            </button>
          </div>
        </div>

        {/* Footer close */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm transition-colors cursor-pointer"
          >
            समझ गया, बंद करें (Close)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
