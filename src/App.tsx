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
  VolumeX
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

export default function App() {
  // Global CTA Variable
  const globalCtaUrl = CONFIG.ctaRedirectUrl;
  const whatsappNumber = CONFIG.whatsappNumber;

  // Hero Video Control States
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [heroMuted, setHeroMuted] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroCurrentTime, setHeroCurrentTime] = useState(0);
  const [heroDuration, setHeroDuration] = useState(0);

  // Compliance Modals State
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'support' | null>(null);

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
              1-Click <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 glow-text-purple">Meesho Auto Listing</span> Tool + Low Shipping Weight Trick
            </motion.h1>

            {/* FULL WIDTH CINEMATIC VIDEO PLAYER (16:9) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="relative w-full max-w-4xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_60px_rgba(147,51,234,0.3)] border-2 border-purple-500/20 bg-black aspect-video group"
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
            <div ref={heroButtonRef} className="pt-4">
              <motion.a 
                href={globalCtaUrl}
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-15 px-8 md:px-10 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm md:text-base items-center gap-4 border border-pink-400/20 cursor-pointer shadow-[0_0_35px_rgba(236,72,153,0.3)] uppercase tracking-wider font-display"
              >
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300 shrink-0" />
                <span>Buy Tool Now for ₹199 Only</span>
                <ArrowRight className="w-5 h-5 text-white/90" />
              </motion.a>
              
              <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-tight">
                *One-Time Payment. Lifetime Updates Free. Instant Email Direct Delivery.
              </p>
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
      <PricingCard />

      {/* 12. FOOTER */}
      <footer className="bg-[#020008] border-t border-purple-950/45 py-12 pb-28 md:pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Info */}
            <div className="space-y-3.5">
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

            {/* Column 2: Quick trust highlights */}
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#ec4899] font-mono mb-2">Legal Disclaimer</h4>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                This digital tool is designed for optimization and efficiency. We are an independent software helper and are NOT officially endorsed by, affiliated with, or partnered with Meesho Pvt. Ltd. Vendor results vary based on marketplace trends and catalogs content.
              </p>
            </div>

            {/* Column 3: Contact support details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono">Instant Support</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Need manual setting assistance or direct billing files? Send an email or message on WhatsApp.
              </p>
              
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-pink-400">
                  <MessageSquare className="w-4 h-4" />
                  <a href={`https://wa.me/91${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    WhatsApp: +91 {whatsappNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Layers className="w-4 h-4" />
                  <span>Support: {CONFIG.supportEmail}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="mt-8 pt-6 border-t border-purple-950/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-mono">
            <span>© 2026 Meesho AutoListing Automation Suites. All Rights Saved.</span>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setActiveModal('privacy')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-[10px] font-mono text-gray-400 font-medium"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('terms')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-[10px] font-mono text-gray-400 font-medium"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('support')}
                className="hover:text-pink-400 transition-colors cursor-pointer bg-transparent border-none text-[10px] font-mono text-gray-400 font-medium"
              >
                Contact Support Help
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
          <a
            href={globalCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 sm:h-11 md:h-13 px-3 sm:px-5 md:px-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 border border-pink-400/20 shadow-md cursor-pointer uppercase tracking-wider font-display shrink-0 transition-transform hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
            <span>Auto Get Access</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline shrink-0" />
          </a>

        </div>
      </div>

      {/* 14. FLOATING WHATSAPP CHAT BUTTON */}
      <a
        href={`https://wa.me/91${whatsappNumber}?text=Hi! I have some questions regarding the Meesho Auto Listing and Low Shipping pack.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 sm:right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3 sm:p-3.5 rounded-full shadow-[0_8px_24px_rgba(34,197,94,0.35)] duration-300 hover:scale-110 flex items-center justify-center cursor-pointer transition-all border border-emerald-400/25 pulse-glow ${
          !isHeroButtonVisible 
            ? "bottom-22 sm:bottom-24" 
            : "bottom-4 sm:bottom-6"
        }`}
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp with Support"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.86 1.45 5.516 0 10.005-4.485 10.008-10 .002-2.67-1.031-5.18-2.903-7.05C16.74 1.7 14.253.66 11.58.66c-5.519 0-10.01 4.49-10.014 10.011 0 1.8.47 3.54 1.36 5.09l-.99 3.6 3.7-.97zm11.53-6.685c-.322-.162-1.905-.94-2.201-1.047-.297-.107-.512-.16-.728.162-.215.322-.835 1.047-1.024 1.262-.189.215-.378.242-.7.08-.322-.162-1.359-.5-2.589-1.6-.957-.852-1.6-1.906-1.787-2.23-.189-.322-.02-.497.14-.658.145-.145.322-.378.484-.567.162-.189.215-.322.322-.538.107-.215.054-.403-.027-.565-.08-.162-.728-1.751-.998-2.4-.264-.634-.53-.55-.728-.56-.189-.01-.403-.012-.619-.012-.215 0-.565.081-.861.403-.297.322-1.13 1.103-1.13 2.69 0 1.587 1.157 3.12 1.319 3.335.162.215 2.277 3.478 5.517 4.88 1.11.48 1.95.77 2.62.98.813.257 1.55.22 2.13.13.65-.1 1.9-.78 2.17-1.49.27-.72.27-1.34.19-1.47-.08-.13-.297-.215-.62-.378z"/>
        </svg>
        {/* Glowing ripple wave effect rings */}
        <span className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping opacity-60" />
      </a>

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

    </div>
  );
}
