'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GamblingSimulator, Strategy, SimulationStats } from '@/lib/simulation';
import ControlPanel from './ControlPanel';
import CoinFlip from './CoinFlip';
import StatsCard from './StatsCard';
import BankrollChart from './BankrollChart';
import BankruptcyModal from './BankruptcyModal';
import MassSimulation from './MassSimulation';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

const initialStats: SimulationStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  currentBankroll: 10000,
  startingBankroll: 10000,
  currentBet: 100,
  longestWinStreak: 0,
  longestLossStreak: 0,
  history: [10000],
  isBankrupt: false,
};

export default function Simulator() {
  // Settings
  const [startingBankroll, setStartingBankroll] = useState(10000);
  const [baseBet, setBaseBet] = useState(100);
  const [winProbability, setWinProbability] = useState(50);
  const [strategy, setStrategy] = useState<Strategy>('martingale');
  const [speed, setSpeed] = useState(500);

  // Game state
  const [stats, setStats] = useState<SimulationStats>(initialStats);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<'win' | 'loss' | null>(null);
  const [lastBet, setLastBet] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMassSimulation, setShowMassSimulation] = useState(false);

  // Simulator instance
  const simulatorRef = useRef<GamblingSimulator | null>(null);

  // Initialize simulator
  useEffect(() => {
    simulatorRef.current = new GamblingSimulator(
      startingBankroll,
      baseBet,
      winProbability / 100,
      strategy
    );
    setStats(simulatorRef.current.getStats());
  }, []);

  const placeBet = useCallback(() => {
    if (!simulatorRef.current || isFlipping || stats.isBankrupt) return;

    setIsFlipping(true);
    setLastResult(null);

    setTimeout(() => {
      const result = simulatorRef.current!.placeBet();
      if (result) {
        setLastResult(result.won ? 'win' : 'loss');
        setLastBet(result.bet);
        setStats(simulatorRef.current!.getStats());
      }
      setIsFlipping(false);
    }, speed);
  }, [isFlipping, stats.isBankrupt, speed]);

  const autoPlay = useCallback(async () => {
    if (!simulatorRef.current || isPlaying || stats.isBankrupt) return;

    setIsPlaying(true);
    const gamesToPlay = 100;

    for (let i = 0; i < gamesToPlay; i++) {
      if (simulatorRef.current.getStats().isBankrupt) break;

      const result = simulatorRef.current.placeBet();
      if (result) {
        setLastResult(result.won ? 'win' : 'loss');
        setLastBet(result.bet);
        setStats(simulatorRef.current.getStats());
      }

      if (speed > 50) {
        await new Promise((resolve) => setTimeout(resolve, speed / 10));
      }
    }

    setIsPlaying(false);
  }, [isPlaying, stats.isBankrupt, speed]);

  const reset = useCallback(() => {
    simulatorRef.current = new GamblingSimulator(
      startingBankroll,
      baseBet,
      winProbability / 100,
      strategy
    );
    setStats(simulatorRef.current.getStats());
    setLastResult(null);
    setLastBet(0);
    setIsPlaying(false);
    setIsFlipping(false);
  }, [startingBankroll, baseBet, winProbability, strategy]);

  const handleExport = () => {
    exportToCSV(stats.history, `ruin-machine-${Date.now()}.csv`);
  };

  return (
    <section id="simulator" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            Interactive Simulator
          </h2>
          <p className="text-slate-500">
            Watch your bankroll disappear in real-time. It's not a bug, it's mathematics.
          </p>
        </motion.div>

        {/* Main simulator grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <ControlPanel
              startingBankroll={startingBankroll}
              setStartingBankroll={setStartingBankroll}
              baseBet={baseBet}
              setBaseBet={setBaseBet}
              winProbability={winProbability}
              setWinProbability={setWinProbability}
              strategy={strategy}
              setStrategy={setStrategy}
              speed={speed}
              setSpeed={setSpeed}
              onPlaceBet={placeBet}
              onAutoPlay={autoPlay}
              onMassSimulation={() => setShowMassSimulation(!showMassSimulation)}
              onReset={reset}
              isPlaying={isPlaying || isFlipping}
              isBankrupt={stats.isBankrupt}
            />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coin Flip */}
              <div className="glass rounded-2xl p-6 flex items-center justify-center min-h-[280px]">
                <CoinFlip
                  isFlipping={isFlipping}
                  result={lastResult}
                />
              </div>

              {/* Stats */}
              <StatsCard
                stats={stats}
                lastResult={lastResult}
                lastBet={lastBet}
              />
            </div>

            {/* Chart */}
            <BankrollChart
              history={stats.history}
              startingBankroll={startingBankroll}
            />

            {/* Export button */}
            <div className="flex justify-end">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Mass Simulation */}
        {showMassSimulation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MassSimulation
              startingBankroll={startingBankroll}
              baseBet={baseBet}
              winProbability={winProbability}
              strategy={strategy}
            />
          </motion.div>
        )}

        {/* Bankruptcy Modal */}
        <BankruptcyModal
          isOpen={stats.isBankrupt}
          stats={stats}
          onReset={reset}
        />
      </div>
    </section>
  );
}
