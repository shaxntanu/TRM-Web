'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface CoinFlipProps {
  isFlipping: boolean;
  result: 'win' | 'loss' | null;
  onFlipComplete?: () => void;
}

export default function CoinFlip({ isFlipping, result, onFlipComplete }: CoinFlipProps) {
  const [showResult, setShowResult] = useState(false);
  const flipCountRef = useRef(0);

  useEffect(() => {
    if (isFlipping) {
      flipCountRef.current += 1;
      setShowResult(false);
      const timer = setTimeout(() => {
        setShowResult(true);
        onFlipComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFlipping, onFlipComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Coin */}
      <motion.div
        key={flipCountRef.current}
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full ${
          showResult && result === 'win' ? 'glow-green' : ''
        } ${showResult && result === 'loss' ? 'glow-red' : ''}`}
        animate={
          isFlipping
            ? {
                rotateY: [0, 1800],
                rotateX: [0, 180, 0],
              }
            : {}
        }
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Heads side (Win) */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {showResult && result === 'win' ? '✓' : '₹'}
        </div>

        {/* Tails side (Loss) */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {showResult && result === 'loss' ? '✗' : '💀'}
        </div>
      </motion.div>

      {/* Result flash */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-black ${
              result === 'win' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {result === 'win' ? 'WIN!' : 'LOSS!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state */}
      {!isFlipping && !showResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-slate-500 text-sm"
        >
          Click "Place Bet" to flip
        </motion.p>
      )}
    </div>
  );
}
