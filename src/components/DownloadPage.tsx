import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Play, 
  ExternalLink, 
  CheckCircle, 
  HelpCircle, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  FileSpreadsheet,
  Video,
  Award,
  PhoneCall,
  Gift
} from 'lucide-react';

interface DownloadPageProps {
  onBackToHome: () => void;
}

export default function DownloadPage({ onBackToHome }: DownloadPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [downloads, setDownloads] = useState<any>(null);

  // Parse query parameters from hash
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  const orderId = params.get('order_id') || '';

  useEffect(() => {
    if (!orderId) {
      setError('Invalid Access: Order ID is missing.');
      setLoading(false);
      return;
    }

    const fetchOrderStatusAndDownloads = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/check-order-status?order_id=${orderId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Payment verification failed or access denied.');
        }

        setOrder(data.order);
        setDownloads(data.downloads);
      } catch (err: any) {
        console.error('Download Page verification failed:', err);
        setError(err.message || 'Unable to load download content. Please ensure payment is completed.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatusAndDownloads();
  }, [orderId]);

  if (loading) {
    return (
      <div id="download-loading" className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-sm text-center border border-slate-800 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-200">Verifying Your Transaction</h2>
          <p className="text-xs text-slate-400">Communicating with payment gateway databases. Please hold on...</p>
        </div>
      </div>
    );
  }

  if (error || !order || !downloads) {
    return (
      <div id="download-error" className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1E293B] border border-red-500/30 p-6 sm:p-8 rounded-2xl max-w-md text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Access Denied / Verification Failed</h2>
              <p className="text-xs text-slate-400 mt-1">Order ID: <span className="font-mono text-slate-300">{orderId || 'N/A'}</span></p>
            </div>
          </div>

          <div className="mt-5 text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <p className="font-semibold text-red-400">Reason:</p>
            <p className="mt-1">{error || 'The system could not verify a successful transaction matching this order key.'}</p>
            <p className="mt-3 text-slate-400 text-[11px]">If you paid but see this screen, do not worry! Your amount is 100% safe. Just send a screenshort to support to get activated manually.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={onBackToHome}
              className="flex-1 min-w-[120px] h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors uppercase tracking-wider"
            >
              Back to Home
            </button>
            <a 
              href="https://wa.me/917388334170?text=Hi%2C%20I%20have%20an%20issue%20with%20payment%20verification%20Order%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors uppercase tracking-wider"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isCombo = order.purchaseType === 'Combo';

  return (
    <div id="download-container" className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white font-sans">
      
      {/* Visual gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-blue-500/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* Dynamic Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-slate-200 font-mono">Payment Confirmed</span>
          </div>
          
          <button 
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer transition-colors"
          >
            Back to Homepage
          </button>
        </div>
      </header>

      {/* Main Download Board Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Success greeting banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl text-center md:text-left mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border border-emerald-500/20">
                Direct License Granted
              </span>
              <h1 className="text-xl md:text-3xl font-extrabold font-display text-white tracking-tight mt-1">
                Thank you, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{order.name}</span>!
              </h1>
              <p className="text-xs text-slate-400">Your payment has been successfully cleared and verified securely.</p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl min-w-[240px] text-left text-xs font-mono space-y-1.5 shrink-0 shadow-md">
              <div className="flex justify-between"><span className="text-slate-500">ORDER ID:</span><span className="text-slate-300 font-bold">{order.orderId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">LICENSE TYPE:</span><span className="text-blue-400 font-extrabold">{order.purchaseType} Deal</span></div>
              <div className="flex justify-between"><span className="text-slate-500">AMOUNT PAID:</span><span className="text-emerald-400 font-bold">INR {order.amount}</span></div>
            </div>
          </div>
        </motion.div>

        {/* Downloads Grid block */}
        <div className="space-y-8">
          
          {/* Card 1: Meesho Product Kit */}
          {downloads.meesho && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1E293B] border border-slate-800 rounded-3xl p-5 md:p-8 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base md:text-lg font-bold text-white font-display">Meesho Auto-Listing Automation Tool</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Bulk catalog spreadsheet uploader & lowest-tier weight setup</p>
                  </div>
                </div>
                
                <a 
                  href={downloads.meesho.toolLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-btn-effect px-5 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs md:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-transform hover:scale-[1.02]"
                >
                  <Download className="w-4.5 h-4.5 shrink-0" />
                  <span>DOWNLOAD EXTENSION (ZIP)</span>
                </a>
              </div>

              {/* Training section & templates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Video tutorial (Hindi) */}
                <div className="lg:col-span-7 space-y-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] font-mono flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-blue-400" /> Video Tutorial (Hindi)
                  </span>
                  
                  {/* Embedded responsive video player */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                    <video 
                      src={downloads.meesho.videoLink} 
                      controls 
                      className="w-full h-full object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">Watch this 15-minute training before setting up the extension.</span>
                </div>

                {/* Templates & Guides panel */}
                <div className="lg:col-span-5 space-y-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] font-mono flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Excel Templates & Instructions
                  </span>

                  <div className="bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-slate-800/80 space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Download the pre-configured Excel listing spreadsheet. This matches our automation scripts exactly so you can load 500+ items inside seconds.
                    </p>

                    <a 
                      href={downloads.meesho.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#22c55e]" />
                      <span>ACCESS SMART SPREADSHEET</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-400" />
                    </a>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-[10px] text-blue-300 leading-normal space-y-1">
                      <p className="font-bold text-white font-mono uppercase tracking-wide">💡 Setup Rule:</p>
                      <p>Unpack the zip folder, go to your Chrome browserExtensions page (chrome://extensions), enable Developer Mode, and click "Load unpacked" to select the folder.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Card 2: Flipkart Product Kit (Only if Combo deal) */}
          {isCombo && downloads.flipkart && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1E293B] border border-slate-800 rounded-3xl p-5 md:p-8 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base md:text-lg font-bold text-white font-display">Flipkart Auto-Listing Automation Tool</h2>
                      <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded font-mono border border-amber-500/20 uppercase tracking-wide">Combo Upgrade</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Fast-track upload scripts & direct size calculator templates</p>
                  </div>
                </div>
                
                <a 
                  href={downloads.flipkart.toolLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-btn-effect px-5 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs md:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-transform hover:scale-[1.02]"
                >
                  <Download className="w-4.5 h-4.5 shrink-0" />
                  <span>DOWNLOAD EXTENSION (ZIP)</span>
                </a>
              </div>

              {/* Flipkart Training & Excel templates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Flipkart Video training */}
                <div className="lg:col-span-7 space-y-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-amber-400" /> Video Tutorial (Hindi)
                  </span>
                  
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                    <video 
                      src={downloads.flipkart.videoLink} 
                      controls 
                      className="w-full h-full object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">Watch this screen-recording before applying the Flipkart automation.</span>
                </div>

                {/* Flipkart spreadsheet Resource */}
                <div className="lg:col-span-5 space-y-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> Flipkart Templates & Instructions
                  </span>

                  <div className="bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-slate-800/80 space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Use this spreadsheet to prep your Flipkart listings and activate the optimized dimensions directly in our script panel.
                    </p>

                    <a 
                      href={downloads.flipkart.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#22c55e]" />
                      <span>ACCESS FLIPKART SPREADSHEET</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-400" />
                    </a>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-[10px] text-amber-300 leading-normal space-y-1">
                      <p className="font-bold text-white font-mono uppercase tracking-wide">💡 Setup Rule:</p>
                      <p>The Flipkart tool configures dynamically inside the same dashboard. Ensure you have the developer panel active during initial mapping.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Support block banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-base md:text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>Need Help with Installation?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our support team is active and ready to assist you. If you face any issues setting up the script on your mobile, PC, or laptop, reach out to our team directly!
            </p>
          </div>
          
          <a 
            href="https://wa.me/917388334170?text=Hi%2C%20I%20have%20purchased%20the%20Listing%20Tool%20and%20need%20setup%20assistance.%20Order%20ID%3A%20"
            target="_blank"
            rel="noopener noreferrer"
            className="h-13 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm rounded-xl flex items-center gap-2.5 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)] shrink-0 uppercase tracking-wider"
          >
            <span>CONNECT ON WHATSAPP</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 text-center text-[10px] text-slate-500 font-mono">
        <p>© 2026 Direct Checkout Integrator. Protected under payment clearance logs.</p>
      </footer>

    </div>
  );
}
