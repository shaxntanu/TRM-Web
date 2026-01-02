'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calculator, TrendingDown, Skull, Dice1 } from 'lucide-react';
import { calculateMartingaleRequirement, formatCurrency } from '@/lib/utils';

const concepts = [
  {
    icon: <Calculator className="w-6 h-6" />,
    title: 'Expected Value',
    description: 'Why negative EV guarantees long-term loss',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm">
          <p className="text-amber-400">EV = (Win Prob × Win Amount) - (Loss Prob × Loss Amount)</p>
          <p className="text-slate-400 mt-2">EV = (0.495 × ₹100) - (0.505 × ₹100)</p>
          <p className="text-red-400 mt-1">EV = -₹1 per bet</p>
        </div>
        <p className="text-slate-400 text-sm">
          Over 1000 bets, your expected loss is ₹1,000. The house edge compounds relentlessly.
        </p>
      </div>
    ),
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    title: 'Law of Large Numbers',
    description: 'Results converge to expected value over time',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400 text-sm">
          Short-term luck exists. Long-term? Mathematics is undefeated.
        </p>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-300">As n → ∞, your win rate → 49.5%</p>
          <p className="text-xs text-slate-500 mt-2">
            You might win 60% of your first 10 games. But after 10,000? You'll be at 49.5%.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: <Skull className="w-6 h-6" />,
    title: "Gambler's Ruin",
    description: 'Finite bankroll vs infinite casino = certain bankruptcy',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm">
          <p className="text-slate-400">P(ruin) = Casino / (You + Casino)</p>
          <p className="text-slate-400 mt-2">With ₹10K vs ₹10 Crore:</p>
          <p className="text-red-400">P(ruin) = 99.99%</p>
        </div>
        <p className="text-slate-400 text-sm">
          Even with a fair coin, you'd eventually go broke. With house edge? It's guaranteed.
        </p>
      </div>
    ),
  },
  {
    icon: <Dice1 className="w-6 h-6" />,
    title: 'Martingale Fallacy',
    description: "Why doubling bets doesn't beat house edge",
    content: (
      <div className="space-y-4">
        <p className="text-slate-400 text-sm">
          "Just double your bet after each loss!" - Famous last words.
        </p>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-300">After 10 consecutive losses (₹100 base):</p>
          <p className="text-red-400 text-xl font-bold mt-2">Required bet: ₹102,400</p>
          <p className="text-amber-400 text-sm mt-1">Potential profit: ₹100 😂</p>
        </div>
        <p className="text-xs text-slate-500">
          10 losses in a row happens 1 in 1024 times. Play 1024 sessions...
        </p>
      </div>
    ),
  },
];

export default function EducationalSection() {
  const [baseBet, setBaseBet] = useState(100);
  const [losses, setLosses] = useState(10);
  const martingale = calculateMartingaleRequirement(baseBet, losses);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            The Math Behind Your Ruin
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Understanding why gambling is a losing proposition isn't about luck - it's pure mathematics.
          </p>
        </motion.div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {concepts.map((concept, index) => (
            <ConceptCard key={index} concept={concept} index={index} />
          ))}
        </div>

        {/* Interactive Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            Martingale Calculator
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Base Bet (₹)</label>
                <input
                  type="number"
                  value={baseBet}
                  onChange={(e) => setBaseBet(Number(e.target.value))}
                  min={10}
                  max={1000}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Consecutive Losses</label>
                <input
                  type="range"
                  value={losses}
                  onChange={(e) => setLosses(Number(e.target.value))}
                  min={1}
                  max={15}
                  className="w-full accent-amber-500"
                />
                <p className="text-center text-amber-400 font-bold">{losses} losses</p>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Required Bankroll</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(martingale.requiredBankroll)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total at Risk</p>
                <p className="text-xl font-semibold text-amber-400">
                  {formatCurrency(martingale.totalRisk)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Potential Profit</p>
                <p className="text-xl font-semibold text-emerald-400">
                  {formatCurrency(martingale.potentialProfit)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Risk {formatCurrency(martingale.totalRisk)} to win {formatCurrency(baseBet)} 🤡
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ConceptCard({
  concept,
  index,
}: {
  concept: (typeof concepts)[0];
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
            {concept.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{concept.title}</h3>
            <p className="text-sm text-slate-500">{concept.description}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 border-t border-slate-800">
          {concept.content}
        </div>
      </motion.div>
    </motion.div>
  );
}
