'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Skull, TrendingDown } from 'lucide-react';

const floatingChips = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 6 + Math.random() * 4,
  size: 20 + Math.random() * 30,
}));

export default function Hero({ onStart }: { onStart: () => void }) {
  const titleLetters = "The Ruin Machine".split('');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Floating casino chips background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingChips.map((chip) => (
          <motion.div
            key={chip.id}
            className="absolute rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-20"
            style={{
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              width: chip.size,
              height: chip.size,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: chip.duration,
              delay: chip.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Skull icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-6"
        >
          <Skull className="w-16 h-16 mx-auto text-red-500 drop-shadow-lg" />
        </motion.div>

        {/* Animated title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
          {titleLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={letter === ' ' ? 'inline-block w-4' : 'inline-block'}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #fbbf24 50%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xl md:text-2xl text-slate-400 mb-8 font-medium"
        >
          A Mathematical Proof That Gambling Always Loses
        </motion.p>

        {/* Stats counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-2 text-slate-500 mb-10"
        >
          <TrendingDown className="w-5 h-5 text-red-500" />
          <span>99.9% of simulations end in bankruptcy</span>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 pulse-btn"
        >
          🎲 Try Your Luck
        </motion.button>

        {/* Warning text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-6 text-sm text-slate-600"
        >
          Spoiler: You will lose. Math is undefeated.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-8 h-8 text-slate-600" />
      </motion.div>
    </section>
  );
}
