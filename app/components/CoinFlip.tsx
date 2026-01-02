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
  const [animationKey, setAnimationKey] = useState(0);
  const [displayedResult, setDisplayedResult] = useState<'win' | 'loss' | null>(null);
  const prevFlipping = useRef(false);

  // Detect when isFlipping changes from false to true
  useEffect(() => {
    if (isFlipping && !prevFlipping.current) {
      // New flip started
      setAnimationKey((k) => k + 1);
      setShowResult(false);
      setDisplayedResult(null);

      prevFlipping.current = true;
    } else if (!isFlipping) {
      prevFlipping.current = false;
    }
  }, [isFlipping]);

  // When result changes and we're done flipping, show it
  useEffect(() => {
    if (result && !isFlipping) {
      setDisplayedResult(result);
      setShowResult(true);
      onFlipComplete?.();
    }
  }, [result, isFlipping, onFlipComplete]);

  // Determine final rotation based on result (win = heads/green, loss = tails/red)
  // 1800 = 5 full rotations (lands on green/heads)
  // 1980 = 5.5 rotations (lands on red/tails)
  const finalRotation = displayedResult === 'loss' ? 1980 : 1800;

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Coin */}
      <motion.div
        key={animationKey}
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full ${
          showResult && displayedResult === 'win' ? 'glow-green' : ''
        } ${showResult && displayedResult === 'loss' ? 'glow-red' : ''}`}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipping ? 1440 : finalRotation }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Heads side (Win - Green) */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {showResult && displayedResult === 'win' ? '✓' : '₹'}
        </div>

        {/* Tails side (Loss - Red) */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {showResult && displayedResult === 'loss' ? '✗' : '💀'}
        </div>
      </motion.div>

      {/* Result flash */}
      <AnimatePresence>
        {showResult && displayedResult && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-black ${
              displayedResult === 'win' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {displayedResult === 'win' ? 'WIN!' : 'LOSS!'}
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
