import React, { useState, useRef, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { VIDEO_REVIEWS } from '../data';
import { Play, VolumeX, Volume2, Pause } from 'lucide-react';

export default function VideoReviews() {
  return (
    <section id="video-reviews-section" className="py-16 bg-[#04000c] relative">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest block mb-1">
            Real Sellers, Real Stories
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-450 glow-text-purple">Testimonials</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-sm mx-auto">
            Watch short video reviews from Indian sellers who upgraded their Meesho listings speed.
          </p>
        </div>

        {/* Video Cards Grid */}
        {/* Desktop: 2-column | Mobile: single-column. Compact. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {VIDEO_REVIEWS.map((vReview) => (
            <VideoCard key={vReview.id} review={vReview} />
          ))}
        </div>

      </div>
    </section>
  );
}

interface VideoCardProps {
  key?: string;
  review: {
    id: string;
    name: string;
    role: string;
    thumbnail: string;
    videoUrl: string;
  };
}

function VideoCard({ review }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Video play interrupted:", err);
      });
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation(); // prevent triggering play/pause
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel p-4 rounded-2xl border-purple-500/10 hover:border-pink-500/10 shadow-lg relative overflow-hidden group flex flex-col justify-between"
    >
      
      {/* Video Container Aspect 16:9 */}
      <div 
        onClick={togglePlay}
        className="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer shadow-inner border border-purple-950/20"
      >
        <video
          ref={videoRef}
          src={review.videoUrl}
          poster={review.thumbnail}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />

        {/* Dark Cinematic overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
            {/* Play Button Icon pulsing */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg glow-purple"
            >
              <Play className="w-5 h-5 fill-white shrink-0" />
            </motion.div>
          </div>
        )}

        {/* Media Controls inside player panel */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-purple-500/20 text-white hover:text-pink-400 transition-colors pointer-events-auto cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 text-pink-500" />}
          </button>
          
          {/* Mini Play toggle */}
          {isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-purple-500/20 text-white hover:text-pink-400 transition-colors pointer-events-auto cursor-pointer"
            >
              <Pause className="w-4.5 h-4.5 text-pink-500" />
            </button>
          )}
        </div>

        {/* Subtle glow border around top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-400/30 to-transparent opacity-80" />
      </div>

      {/* Info label on bottom */}
      <div className="mt-3.5 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white font-display">{review.name}</h4>
          <p className="text-[10px] text-pink-400 font-mono mt-0.5">{review.role}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
            VERIFIED REVIEW
          </span>
        </div>
      </div>

    </motion.div>
  );
}
