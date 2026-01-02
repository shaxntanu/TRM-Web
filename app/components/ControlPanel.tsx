'use client';

import { Strategy } from '@/lib/simulation';
import { formatCurrency } from '@/lib/utils';
import { Settings, Zap, RotateCcw, Play, FastForward } from 'lucide-react';

interface ControlPanelProps {
  startingBankroll: number;
  setStartingBankroll: (v: number) => void;
  baseBet: number;
  setBaseBet: (v: number) => void;
  winProbability: number;
  setWinProbability: (v: number) => void;
  strategy: Strategy;
  setStrategy: (v: Strategy) => void;
  speed: number;
  setSpeed: (v: number) => void;
  onPlaceBet: () => void;
  onAutoPlay: () => void;
  onMassSimulation: () => void;
  onReset: () => void;
  isPlaying: boolean;
  isBankrupt: boolean;
}

export default function ControlPanel({
  startingBankroll,
  setStartingBankroll,
  baseBet,
  setBaseBet,
  winProbability,
  setWinProbability,
  strategy,
  setStrategy,
  speed,
  setSpeed,
  onPlaceBet,
  onAutoPlay,
  onMassSimulation,
  onReset,
  isPlaying,
  isBankrupt,
}: ControlPanelProps) {
  const houseEdge = ((0.5 - winProbability) * 200).toFixed(1);

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-200">
        <Settings className="w-5 h-5 text-amber-400" />
        Controls
      </div>

      {/* Starting Bankroll */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Starting Bankroll</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
          <input
            type="number"
            value={startingBankroll}
            onChange={(e) => setStartingBankroll(Number(e.target.value))}
            min={1000}
            max={100000}
            step={1000}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-8 pr-4 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Base Bet */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Base Bet</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
          <input
            type="number"
            value={baseBet}
            onChange={(e) => setBaseBet(Number(e.target.value))}
            min={10}
            max={5000}
            step={10}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-8 pr-4 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Win Probability */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm text-slate-400">Win Probability</label>
          <span className="text-sm text-amber-400">{winProbability.toFixed(1)}%</span>
        </div>
        <input
          type="range"
          value={winProbability}
          onChange={(e) => setWinProbability(Number(e.target.value))}
          min={45}
          max={50}
          step={0.1}
          className="w-full accent-amber-500"
        />
        <p className="text-xs text-red-400">House Edge: {houseEdge}%</p>
      </div>

      {/* Strategy */}
      <div className="space-y-3">
        <label className="text-sm text-slate-400">Betting Strategy</label>
        <div className="space-y-2">
          {[
            { value: 'martingale', label: 'Martingale', desc: 'Double on Loss' },
            { value: 'flat', label: 'Flat Bet', desc: 'Constant Amount' },
            { value: 'quit-on-loss', label: 'Quit on Loss', desc: 'Reset Session' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                strategy === opt.value
                  ? 'bg-amber-500/20 border border-amber-500/50'
                  : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50'
              }`}
            >
              <input
                type="radio"
                name="strategy"
                value={opt.value}
                checked={strategy === opt.value}
                onChange={(e) => setStrategy(e.target.value as Strategy)}
                className="accent-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-200">{opt.label}</p>
                <p className="text-xs text-slate-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Speed */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm text-slate-400">Simulation Speed</label>
          <span className="text-sm text-slate-500">
            {speed === 1000 ? 'Slow' : speed === 500 ? 'Normal' : speed === 100 ? 'Fast' : 'Instant'}
          </span>
        </div>
        <input
          type="range"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          min={10}
          max={1000}
          step={10}
          className="w-full accent-amber-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onPlaceBet}
          disabled={isPlaying || isBankrupt}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-red-500 hover:to-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20"
        >
          <Play className="w-5 h-5" />
          Place Bet
        </button>

        <button
          onClick={onAutoPlay}
          disabled={isPlaying || isBankrupt}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Zap className="w-5 h-5" />
          Auto Play (100 games)
        </button>

        <button
          onClick={onMassSimulation}
          disabled={isPlaying}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FastForward className="w-5 h-5" />
          Mass Sim (1000 runs)
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 bg-slate-700 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-600 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
