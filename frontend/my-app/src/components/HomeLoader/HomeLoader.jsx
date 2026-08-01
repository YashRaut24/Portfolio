import { useEffect, useState } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "../../utils/motionPrefs";
import "./HomeLoader.css";

const MESSAGES = [
  "Opening notebook...",
  "Turning pages...",
  "Preparing workspace...",
  "Almost ready..."
];

export default function HomeLoader({ onComplete }) {
  const [scope, animate] = useAnimate();
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle through the loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const runAnimation = async () => {
      // 1. Accessibility bypass
      if (prefersReducedMotion()) {
        await animate(".loader-signature", { clipPath: "inset(0% 0% 0% 0%)" }, { duration: 0.5 });
        await new Promise(r => setTimeout(r, 400));
        onComplete();
        return;
      }

      // 2. Cinematic Timeline (Target: ~1.8 seconds max)
      // Soft heavy ease for premium feel: [0.25, 1, 0.5, 1]
      const premiumEase = [0.25, 1, 0.5, 1];

      // A. Notebook fades in slightly (handled by initial={{opacity:0}} on container)
      // B. Elastic band snaps/slides away to the right
      animate(".loader-elastic", { x: 40, opacity: 0 }, { delay: 0.15, duration: 0.4, ease: "easeInOut" });

      // C. Cover slowly opens (rotates horizontally open, revealing pages)
      animate(".loader-cover", { rotateY: -160, opacity: 0 }, { delay: 0.4, duration: 0.8, ease: premiumEase });

      // D. A few pages flip naturally behind it
      animate(".loader-page-2", { rotateY: -150, opacity: 0 }, { delay: 0.55, duration: 0.7, ease: premiumEase });
      animate(".loader-page-1", { rotateY: -140, opacity: 0 }, { delay: 0.7, duration: 0.7, ease: premiumEase });

      // E. Signature write-on animation (using clip-path reveal to trace the Kalam font)
      await animate(".loader-signature", { clipPath: "inset(0% 0% 0% 0%)" }, { delay: 0.85, duration: 0.6, ease: "easeOut" });

      // F. Settle pause before allowing the crossfade
      await new Promise(r => setTimeout(r, 200));
      onComplete();
    };

    runAnimation();
  }, [animate, onComplete]);

  // Generate a few stable dust particles
  const particles = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 80 + 10}%`,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));

  return (
    <motion.div
      className="home-loader-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      {/* Background Dust */}
      {particles.map(p => (
        <div 
          key={p.id} 
          className="loader-particle" 
          style={{
            left: p.left, top: p.top, 
            width: `${p.size}px`, height: `${p.size}px`,
            animationDelay: `${p.delay}s`
          }} 
        />
      ))}

      {/* Notebook Container */}
      <div className="loader-book-container" ref={scope}>
        
        {/* Base layer (Back cover / right page) */}
        <div className="loader-base">
          <span className="loader-signature">Yash Raut</span>
        </div>
        
        <div className="loader-ribbon" />
        <div className="loader-page loader-page-1" />
        <div className="loader-page loader-page-2" />
        
        {/* Top Leather Cover */}
        <div className="loader-cover" />
        
        {/* Elastic Strap */}
        <div className="loader-elastic" />

      </div>

      {/* Rotating Status Text */}
      <div className="loader-status-text">
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
          >
            {MESSAGES[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}