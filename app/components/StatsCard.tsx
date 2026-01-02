'use client';

import { motion } from 'framer-motion';
import { SimulationStats } from '@/lib/simulation';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, Flame, Snowflake } from 'lucide-react';

interface StatsCardProps {
  stats: SimulationStats;
  lastResult: 'win' | 'loss' | null;
  lastBet: number;
}

export default function StatsCard({ stats, lastResult, lastBet }: StatsCardProps) {
  const profitLoss = stats.currentBankroll - stats.startingBankroll;
  const isProfit = profitLoss >= 0;

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Main Bankroll Display */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">Current Bankroll</p>
        <motion.p
          key={stats.currentBankroll}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`text-4xl md:text-5xl font-black ${
            isProfit ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {formatCurrency(stats.currentBankroll)}
        </motion.p>
        <p className={`text-sm mt-1 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
          {isProfit ? '+' : ''}{formatCurrency(profitLoss)}
        </p>
      </div>

      {/* Result Flash */}
      {lastResult && (
        <motion.div
          key={`${stats.gamesPlayed}-${lastResult}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`text-center py-3 rounded-xl ${
            lastResult === 'win' ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}
        >
          <p className={`text-xl font-bold ${
            lastResult === 'win' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {lastResult === 'win' ? `WIN +${formatCurrency(lastBet)}` : `LOSS -${formatCurrency(lastBet)}`}
          </p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          label="Games Played"
          value={stats.gamesPlayed.toString()}
          icon={<Target className="w-4 h-4" />}
        />
        <StatItem
          label="Win Rate"
          value={`${stats.winRate.toFixed(2)}%`}
          subtext="Target: 49.50%"
          icon={stats.winRate >= 49.5 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
        />
        <StatItem
          label="Wins"
          value={stats.wins.toString()}
          color="text-emerald-400"
          icon={<span className="text-emerald-400">✓</span>}
        />
        <StatItem
          label="Losses"
          value={stats.losses.toString()}
          color="text-red-400"
          icon={<span className="text-red-400">✗</span>}
        />
        <StatItem
          label="Current Bet"
          value={formatCurrency(stats.currentBet)}
          icon={<span className="text-amber-400">₹</span>}
        />
        <StatItem
          label="Win Streak"
          value={stats.longestWinStreak.toString()}
          icon={<Flame className="w-4 h-4 text-orange-400" />}
        />
        <StatItem
          label="Loss Streak"
          value={stats.longestLossStreak.toString()}
          icon={<Snowflake className="w-4 h-4 text-blue-400" />}
        />
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  subtext,
  color = 'text-slate-200',
  icon,
}: {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-slate-500">{label}</p>
      </div>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-600">{subtext}</p>}
    </div>
  );
}
