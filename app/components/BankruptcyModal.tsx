'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Skull, RotateCcw } from 'lucide-react';
import { SimulationStats } from '@/lib/simulation';

interface BankruptcyModalProps {
  isOpen: boolean;
  stats: SimulationStats;
  onReset: () => void;
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 400,
  y: (Math.random() - 0.5) * 400,
  rotate: Math.random() * 720 - 360,
  scale: Math.random() * 0.5 + 0.5,
}));

export default function BankruptcyModal({ isOpen, stats, onReset }: BankruptcyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {/* Explosion particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: particle.scale,
                  rotate: particle.rotate,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2 w-4 h-4 bg-red-500 rounded-full"
              />
            ))}
          </div>

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15 }}
            className="glass-dark rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none" />

            {/* Skull icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Skull className="w-20 h-20 mx-auto text-red-500 mb-4" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black text-red-500 mb-2"
            >
              💀 GAMBLER'S RUIN 💀
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 mb-6"
            >
              The house always wins. Always.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 rounded-xl p-4 mb-6 space-y-2"
            >
              <p className="text-slate-300">
                You lasted <span className="text-amber-400 font-bold">{stats.gamesPlayed}</span> games
              </p>
              <p className="text-slate-300">
                Final win rate: <span className="text-red-400 font-bold">{stats.winRate.toFixed(2)}%</span>
              </p>
              <p className="text-emerald-400 text-sm">
                As predicted by mathematics ✓
              </p>
            </motion.div>

            {/* Reset button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again (You'll Lose Again 😂)
            </motion.button>

            <p className="text-xs text-slate-600 mt-4">
              Math is undefeated since the beginning of time
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
