import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Download, MessageSquare, ExternalLink, ShieldCheck, Zap, ArrowRight, X, Clock, Mail } from 'lucide-react';
import { CONFIG } from '../data';
import { sendOrderConfirmationEmail } from '../utils/emailService';

interface CashfreeDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  planType: 'single' | 'combo';
  orderAmount?: number;
}

export default function CashfreeDeliveryModal({
  isOpen,
  onClose,
  orderId,
  planType,
  orderAmount
}: CashfreeDeliveryModalProps) {
  const [countdown, setCountdown] = useState(4);
  const [redirectTriggered, setRedirectTriggered] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'error' | 'idle'>('idle');
  const [targetEmail, setTargetEmail] = useState('');

  // Construct target WhatsApp / Download delivery URL
  const baseDeliveryUrl = planType === 'combo' ? CONFIG.comboDeliveryUrl : CONFIG.singleDeliveryUrl;
  const deliveryUrl = `${baseDeliveryUrl}${encodeURIComponent(orderId)}`;

  // Automatically trigger EmailJS order confirmation on modal open
  useEffect(() => {
    if (!isOpen) return;
    const storedEmail = localStorage.getItem('cashfree_last_customer_email') || 'ska80ali@gmail.com';
    const storedName = localStorage.getItem('cashfree_last_customer_name') || 'Valued Seller';
    setTargetEmail(storedEmail);

    const sentKey = `emailjs_sent_${orderId}`;
    if (localStorage.getItem(sentKey)) {
      setEmailStatus('sent');
      return;
    }

    setEmailStatus('sending');
    sendOrderConfirmationEmail({
      email: storedEmail,
      orderId: orderId,
      planType: planType,
      customerName: storedName,
      amountPaid: orderAmount
    }).then(res => {
      if (res.success) {
        setEmailStatus('sent');
        try { localStorage.setItem(sentKey, 'true'); } catch(e){}
      } else {
        setEmailStatus('error');
      }
    });
  }, [isOpen, orderId, planType, orderAmount]);

  useEffect(() => {
    if (!isOpen || redirectTriggered) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!redirectTriggered) {
            setRedirectTriggered(true);
            console.info("Auto-redirecting post payment verification to:", deliveryUrl);
            try {
              window.location.href = deliveryUrl;
            } catch (err) {
              console.warn("Auto redirect blocked by browser, waiting for user tap:", err);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, redirectTriggered, deliveryUrl]);

  if (!isOpen) return null;

  const handleManualRedirect = () => {
    setRedirectTriggered(true);
    window.location.href = deliveryUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-[#0d0725] text-white rounded-3xl shadow-[0_30px_80px_rgba(236,72,153,0.35)] border-2 border-emerald-500/50 p-6 sm:p-8 text-center space-y-6 font-sans my-auto overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/40 text-gray-400 hover:text-white border border-purple-800/40 transition-colors cursor-pointer z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.6)] border-2 border-white animate-bounce-short">
          <CheckCircle className="w-11 h-11 text-white stroke-[2.5]" />
        </div>

        {/* Header Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold font-mono tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            <span>Payment Verified &amp; License Activated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
            Congratulations! 🎉 Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-emerald-400">Tool Access</span> is Ready!
          </h2>
        </div>

        {/* Order Info Card */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-gray-300">
            <span>Verified Order ID:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 truncate max-w-[200px]">
              #{orderId}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>Licensed Package:</span>
            <span className="font-bold text-pink-300">
              {planType === 'combo' ? "👑 Combo Pack (Meesho + Flipkart Suite)" : "⚡ Single Pack (Meesho Suite)"}
            </span>
          </div>
          {orderAmount && (
            <div className="flex justify-between items-center text-gray-300">
              <span>Amount Paid:</span>
              <span className="font-bold text-white">₹{orderAmount} (Paid in Full)</span>
            </div>
          )}
        </div>

        {/* EmailJS Automatic Delivery Status Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 border border-purple-500/50 text-left flex items-center justify-between gap-3 font-sans shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs sm:text-sm text-purple-200 flex items-center gap-1.5">
                {emailStatus === 'sending' && "📧 Sending Instant Access Email..."}
                {emailStatus === 'sent' && "✅ Access Link Sent to Email!"}
                {emailStatus === 'error' && "⚠️ Email Delivery Notice"}
                {emailStatus === 'idle' && "⚡ Preparing Email Delivery..."}
              </div>
              <div className="text-[11px] text-gray-300 font-mono truncate">
                Sent to: <strong className="text-yellow-300 underline">{targetEmail}</strong>
              </div>
            </div>
          </div>
          {emailStatus === 'sent' && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
              <span>Delivered</span>
              <span className="animate-bounce">✓</span>
            </span>
          )}
        </div>

        {/* Auto Redirect Countdown Notice */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-purple-950/60 to-emerald-950/60 border border-emerald-500/40 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-300 shadow-inner">
          <Clock className="w-5 h-5 text-yellow-300 animate-spin-slow shrink-0" />
          <span>
            {countdown > 0
              ? `Automatically redirecting to your setup link in ${countdown}s...`
              : "Redirecting now to your automated link..."}
          </span>
        </div>

        {/* Direct WhatsApp / Download Button */}
        <div className="space-y-3">
          <button
            onClick={handleManualRedirect}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(16,185,129,0.5)] border border-white/20 transition-all hover:scale-102 active:scale-98 cursor-pointer uppercase tracking-wider font-display"
          >
            <MessageSquare className="w-6 h-6 fill-white shrink-0" />
            <span className="flex-1 text-center">Instant Download &amp; Setup Videos</span>
            <ArrowRight className="w-6 h-6 shrink-0" />
          </button>
          
          <p className="text-[11px] text-gray-400 font-sans">
            👉 Button automatically pre-fills your verified Order ID <strong className="text-gray-200">#{orderId}</strong> for instant 2-second automated software ZIP download and 7-min Hindi tutorial access.
          </p>
        </div>

        {/* Secondary support link */}
        <div className="pt-2 border-t border-purple-900/40 flex items-center justify-center gap-4 text-xs font-mono text-purple-300">
          <span>📱 WhatsApp Support: 6295429762</span>
          <span>•</span>
          <button onClick={onClose} className="hover:text-white underline cursor-pointer bg-transparent border-none p-0 text-purple-300">
            Stay on Landing Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
