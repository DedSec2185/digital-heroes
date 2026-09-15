// ==============================================================================
// DIGITAL HEROES (Level 1) - Draw & Reward Engine (§ 06, § 07)
// ==============================================================================

import { Draw, DrawLogicType, DrawSimulation, GolfScore, PrizeTier, UserProfile } from '../types';

export class DrawEngine {
  /**
   * Generates 5 unique random numbers between 1 and 45 (Standard Lottery Style)
   */
  static generateRandomNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * Generates 5 numbers using algorithmic score-frequency weighting across all user scores
   */
  static generateAlgorithmicNumbers(allUserScores: GolfScore[]): number[] {
    // Frequency map for 1–45
    const freqMap: { [num: number]: number } = {};
    for (let i = 1; i <= 45; i++) freqMap[i] = 1; // base weight of 1

    allUserScores.forEach(s => {
      if (s.score >= 1 && s.score <= 45) {
        freqMap[s.score] = (freqMap[s.score] || 1) + 3; // boost submitted scores
      }
    });

    const selected = new Set<number>();
    const entries = Object.entries(freqMap).map(([k, v]) => ({ num: parseInt(k), weight: v }));

    while (selected.size < 5) {
      const available = entries.filter(e => !selected.has(e.num));
      const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
      let r = Math.random() * totalWeight;

      for (const item of available) {
        r -= item.weight;
        if (r <= 0) {
          selected.add(item.num);
          break;
        }
      }
    }

    return Array.from(selected).sort((a, b) => a - b);
  }

  /**
   * Calculates how many numbers match between user's 5 scores and drawn 5 numbers
   */
  static calculateMatches(userScores: number[], drawnNumbers: number[]): { matchedCount: number; matchedNumbers: number[] } {
    const drawnSet = new Set(drawnNumbers);
    const matchedNumbers = userScores.filter(s => drawnSet.has(s));
    return {
      matchedCount: matchedNumbers.length,
      matchedNumbers,
    };
  }

  /**
   * Classifies match into PrizeTier (§ 07)
   */
  static determineTier(matchedCount: number): PrizeTier {
    if (matchedCount === 5) return 'jackpot';
    if (matchedCount === 4) return 'tier2';
    if (matchedCount === 3) return 'tier3';
    return 'none';
  }

  /**
   * Simulates a candidate draw across active participants without changing state
   */
  static simulateDraw(
    candidateNumbers: number[],
    participants: { user: UserProfile; scores: GolfScore[] }[],
    prizePool: { total: number; jackpot: number; tier2: number; tier3: number }
  ): DrawSimulation {
    let jackpotWinners = 0;
    let tier2Winners = 0;
    let tier3Winners = 0;

    const freqDist: { [score: number]: number } = {};

    participants.forEach(({ scores }) => {
      const numbers = scores.slice(0, 5).map(s => s.score);
      numbers.forEach(n => {
        freqDist[n] = (freqDist[n] || 0) + 1;
      });

      const { matchedCount } = this.calculateMatches(numbers, candidateNumbers);
      if (matchedCount === 5) jackpotWinners++;
      else if (matchedCount === 4) tier2Winners++;
      else if (matchedCount === 3) tier3Winners++;
    });

    const jackpotPayout = jackpotWinners > 0 ? prizePool.jackpot / jackpotWinners : 0;
    const tier2Payout = tier2Winners > 0 ? prizePool.tier2 / tier2Winners : 0;
    const tier3Payout = tier3Winners > 0 ? prizePool.tier3 / tier3Winners : 0;

    return {
      drawnNumbers: candidateNumbers,
      totalEntries: participants.length,
      jackpotWinnersCount: jackpotWinners,
      tier2WinnersCount: tier2Winners,
      tier3WinnersCount: tier3Winners,
      jackpotPayoutPerWinner: Math.round(jackpotPayout * 100) / 100,
      tier2PayoutPerWinner: Math.round(tier2Payout * 100) / 100,
      tier3PayoutPerWinner: Math.round(tier3Payout * 100) / 100,
      jackpotWillRollover: jackpotWinners === 0,
      frequencyDistribution: freqDist,
    };
  }

  /**
   * Calculates dynamic prize pool based on subscriber counts & rollovers (§ 07)
   * Formula: Fixed 50% of subscription revenue forms monthly prize pool
   * Match 5: 40% (Rollover enabled)
   * Match 4: 35% (Split equally)
   * Match 3: 25% (Split equally)
   */
  static calculatePrizePool(activeSubscribers: number, rolloverJackpot: number = 0) {
    // Average subscription unit value ~ $20/month
    const estimatedSubscriptionRevenue = activeSubscribers * 20;
    const basePrizePool = Math.max(10000, estimatedSubscriptionRevenue * 0.5);

    const baseJackpot = basePrizePool * 0.40;
    const tier2Pool = basePrizePool * 0.35;
    const tier3Pool = basePrizePool * 0.25;

    const effectiveJackpot = baseJackpot + rolloverJackpot;
    const totalPrizePool = effectiveJackpot + tier2Pool + tier3Pool;

    return {
      basePrizePool: Math.round(basePrizePool),
      totalPrizePool: Math.round(totalPrizePool),
      jackpotPool: Math.round(effectiveJackpot),
      tier2Pool: Math.round(tier2Pool),
      tier3Pool: Math.round(tier3Pool),
      rolloverJackpot: Math.round(rolloverJackpot),
    };
  }
}
