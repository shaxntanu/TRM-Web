export type Strategy = 'martingale' | 'flat' | 'quit-on-loss';

export interface GameResult {
  gameNumber: number;
  bet: number;
  won: boolean;
  bankrollBefore: number;
  bankrollAfter: number;
}

export interface SimulationStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  currentBankroll: number;
  startingBankroll: number;
  currentBet: number;
  longestWinStreak: number;
  longestLossStreak: number;
  history: number[];
  isBankrupt: boolean;
}

export class GamblingSimulator {
  private bankroll: number;
  private baseBet: number;
  private currentBet: number;
  private gamesPlayed: number = 0;
  private wins: number = 0;
  private losses: number = 0;
  private history: number[] = [];
  private currentWinStreak: number = 0;
  private currentLossStreak: number = 0;
  private longestWinStreak: number = 0;
  private longestLossStreak: number = 0;

  constructor(
    private startingBankroll: number,
    baseBet: number,
    private winProbability: number,
    private strategy: Strategy
  ) {
    this.bankroll = startingBankroll;
    this.baseBet = baseBet;
    this.currentBet = baseBet;
    this.history.push(startingBankroll);
  }

  placeBet(): GameResult | null {
    if (this.bankroll < this.currentBet || this.bankroll <= 0) {
      return null;
    }

    const actualBet = Math.min(this.currentBet, this.bankroll);
    const won = Math.random() < this.winProbability;

    const result: GameResult = {
      gameNumber: ++this.gamesPlayed,
      bet: actualBet,
      won,
      bankrollBefore: this.bankroll,
      bankrollAfter: won
        ? this.bankroll + actualBet
        : this.bankroll - actualBet
    };

    if (won) {
      this.bankroll += actualBet;
      this.wins++;
      this.currentWinStreak++;
      this.currentLossStreak = 0;
      this.longestWinStreak = Math.max(this.longestWinStreak, this.currentWinStreak);
      this.currentBet = this.getNextBetOnWin();
    } else {
      this.bankroll -= actualBet;
      this.losses++;
      this.currentLossStreak++;
      this.currentWinStreak = 0;
      this.longestLossStreak = Math.max(this.longestLossStreak, this.currentLossStreak);
      this.currentBet = this.getNextBetOnLoss();
    }

    this.history.push(this.bankroll);
    return result;
  }

  private getNextBetOnWin(): number {
    switch (this.strategy) {
      case 'martingale':
        return this.baseBet;
      case 'flat':
        return this.baseBet;
      case 'quit-on-loss':
        return this.baseBet;
      default:
        return this.baseBet;
    }
  }

  private getNextBetOnLoss(): number {
    switch (this.strategy) {
      case 'martingale':
        return Math.min(this.currentBet * 2, this.bankroll);
      case 'flat':
        return this.baseBet;
      case 'quit-on-loss':
        return this.baseBet;
      default:
        return this.baseBet;
    }
  }

  getStats(): SimulationStats {
    return {
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      losses: this.losses,
      winRate: this.gamesPlayed > 0 ? (this.wins / this.gamesPlayed) * 100 : 0,
      currentBankroll: this.bankroll,
      startingBankroll: this.startingBankroll,
      currentBet: this.currentBet,
      longestWinStreak: this.longestWinStreak,
      longestLossStreak: this.longestLossStreak,
      history: this.history,
      isBankrupt: this.bankroll <= 0
    };
  }

  reset(): void {
    this.bankroll = this.startingBankroll;
    this.currentBet = this.baseBet;
    this.gamesPlayed = 0;
    this.wins = 0;
    this.losses = 0;
    this.history = [this.startingBankroll];
    this.currentWinStreak = 0;
    this.currentLossStreak = 0;
    this.longestWinStreak = 0;
    this.longestLossStreak = 0;
  }
}

// Mass simulation runner
export function runMassSimulation(
  runs: number,
  gamesPerRun: number,
  startingBankroll: number,
  baseBet: number,
  winProbability: number,
  strategy: Strategy
): MassSimulationResult {
  const results: number[] = [];
  let bankruptcies = 0;
  let totalWinRate = 0;
  const survivalCurve: number[] = new Array(gamesPerRun + 1).fill(0);

  for (let i = 0; i < runs; i++) {
    const sim = new GamblingSimulator(startingBankroll, baseBet, winProbability, strategy);
    let gameCount = 0;

    while (gameCount < gamesPerRun && !sim.getStats().isBankrupt) {
      sim.placeBet();
      gameCount++;
      survivalCurve[gameCount]++;
    }

    const stats = sim.getStats();
    results.push(stats.currentBankroll);
    totalWinRate += stats.winRate;

    if (stats.isBankrupt) {
      bankruptcies++;
    }
  }

  // Normalize survival curve to percentage
  const normalizedSurvival = survivalCurve.map((count, idx) => 
    idx === 0 ? 100 : ((runs - bankruptcies + count) / runs) * 100
  );

  return {
    finalBankrolls: results,
    bankruptcies,
    survivors: runs - bankruptcies,
    avgBankroll: results.reduce((a, b) => a + b, 0) / runs,
    avgWinRate: totalWinRate / runs,
    survivalCurve: normalizedSurvival
  };
}

export interface MassSimulationResult {
  finalBankrolls: number[];
  bankruptcies: number;
  survivors: number;
  avgBankroll: number;
  avgWinRate: number;
  survivalCurve: number[];
}
