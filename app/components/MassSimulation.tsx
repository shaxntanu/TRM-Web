'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { runMassSimulation, MassSimulationResult, Strategy } from '@/lib/simulation';
import { formatCurrency } from '@/lib/utils';
import { Zap, Users, Skull, TrendingDown } from 'lucide-react';

interface MassSimulationProps {
  startingBankroll: number;
  baseBet: number;
  winProbability: number;
  strategy: Strategy;
}

export default function MassSimulation({
  startingBankroll,
  baseBet,
  winProbability,
  strategy,
}: MassSimulationProps) {
  const [runs, setRuns] = useState(1000);
  const [gamesPerRun, setGamesPerRun] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<MassSimulationResult | null>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 100);

    // Run simulation (in real app, use Web Worker)
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const result = runMassSimulation(
      runs,
      gamesPerRun,
      startingBankroll,
      baseBet,
      winProbability / 100,
      strategy
    );

    clearInterval(progressInterval);
    setProgress(100);
    setResults(result);
    setIsRunning(false);
  };

  // Create histogram data
  const getHistogramData = () => {
    if (!results) return [];
    const buckets: { [key: string]: number } = {};
    const bucketSize = startingBankroll / 5;

    results.finalBankrolls.forEach((bankroll) => {
      const bucketKey = Math.floor(bankroll / bucketSize) * bucketSize;
      const label = bankroll <= 0 ? 'Bankrupt' : `₹${(bucketKey / 1000).toFixed(0)}k`;
      buckets[label] = (buckets[label] || 0) + 1;
    });

    return Object.entries(buckets)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => {
        if (a.range === 'Bankrupt') return -1;
        if (b.range === 'Bankrupt') return 1;
        return parseInt(a.range.replace(/[^0-9-]/g, '')) - parseInt(b.range.replace(/[^0-9-]/g, ''));
      });
  };

  // Survival curve data
  const getSurvivalData = () => {
    if (!results) return [];
    return results.survivalCurve
      .filter((_, i) => i % 10 === 0)
      .map((survival, i) => ({
        game: i * 10,
        survival: Math.max(0, survival),
      }));
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-200">
        <Zap className="w-5 h-5 text-purple-400" />
        Mass Simulation
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Number of Simulations</label>
          <input
            type="number"
            value={runs}
            onChange={(e) => setRuns(Number(e.target.value))}
            min={100}
            max={10000}
            step={100}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Games per Simulation</label>
          <input
            type="number"
            value={gamesPerRun}
            onChange={(e) => setGamesPerRun(Number(e.target.value))}
            min={100}
            max={10000}
            step={100}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <button
        onClick={runSimulation}
        disabled={isRunning}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 transition-all"
      >
        {isRunning ? 'Running...' : '🔥 Run Mass Simulation'}
      </button>

      {/* Progress bar */}
      {isRunning && (
        <div className="space-y-2">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 text-center">Running simulations...</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={<Users className="w-5 h-5 text-emerald-400" />}
              label="Survivors"
              value={results.survivors}
              total={runs}
              color="text-emerald-400"
            />
            <StatBox
              icon={<Skull className="w-5 h-5 text-red-400" />}
              label="Bankruptcies"
              value={results.bankruptcies}
              total={runs}
              color="text-red-400"
            />
            <StatBox
              icon={<TrendingDown className="w-5 h-5 text-amber-400" />}
              label="Avg Bankroll"
              value={formatCurrency(results.avgBankroll)}
              color="text-amber-400"
            />
            <StatBox
              icon={<span className="text-blue-400">%</span>}
              label="Avg Win Rate"
              value={`${results.avgWinRate.toFixed(2)}%`}
              subtext="Target: 49.5%"
              color="text-blue-400"
            />
          </div>

          {/* Distribution Chart */}
          <div className="bg-slate-800/30 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-400 mb-4">Final Bankroll Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getHistogramData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Survival Curve */}
          <div className="bg-slate-800/30 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-400 mb-4">
              Survival Rate Over Time 💀
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSurvivalData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="game" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Still Solvent']}
                  />
                  <Line type="monotone" dataKey="survival" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600 text-center mt-2">
              Watch it approach 0% 💀
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  total,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  total?: number;
  subtext?: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {total && (
        <p className="text-xs text-slate-600">
          {((Number(value) / total) * 100).toFixed(1)}%
        </p>
      )}
      {subtext && <p className="text-xs text-slate-600">{subtext}</p>}
    </div>
  );
}
