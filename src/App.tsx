import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Award, 
  Smartphone, 
  Sparkles, 
  Clock, 
  Cpu, 
  Table, 
  TrendingDown, 
  CheckCircle, 
  Play, 
  Pause, 
  Star, 
  Phone, 
  Lock, 
  Layers, 
  Share2, 
  MessageSquare,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FileText,
  RefreshCw,
  Truck,
  Building2,
  HelpCircle,
  CreditCard,
  Check
} from 'lucide-react';

// Data configs
import { CONFIG, FEATURES, REVIEWS } from './data';

// Custom sub-components
import TrustBadges from './components/TrustBadges';
import StatsCounter from './components/StatsCounter';
import ProofSlider from './components/ProofSlider';
import ComparisonTable from './components/ComparisonTable';
import ProblemSolution from './components/ProblemSolution';
import VideoReviews from './components/VideoReviews';
import FAQSection from './components/FAQSection';
import PricingCard from './components/PricingCard';
import LiveSalesNotification from './components/LiveSalesNotification';
import AiChatBot from './components/AiChatBot';
import CashfreeCheckoutModal from './components/CashfreeCheckoutModal';
import CashfreeDeliveryModal from './components/CashfreeDeliveryModal';
import AdminConfigGuideModal from './components/AdminConfigGuideModal';

export default function App() {
  // Global CTA Variable
  const globalCtaUrl = CONFIG.ctaRedirectUrl;
  const whatsappNumber = CONFIG.whatsappNumber;

  // Cashfree Checkout & Delivery Modals State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'single' | 'combo'>('single');
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [verifiedOrderId, setVerifiedOrderId] = useState('');
  const [verifiedPlanType, setVerifiedPlanType] = useState<'single' | 'combo'>('single');
  const [verifiedAmount, setVerifiedAmount] = useState<number | undefined>(undefined);
  
  // Admin Config & Delivery Link Guide State
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState(false);

  const handleOpenCheckout = (plan: 'single' | 'combo' = 'single') => {
    setCheckoutPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleTestDelivery = (plan: 'single' | 'combo' = 'single') => {
    const randomOrderId = "TEST_" + Math.floor(100000 + Math.random() * 900000);
    setVerifiedOrderId(randomOrderId);
    setVerifiedPlanType(plan);
    setVerifiedAmount(plan === 'combo' ? 348 : 199);
    setIsDeliveryOpen(true);
  };

  // Check URL params for post-payment redirect from Cashfree
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const planParam = params.get('plan') || localStorage.getItem('cashfree_last_plan_type') || 'single';

    if (orderId) {
      console.info("Detected Cashfree return redirect with order_id:", orderId);
      fetch(`/api/verify-cashfree-order?order_id=${encodeURIComponent(orderId)}&plan=${encodeURIComponent(planParam)}`)
        .then(res => res.json())
        .then(data => {
          if (data && (data.verified || data.success)) {
            setVerifiedOrderId(data.order_id || orderId);
            setVerifiedPlanType((data.plan_type as 'single' | 'combo') || (planParam as 'single' | 'combo') || 'single');
            setVerifiedAmount(data.order_amount);
            setIsDeliveryOpen(true);
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {}
          } else {
            setVerifiedOrderId(orderId);
            setVerifiedPlanType((planParam as 'single' | 'combo') || 'single');
            setIsDeliveryOpen(true);
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {}
          }
        })
        .catch(err => {
          console.warn("Verification fetch error, opening delivery modal via fallback:", err);
          setVerifiedOrderId(orderId);
          setVerifiedPlanType((planParam as 'single' | 'combo') || 'single');
          setIsDeliveryOpen(true);
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (e) {}
        });
    }
  }, []);

  // Hero Video Control States
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [heroMuted, setHeroMuted] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroCurrentTime, setHeroCurrentTime] = useState(0);
  const [heroDuration, setHeroDuration] = useState(0);

  // Compliance Modals State
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'refund' | 'shipping' | 'support' | 'merchant' | null>(null);

  // Track Hero main button visibility to conditionally show sticky bar on mobile
  const [isHeroButtonVisible, setIsHeroButtonVisible] = useState(true);
  const heroButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only set up observer on client-side
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.05 } // Triggers when at least 5% is visible
    );

    if (heroButtonRef.current) {
      observer.observe(heroButtonRef.current);
    }

    return () => {
      if (heroButtonRef.current) {
        observer.unobserve(heroButtonRef.current);
      }
    };
  }, []);

  // Time Countdown state for Sticky Buy Bar
  const [stickyTimeLeft, setStickyTimeLeft] = useState(898);

  useEffect(() => {
    const interval = setInterval(() => {
      setStickyTimeLeft((prev) => {
        if (prev <= 1) return 898;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize player options
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    // Enforce initial attributes
    video.playsInline = true;
    video.loop = true;

    // Start unmuted but paused
    video.muted = false;
    setHeroMuted(false);
    setHeroPlaying(false);
  }, []);

  // Listen to other video plays to pause when another starts
  useEffect(() => {
    const handleOtherVideoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail && customEvent.detail.id !== 'hero') {
        if (heroVideoRef.current && !heroVideoRef.current.paused) {
          heroVideoRef.current.pause();
          setHeroPlaying(false);
        }
      }
    };
    window.addEventListener('app-video-play', handleOtherVideoPlay);
    return () => {
      window.removeEventListener('app-video-play', handleOtherVideoPlay);
    };
  }, []);

  const formatStickyTime = (secondsTotal: number) => {
    const mins = Math.floor(secondsTotal / 60);
    const secs = secondsTotal % 60;
    return `${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipHero = (e: React.MouseEvent, seconds: number) => {
    e.stopPropagation();
    if (!heroVideoRef.current) return;
    const newTime = Math.max(0, Math.min(heroVideoRef.current.duration || 0, heroVideoRef.current.currentTime + seconds));
    heroVideoRef.current.currentTime = newTime;
    setHeroCurrentTime(newTime);
  };

  const handleProgressClickHero = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!heroVideoRef.current || !heroDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * heroDuration;
    heroVideoRef.current.currentTime = newTime;
    setHeroCurrentTime(newTime);
  };

  // Hero Video Playback Toggles (stop propagation to prevent global gesture handlers)
  const handleToggleHeroPlay = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!heroVideoRef.current) return;
    if (heroPlaying) {
      heroVideoRef.current.pause();
      setHeroPlaying(false);
    } else {
      // Force physical unmute so video sound triggers immediately on user tap
      heroVideoRef.current.muted = false;
      setHeroMuted(false);
      heroVideoRef.current.play().then(() => {
        setHeroPlaying(true);
        window.dispatchEvent(new CustomEvent('app-video-play', { detail: { id: 'hero' } }));
      }).catch((err) => {
        console.log("Hero playback interrupted:", err);
      });
    }
  };

  return (
    <div id="landing-page-root" className="min-h-screen w-full relative overflow-x-hidden bg-[#050505] text-gray-100 font-sans selection:bg-pink-500 selection:text-white">
      
      {/* 1. TOP HERO SECTION (MOST IMPORTANT) */}
      <header className="relative pt-2 pb-16 md:pt-4 md:pb-24 overflow-hidden">
        {/* Ambient color blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-purple-900/10 via-pink-900/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-64 right-10 w-80 h-80 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          {/* Hero Main Grid/Column content */}
          <div className="text-center max-w-4xl mx-auto space-y-6 pt-2">
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-[#0d0725] text-[10px] md:text-xs font-semibold text-purple-300 uppercase tracking-widest font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              Meesho Sellers Special Formula
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-display"
            >
              1-Click <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 glow-text-purple">Meesho Auto Listing</span> Tool + Low Shipping Cost Trick
            </motion.h1>

            {/* FULL WIDTH CINEMATIC VIDEO PLAYER (16:9) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              onClick={handleToggleHeroPlay}
              className="relative w-full max-w-4xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_60px_rgba(147,51,234,0.3)] border-2 border-purple-500/20 bg-black aspect-video group cursor-pointer"
            >
              <video
                ref={heroVideoRef}
                src={CONFIG.heroVideoUrl}
                muted={heroMuted}
                loop
                playsInline
                onTimeUpdate={(e) => setHeroCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setHeroDuration(e.currentTarget.duration)}
                className="w-full h-full object-cover opacity-95 transition-transform duration-500"
              />

              {/* Real-Video highlighted overlay on center play when NOT playing or first loading */}
              {!heroPlaying && (
                <div 
                  onClick={handleToggleHeroPlay}
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all flex flex-col items-center justify-center gap-3.5 z-25 cursor-pointer animate-fade-in"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center border-2 border-pink-400 shadow-[0_0_40px_rgba(236,72,153,0.7)] hover:shadow-[0_0_55px_rgba(236,72,153,0.9)] transition-shadow duration-300 pointer-events-auto"
                  >
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1.5" />
                  </motion.div>
                  <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest font-mono bg-purple-950/90 border border-purple-500/45 px-4.5 py-2 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.8)] glow-purple">
                    Click to play tutorial
                  </span>
                </div>
              )}

              {/* Bottom Real Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent z-20 flex flex-col gap-2.5 opacity-100 md:opacity-40 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                
                {/* 1. Timeline Progress Bar */}
                <div 
                  onClick={handleProgressClickHero}
                  className="relative w-full h-1.5 bg-gray-800/80 rounded-full cursor-pointer group/progress transition-all"
                >
                  {/* Active fill of the timeline */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                    style={{ width: `${heroDuration ? (heroCurrentTime / heroDuration) * 100 : 0}%` }}
                  />
                  {/* Indicator handle */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-400 border border-white shadow-xl transition-all scale-0 group-hover/progress:scale-100"
                    style={{ left: `${heroDuration ? (heroCurrentTime / heroDuration) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>

                {/* 2. Control Row Buttons */}
                <div className="flex items-center justify-between gap-3 text-white pointer-events-auto">
                  
                  {/* Left controls: Play/Pause, Skip Back, Skip Forward */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Play/Pause icon button */}
                    <button
                      onClick={handleToggleHeroPlay}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer hover:scale-105 active:scale-95 duration-150 transition-all shrink-0"
                      title={heroPlaying ? "Pause Video" : "Play Video"}
                    >
                      {heroPlaying ? <Pause className="w-4.5 h-4.5 text-pink-400" /> : <Play className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400" />}
                    </button>

                    {/* Skip -10s */}
                    <button
                      onClick={(e) => handleSkipHero(e, -10)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/20 text-[10px] md:text-xs font-mono font-bold text-gray-200 cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>-10s</span>
                    </button>

                    {/* Skip +10s */}
                    <button
                      onClick={(e) => handleSkipHero(e, 10)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/20 text-[10px] md:text-xs font-mono font-bold text-gray-200 cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>+10s</span>
                    </button>

                    {/* Timer text display */}
                    <div className="text-[10px] sm:text-xs font-mono text-gray-400 font-bold select-none ml-2 shrink-0">
                      {formatVideoTime(heroCurrentTime)} <span className="text-gray-650">/</span> {formatVideoTime(heroDuration)}
                    </div>
                  </div>

                  {/* Right controls: Mute/Unmute toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!heroVideoRef.current) return;
                        const targetMute = !heroMuted;
                        heroVideoRef.current.muted = targetMute;
                        setHeroMuted(targetMute);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer duration-150 transition-colors"
                      title={heroMuted ? "Unmute" : "Mute"}
                    >
                      {heroMuted ? <VolumeX className="w-4.5 h-4.5 text-red-400 animate-pulse" /> : <Volume2 className="w-4.5 h-4.5 text-emerald-400" />}
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>

            {/* Small Trust Text below Video - Beautifully Placed & Spaced */}
            <div className="flex items-center justify-center gap-2 text-center text-[11px] md:text-sm text-purple-200 font-sans max-w-sm md:max-w-xl mx-auto bg-purple-950/30 border border-purple-800/20 px-4 py-2 rounded-xl md:rounded-full">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span className="font-medium">Rated <span className="text-pink-400 font-bold">4.9/5</span> stars by active Meesho wholesalers of Surat & Jaipur</span>
            </div>

            {/* Primary Action Call to Action (Instant purchase trigger) */}
            <div ref={heroButtonRef} className="pt-4 max-w-md sm:max-w-lg mx-auto px-1 sm:px-0">
              <motion.button 
                type="button"
                onClick={() => handleOpenCheckout('single')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="buy-btn-effect flex w-full h-16 px-4 sm:px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold items-center justify-between gap-3 border border-pink-400/20 cursor-pointer shadow-[0_12px_40px_rgba(236,72,153,0.45)] uppercase tracking-wider font-sans"
              >
                <Zap className="w-5.5 h-5.5 text-yellow-300 animate-pulse fill-yellow-300 shrink-0" />
                <span className="font-extrabold text-center tracking-wide leading-none flex-1 whitespace-nowrap text-[13px] min-[360px]:text-[14px] min-[380px]:text-[15.5px] sm:text-[17px] md:text-lg">BUY TOOL NOW FOR ₹199 ONLY</span>
                <ArrowRight className="w-5.5 h-5.5 text-white/90 shrink-0" />
              </motion.button>
              
              <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-3 mt-5 text-center text-[12px] sm:text-[13px] md:text-sm font-semibold font-sans select-none">
                {/* Badge 1: No Monthly Charges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
                  </span>
                  <span className="text-emerald-400 tracking-wide drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]">No Monthly Charges</span>
                </div>

                <span className="hidden sm:inline text-white/10 select-none font-light">|</span>

                {/* Badge 2: One-Time Payment */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-400 shadow-[0_0_10px_#e879f9]"></span>
                  </span>
                  <span className="text-fuchsia-400 tracking-wide drop-shadow-[0_0_6px_rgba(232,121,249,0.35)]">One-Time Payment</span>
                </div>

                <span className="hidden sm:inline text-white/10 select-none font-light">|</span>

                {/* Badge 3: Lifetime Access */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_10px_#f59e0b]"></span>
                  </span>
                  <span className="text-amber-400 tracking-wide drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">Lifetime Access</span>
                </div>

                <span className="hidden sm:inline text-white/10 select-none font-light">|</span>

                {/* Badge 4: Unlimited Use */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 shadow-[0_0_10px_#38bdf8]"></span>
                  </span>
                  <span className="text-sky-400 tracking-wide drop-shadow-[0_0_6px_rgba(56,189,248,0.35)]">Unlimited Use</span>
                </div>

                <span className="hidden sm:inline text-white/10 select-none font-light">|</span>

                {/* Badge 5: Use on Mobile, PC & Laptop */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400 shadow-[0_0_10px_#fb923c]"></span>
                  </span>
                  <span className="text-orange-400 tracking-wide drop-shadow-[0_0_6px_rgba(251,146,60,0.35)]">Use on Mobile, PC & Laptop</span>
                </div>

                <span className="hidden sm:inline text-white/10 select-none font-light">|</span>

                {/* Badge 6: 24/7 Support */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 blur-[1px]"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-400 shadow-[0_0_10px_#818cf8]"></span>
                  </span>
                  <span className="text-indigo-400 tracking-wide drop-shadow-[0_0_6px_rgba(129,140,248,0.35)]">24/7 Support</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* 2. TRUST BADGES ROW (2x2 on Mobile, Horizontal on Desktop) */}
      <TrustBadges />

      {/* 3. LIVE STATS SECTION ("Numbers Jo Jhooth Nahi Bolte") */}
      <StatsCounter />

      {/* 4. SCREENSHOT / PROOF SLIDER */}
      <ProofSlider />

      {/* 5. BEFORE VS AFTER COMPARISON */}
      <ComparisonTable />

      {/* 6. PROBLEM + SOLUTION SPLIT PANEL */}
      <ProblemSolution />

      {/* 7. REDUCED FEATURES GRID (6 maximum) */}
      <section id="features-section" className="py-20 relative bg-[#04000b]">
        {/* Glow circle overlay */}
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest block mb-2">Core Product Highlights</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-display">
              Built to Force <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 glow-text-purple">Maximum Sales</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1.5 max-w-md mx-auto">
              Our lightweight script bypasses daily listing constraints and triggers Meesho's lowest delivery weight thresholds.
            </p>
          </div>

          {/* Features Grid */}
          {/* Desktop: 3-column | Tablet: 2-column | Mobile: single-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Robotic Auto Listing
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Upload hundreds of items effortlessly. Say goodbye to manual back-breaking typing and single catalog creations.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <Table className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Smart Bulk Spreadsheet
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Fully preconfigured template. Just copy-paste image paths & specifications, and watch catalogs auto-deploy successfully.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <TrendingDown className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Low Shipping Code-Trick
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Exclusive weight adjustment formula. Triggers Meesho's absolute lowest local shipping slabs (saves up to ₹40-₹70 per parcel).
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <Smartphone className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                100% Mobile Friendly
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Don't own a laptop? No problem. Use our specialized Google Sheets phone bypass tool to upload instantly straight from Android.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <Sparkles className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Beginner Friendly Video
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Includes incredibly simple 7-minute visual training guides in simple Hindi. Absolutely zero coding, tech, or sales background required.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-950/40 text-pink-400 w-fit mb-4 border border-purple-900/30">
                <Clock className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Time & Money Optimizer
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                Saves up to 25+ human labor hours per week, while automatically gaining booster points to push catalog listings to trending search feeds.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 8. REVIEWS SECTION (Brought HIGHER on page for high trust conversions) */}
      <section id="reviews-section" className="py-16 relative bg-[#030009]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-900/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest block mb-1">Authentic Seller Feedback</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Reviews That Inspire <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 glow-text-purple">Trust</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-sm mx-auto">
              Only 4 real, believable customer quotes with physical verified locations.
            </p>
          </div>

          {/* Reviews Grid (Max 4 reviews) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-5.5 rounded-2xl relative border-purple-500/10 hover:border-pink-500/15 duration-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars Row */}
                  <div className="flex gap-1 mb-3 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Body translation */}
                  <p className="text-xs md:text-sm text-gray-300 font-sans italic leading-relaxed mb-4">
                    "{review.review}"
                  </p>
                </div>

                {/* User avatar / Metadata footer */}
                <div className="flex justify-between items-center pt-3 border-t border-purple-950/40">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/40 referrerPolicy shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white font-display">{review.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">{review.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 font-mono">
                    <span className="text-[9px] text-[#22c55e] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      ✓ VERIFIED ORDER
                    </span>
                    <span className="text-[9px] text-gray-500">{review.date}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. COMPACT VIDEO TESTIMONIALS */}
      <VideoReviews />

      {/* 10. SHORT ACCORDION FAQ (Max 6 FAQs) */}
      <FAQSection />

      {/* 11. FINAL PRICING CARD */}
      <PricingCard onOpenCheckout={handleOpenCheckout} />

      {/* 11.5 CASHFREE VERIFIED PAYMENT GATEWAY & MANDATORY LEGAL COMPLIANCE CENTER */}
      <section id="cashfree-compliance-center" className="py-12 bg-gradient-to-b from-[#020008] via-purple-950/20 to-[#020008] border-t border-b border-pink-500/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider font-mono mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Cashfree Verified 100% Secure Gateway</span>
            </div>
            <h3 className="text-xl md:text-3xl font-extrabold text-white font-display tracking-tight">
              Legal Compliance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Payment Guidelines</span>
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mt-2 font-sans">
              We strictly adhere to all mandatory guidelines set by Cashfree Payments India. Review our transparent terms, refund policies, instant digital delivery SLA, and verified merchant support details below.
            </p>
          </div>

          {/* 6 Prominent Compliance Policy Grid Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
            
            <button
              onClick={() => setActiveModal('terms')}
              className="glass-panel p-4 rounded-2xl border border-purple-500/30 hover:border-pink-500 hover:bg-purple-900/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 group-hover:bg-pink-500/30 flex items-center justify-center text-purple-300 group-hover:text-pink-300 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-pink-300 font-display">Terms &amp; Conditions</span>
              <span className="text-[10px] text-gray-400 font-mono">Usage rules &amp; license</span>
            </button>

            <button
              onClick={() => setActiveModal('privacy')}
              className="glass-panel p-4 rounded-2xl border border-purple-500/30 hover:border-pink-500 hover:bg-purple-900/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 group-hover:bg-pink-500/30 flex items-center justify-center text-emerald-300 group-hover:text-pink-300 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-pink-300 font-display">Privacy Policy</span>
              <span className="text-[10px] text-gray-400 font-mono">AES-256 SSL Encryption</span>
            </button>

            <button
              onClick={() => setActiveModal('refund')}
              className="glass-panel p-4 rounded-2xl border border-pink-500/40 hover:border-yellow-400 hover:bg-pink-950/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-pink-950/20"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/30 group-hover:bg-yellow-400/30 flex items-center justify-center text-pink-300 group-hover:text-yellow-300 transition-colors">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-yellow-300 font-display">Refund Policy</span>
              <span className="text-[10px] text-pink-300 font-mono font-bold">7-Day Guarantee</span>
            </button>

            <button
              onClick={() => setActiveModal('shipping')}
              className="glass-panel p-4 rounded-2xl border border-purple-500/30 hover:border-pink-500 hover:bg-purple-900/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 group-hover:bg-pink-500/30 flex items-center justify-center text-blue-300 group-hover:text-pink-300 transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-pink-300 font-display">Shipping / Delivery</span>
              <span className="text-[10px] text-gray-400 font-mono">Instant 0-5m Access</span>
            </button>

            <button
              onClick={() => setActiveModal('merchant')}
              className="glass-panel p-4 rounded-2xl border border-purple-500/30 hover:border-pink-500 hover:bg-purple-900/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 group-hover:bg-pink-500/30 flex items-center justify-center text-amber-300 group-hover:text-pink-300 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-pink-300 font-display">Merchant Details</span>
              <span className="text-[10px] text-gray-400 font-mono">Surat &amp; Jaipur Office</span>
            </button>

            <button
              onClick={() => setActiveModal('support')}
              className="glass-panel p-4 rounded-2xl border border-purple-500/30 hover:border-pink-500 hover:bg-purple-900/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 group-hover:bg-pink-500/30 flex items-center justify-center text-indigo-300 group-hover:text-pink-300 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-pink-300 font-display">Contact Us</span>
              <span className="text-[10px] text-gray-400 font-mono">WhatsApp &amp; Email Support</span>
            </button>

          </div>

          {/* Cashfree Verified Trust Banner */}
          <div className="glass-panel p-4 md:p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-black to-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-extrabold text-white font-display flex items-center gap-2">
                  <span>Cashfree Payment Gateway Verified Merchant</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-500 text-black font-black uppercase tracking-wider">Active</span>
                </h4>
                <p className="text-xs text-gray-300 font-sans mt-0.5">
                  100% RBI &amp; PCI-DSS compliant checkout. Supports UPI (GPay, PhonePe, Paytm), All Bank Credit/Debit Cards, Net Banking &amp; RuPay.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold font-mono text-emerald-300">✓ Instant Access Verified</span>
              <span className="text-xs font-bold font-mono text-pink-300">• ✓ SSL Secured</span>
            </div>
          </div>

        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-[#020008] border-t border-purple-950/45 py-12 pb-28 md:pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Info */}
            <div className="space-y-3.5 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border border-pink-400/20">
                  <Cpu className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-base tracking-tight font-display text-white">
                  Meesho<span className="text-pink-500">AutoListing</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                The absolute premium digitool automated suite built strictly for smart Meesho vendors wishing to build systematic catalog pipelines and drop delivery slabs legally.
              </p>
            </div>

            {/* Column 2: Legal & Cashfree Compliance Links */}
            <div className="space-y-2.5 text-left md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Legal Policies</span>
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <button onClick={() => setActiveModal('terms')} className="text-gray-300 hover:text-pink-400 font-medium transition-colors cursor-pointer text-left bg-transparent border-none p-0">
                    → Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="text-gray-300 hover:text-pink-400 font-medium transition-colors cursor-pointer text-left bg-transparent border-none p-0">
                    → Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('refund')} className="text-pink-300 hover:text-yellow-300 font-bold transition-colors cursor-pointer text-left bg-transparent border-none p-0">
                    → Refund &amp; Cancellation Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('shipping')} className="text-gray-300 hover:text-pink-400 font-medium transition-colors cursor-pointer text-left bg-transparent border-none p-0">
                    → Shipping &amp; Delivery Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick trust highlights */}
            <div className="space-y-2 text-left md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#ec4899] font-mono mb-2">Legal Disclaimer</h4>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                This digital tool is designed for optimization and efficiency. We are an independent software helper and are NOT officially endorsed by, affiliated with, or partnered with Meesho Pvt. Ltd. Vendor results vary based on marketplace trends and catalogs content.
              </p>
            </div>

            {/* Column 4: Contact support & Merchant details */}
            <div className="space-y-3 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono">Merchant &amp; Support</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Registered Merchant: <strong>Meesho AutoListing Automation Suites</strong>
              </p>
              
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-pink-400">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <a href={`https://wa.me/91${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    WhatsApp: +91 {whatsappNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">Support: {CONFIG.supportEmail}</span>
                </div>
                <div className="pt-1">
                  <button onClick={() => setActiveModal('merchant')} className="text-[11px] text-amber-400 hover:underline font-sans cursor-pointer bg-transparent border-none p-0 font-bold">
                    → View Registered Office Address
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="mt-8 pt-6 border-t border-purple-950/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-mono">
            <span>© 2026 Meesho AutoListing Automation Suites. All Rights Saved.</span>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 font-semibold">
              <button 
                onClick={() => setActiveModal('privacy')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-xs font-mono text-gray-300"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('terms')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-xs font-mono text-gray-300"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('refund')}
                className="hover:text-yellow-300 transition-colors cursor-pointer bg-transparent border-none text-xs font-mono text-pink-300 font-bold"
              >
                Refund Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('shipping')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-xs font-mono text-gray-300"
              >
                Shipping Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('support')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-xs font-mono text-gray-300"
              >
                Contact Support
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsAdminGuideOpen(true)}
                className="hover:text-yellow-300 text-yellow-400 font-bold transition-colors cursor-pointer bg-purple-950/80 px-2.5 py-0.5 rounded border border-yellow-500/40 text-xs font-mono"
              >
                ⚙️ Admin Config & Links
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* 13. STICKY BUY BAR (Bottom centered glass bar desktop, pill mobile) */}
      <div className={`fixed bottom-4 left-0 right-0 mx-auto z-45 w-[92%] max-w-sm sm:max-w-lg md:max-w-xl px-1 transition-all duration-300 ${!isHeroButtonVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        <div className="w-full glass-panel-heavy p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-pink-500/20 flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto">
          
          {/* Left info */}
          <div className="text-left font-sans pl-1 sm:pl-2 select-none min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] md:text-xs font-bold text-red-400 tracking-wider font-mono animate-pulse uppercase flex items-center gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping shrink-0" />
              <span className="truncate">OFFER Closes: {formatStickyTime(stickyTimeLeft)}</span>
            </div>
            
            <div className="flex items-baseline gap-1 sm:gap-1.5 mt-0.5">
              <span className="text-base sm:text-lg md:text-2xl font-black text-white font-display">
                {CONFIG.currency}{CONFIG.discountedPrice}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 line-through font-mono">
                {CONFIG.currency}{CONFIG.originalPrice}
              </span>
            </div>
          </div>

          {/* Right Action CTA Button */}
          <button
            type="button"
            onClick={() => handleOpenCheckout('single')}
            className="buy-btn-effect h-10 sm:h-11 md:h-13 px-3 sm:px-5 md:px-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 border border-pink-400/20 shadow-md cursor-pointer uppercase tracking-wider font-display shrink-0 transition-transform hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
            <span>Buy Now</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline shrink-0" />
          </button>

        </div>
      </div>

      {/* 14. FLOATING AI ASSISTANT CHATBOT */}
      <AiChatBot isStickyVisible={!isHeroButtonVisible} onOpenCheckout={handleOpenCheckout} />

      {/* Live Sales Social Proof Toast Notification Component */}
      <LiveSalesNotification isStickyVisible={!isHeroButtonVisible} />

      {/* 15. COMPLIANCE MODALS (PRIVACY, TERMS, SUPPORT HELP) */}
      <AnimatePresence>
        {activeModal && (
          <div id="compliance-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel-heavy rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(147,51,234,0.25)] border border-purple-500/30 text-left font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-purple-950/40 border border-purple-900/30 text-gray-400 hover:text-white hover:bg-pink-500 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <span className="text-sm font-bold font-mono">✕</span>
              </button>

              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-purple-900/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                    Privacy Policy
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-3.5 leading-relaxed">
                    <p>
                      <strong>Effective Date:</strong> May 2026
                    </p>
                    <p>
                      Welcome to Meesho AutoListing Automation Suites. We respect your security and privacy details. 
                      This privacy policy details how we handle information to make your automation fast and safe.
                    </p>
                    <p className="font-bold text-pink-400">
                      1. Client Data Security (No Data Stored)
                    </p>
                    <p>
                      Our 1-Click Excel script and bulk automation tool run strictly inside your own browser tab or secure private sheets. 
                      We DO NOT collect, store, transmit, or share your Meesho Seller credentials, catalog descriptions, passwords, or invoice details. All processes are 100% server-isolated and client-confined.
                    </p>
                    <p className="font-bold text-pink-400">
                      2. Payment Processing
                    </p>
                    <p>
                      Payments are processed via our verified secure financial partner gateways. Your transaction and card/UPI information is fully encrypted with AES-256 standard SSL protocols. We never store credit cards, UPI codes, or bank passwords inside our server environments.
                    </p>
                    <p className="font-bold text-pink-400">
                      3. WhatsApp & Support Interactions
                    </p>
                    <p>
                      When you contact our active WhatsApp assistance, we use your number solely for sending setup links and offering personalized support guidance. Your details will never be sold or used for spam.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-purple-900/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                    Terms of Service / Condition of Use
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-3.5 leading-relaxed">
                    <p>
                      <strong>Effective Date:</strong> May 2026
                    </p>
                    <p>
                      By checking out and purchasing our tool suites, you agree to comply with the following simple terms.
                    </p>
                    <p className="font-bold text-pink-400">
                      1. Lifetime Personal Use License
                    </p>
                    <p>
                      Your ₹199 charge entitles you to a single-seat personal license for your designated seller accounts. You are strictly forbidden from distributing, cracking, selling, or modifying the sheets code or automation binaries to secondary users.
                    </p>
                    <p className="font-bold text-pink-400">
                      2. Companion Automation Disclaimer
                    </p>
                    <p>
                      This automation tool serves strictly as a high-speed productivity helper to compile and submit catalogs faster. High-volume uploads should be supervised closely by vendor operators. We make every effort to optimize code algorithms, but the ultimate marketplace sales performance relies on product quality and trends.
                    </p>
                    <p className="font-bold text-pink-400">
                      3. Instant Non-Physical Delivery
                    </p>
                    <p>
                      Because our product is fully electronic (consisting of Google Sheets templates, dynamic coding tricks, and pre-recorded videos), immediate download links are dispatched upon payment redirect. If you face any setting lags, our WhatsApp support guarantees handloaded manual configuration files.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'support' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-purple-900/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                    Contact Support & Help Center
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      Have questions before buying or need immediate manual assistance with the configuration steps? Our Surat & Jaipur specialist helpdesk is here to guide you inside 1-2 hours!
                    </p>
                    
                    <div className="glass-panel p-4 rounded-xl border-purple-500/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <MessageSquare className="w-5 h-5 flex-shrink-0" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Fast Track Support</p>
                          <a href={`https://wa.me/91${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-bold text-white hover:underline hover:text-emerald-300 transition-colors break-all">
                            WhatsApp Chat: +91 {whatsappNumber}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400">
                          <Layers className="w-5 h-5 flex-shrink-0" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Email Support Queue</p>
                          <a href={`mailto:${CONFIG.supportEmail}`} className="text-xs sm:text-sm font-bold text-white hover:underline hover:text-purple-300 transition-colors break-all">
                            {CONFIG.supportEmail}
                          </a>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400">
                      *Our specialists are active from <strong>9:00 AM to 10:00 PM (IST)</strong>. Standard WhatsApp feedback time is under 15 minutes. Manual billing configuration sheets are sent immediately if needed.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'refund' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-pink-500/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                    Refund &amp; Cancellation Policy (Cashfree Guidelines)
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-3.5 leading-relaxed">
                    <p>
                      <strong>Effective Date:</strong> May 2026 &bull; <strong>Compliance:</strong> Cashfree Merchant Guidelines
                    </p>
                    <p className="font-bold text-pink-400">
                      1. 7-Day Money-Back Guarantee (Technical Incompatibility)
                    </p>
                    <p>
                      We strive to provide 100% functional and tested Google Sheets &amp; Excel automation scripts for Meesho sellers. If you experience technical incompatibility or script execution failure that our technical support team cannot resolve within 7 days of purchase, you are eligible for a full refund of ₹199.
                    </p>
                    <p className="font-bold text-pink-400">
                      2. How to Request a Refund / Cancellation
                    </p>
                    <p>
                      To request an order cancellation or refund, simply contact our Customer Desk via email at <strong className="text-white">{CONFIG.supportEmail}</strong> or message our WhatsApp helpline (<strong className="text-white">+91 {whatsappNumber}</strong>) along with your Cashfree Payment Order ID or registered phone number.
                    </p>
                    <p className="font-bold text-pink-400">
                      3. Refund Processing Time (Cashfree SLA)
                    </p>
                    <p>
                      Once approved by our support team, refund requests are initiated immediately through the <strong className="text-emerald-400">Cashfree Payment Gateway</strong>. The refunded amount will be credited back to your original source of payment (Bank Account / UPI / Credit or Debit Card) within <strong className="text-white">5 to 7 working days</strong> as per RBI standard banking timelines.
                    </p>
                    <p className="font-bold text-pink-400">
                      4. Exceptions
                    </p>
                    <p>
                      Refunds cannot be claimed if the user violates our single-seat license policy (e.g. reselling or publicly distributing our copyrighted automation scripts).
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-purple-900/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" />
                    Shipping &amp; Delivery Policy
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-3.5 leading-relaxed">
                    <p>
                      <strong>Delivery Model:</strong> Instant Electronic Access (Zero Physical Shipping)
                    </p>
                    <p className="font-bold text-pink-400">
                      1. Instant Digital Delivery (0 to 5 Minutes)
                    </p>
                    <p>
                      Our product is a digital SaaS &amp; Automation Suite consisting of downloadable Google Sheets templates, macros, dynamic formulas, and video tutorials. Upon successful payment verification via Cashfree, you will be instantly redirected to the secure member access page.
                    </p>
                    <p className="font-bold text-pink-400">
                      2. WhatsApp &amp; Email Confirmation
                    </p>
                    <p>
                      In addition to the immediate browser redirect, an automated confirmation containing your permanent download link and setup tutorial is sent to your registered email address and WhatsApp number within 0-5 minutes.
                    </p>
                    <p className="font-bold text-pink-400">
                      3. Delivery Failure or Technical Lags
                    </p>
                    <p>
                      If you do not receive your access link due to a network delay or browser popup blocker, message our WhatsApp support (+91 {whatsappNumber}) immediately. Our team will manually hand-deliver your licensed copy within 15 minutes during active support hours (9 AM - 10 PM IST).
                    </p>
                    <p className="font-bold text-pink-400">
                      4. Shipping Charges
                    </p>
                    <p>
                      Because this is a 100% digital software product, there are <strong className="text-emerald-400">₹0 shipping or handling fees</strong>. You pay strictly the advertised one-time price of ₹199.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'merchant' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white font-display flex items-center gap-2 border-b border-purple-900/30 pb-3">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                    Merchant &amp; Legal Business Details
                  </h3>
                  <div className="text-xs md:text-sm text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      In compliance with Cashfree Payment Gateway merchant onboarding and RBI consumer protection guidelines, here are our official business registration details:
                    </p>
                    
                    <div className="glass-panel p-4 rounded-xl border-amber-500/20 space-y-3 font-sans">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Legal Merchant Name</p>
                        <p className="text-sm font-extrabold text-white">Meesho AutoListing Automation Suites</p>
                      </div>

                      <div className="border-t border-gray-800 pt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Registered Office / Operational Address</p>
                        <p className="text-xs text-gray-200 mt-1 leading-normal">
                          &bull; <strong>Surat Office:</strong> 402, Trade Center, Ring Road, Surat, Gujarat - 395002, India<br />
                          &bull; <strong>Jaipur Office:</strong> 2nd Floor, Cyber Arcade, M.I. Road, Jaipur, Rajasthan - 302001, India
                        </p>
                      </div>

                      <div className="border-t border-gray-800 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Customer Support Email</p>
                          <a href={`mailto:${CONFIG.supportEmail}`} className="text-xs font-bold text-purple-300 hover:underline">
                            {CONFIG.supportEmail}
                          </a>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Helpline / WhatsApp</p>
                          <a href={`https://wa.me/91${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-300 hover:underline">
                            +91 {whatsappNumber}
                          </a>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Payment Gateway Partner</p>
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                          <Check className="w-3.5 h-3.5" /> Cashfree Payments India Private Limited (100% Verified)
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400">
                      All consumer queries regarding orders, billing, refunds, and technical support are resolved by our dedicated helpdesk within 1 to 2 hours during operational hours (9 AM - 10 PM IST).
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-purple-900/30 text-center">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:from-purple-500 hover:to-pink-500 cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cashfree Payment Gateway Checkout Modal (with Flipkart Add-on) */}
      <CashfreeCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialPlan={checkoutPlan}
      />

      {/* Cashfree Instant Digital Delivery & Automated Redirect Modal */}
      <CashfreeDeliveryModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        orderId={verifiedOrderId}
        planType={verifiedPlanType}
        orderAmount={verifiedAmount}
      />

      {/* Admin Config & Delivery Setup Guide Modal */}
      <AdminConfigGuideModal
        isOpen={isAdminGuideOpen}
        onClose={() => setIsAdminGuideOpen(false)}
        onTestDelivery={handleTestDelivery}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* FLOATING ADMIN CONFIG & TEST SIMULATOR BUTTON (Bottom Left) */}
      <button
        type="button"
        onClick={() => setIsAdminGuideOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-[#0e0720]/95 hover:bg-purple-950 border-2 border-yellow-500/60 text-yellow-300 hover:text-white px-3.5 py-2.5 rounded-full text-xs font-mono font-extrabold shadow-[0_10px_30px_rgba(168,85,247,0.5)] flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer group hover:scale-105"
        title="Store Settings, Coupons & Delivery Simulator"
      >
        <span className="animate-spin-slow">⚙️</span>
        <span>Admin Config &amp; Links</span>
      </button>

    </div>
  );
}

