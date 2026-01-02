'use client';

import { Github, Heart, Skull } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-500">
            <Skull className="w-5 h-5 text-red-500" />
            <span className="font-semibold">The Ruin Machine</span>
          </div>

          <p className="text-sm text-slate-600 text-center">
            Built to prove that gambling is a losing game. Math is undefeated.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="text-slate-600 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> for education
            </span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-700">
            This is an educational tool. If you or someone you know has a gambling problem,
            please seek help. The math shown here is real - gambling always loses in the long run.
          </p>
        </div>
      </div>
    </footer>
  );
}
