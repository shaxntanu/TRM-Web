'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface BankrollChartProps {
  history: number[];
  startingBankroll: number;
}

export default function BankrollChart({ history, startingBankroll }: BankrollChartProps) {
  const data = history.map((bankroll, index) => ({
    game: index,
    bankroll,
  }));

  const minBankroll = Math.min(...history);
  const maxBankroll = Math.max(...history);
  const yMin = Math.max(0, minBankroll - 1000);
  const yMax = maxBankroll + 1000;

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Bankroll Over Time</h3>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="game"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{ value: 'Games Played', position: 'bottom', fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              domain={[yMin, yMax]}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [formatCurrency(value), 'Bankroll']}
              labelFormatter={(label) => `Game ${label}`}
            />
            <ReferenceLine
              y={startingBankroll}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label={{
                value: 'Starting',
                position: 'right',
                fill: '#22c55e',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="bankroll"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
