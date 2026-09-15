// ==============================================================================
// DIGITAL HEROES (Level 1) - Score Management Engine (§ 05)
// ==============================================================================

import { GolfScore } from '../types';

export interface AddScoreResult {
  success: boolean;
  error?: string;
  updatedScores?: GolfScore[];
}

export class ScoreEngine {
  /**
   * Validates if score is in legal Stableford range (1 to 45)
   */
  static isValidScore(score: number): boolean {
    return Number.isInteger(score) && score >= 1 && score <= 45;
  }

  /**
   * Validates date format YYYY-MM-DD and ensures it is not in the future
   */
  static isValidDate(dateStr: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    
    // Future date check
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d <= today;
  }

  /**
   * Checks if user already recorded a score for this specific date
   */
  static hasDuplicateDate(existingScores: GolfScore[], targetDate: string, excludeId?: string): boolean {
    return existingScores.some(s => s.date === targetDate && s.id !== excludeId);
  }

  /**
   * Enforces Section 05:
   * - Only the latest 5 scores are retained at any time.
   * - A new score replaces the oldest stored score automatically.
   * - Only one score entry per date (no duplicate dates permitted).
   * - Scores display in reverse chronological order (most recent first).
   */
  static processNewScore(
    currentScores: GolfScore[],
    newScoreData: { userId: string; score: number; date: string; courseName?: string }
  ): AddScoreResult {
    const { userId, score, date, courseName } = newScoreData;

    // Validate score range 1–45
    if (!this.isValidScore(score)) {
      return {
        success: false,
        error: `Invalid Stableford score: ${score}. Must be between 1 and 45.`,
      };
    }

    // Validate date
    if (!this.isValidDate(date)) {
      return {
        success: false,
        error: 'Invalid score date. Date cannot be in the future.',
      };
    }

    // Check duplicate date constraint
    if (this.hasDuplicateDate(currentScores, date)) {
      return {
        success: false,
        error: `A score for date ${date} already exists. Duplicate scores for the same date are not allowed. Please edit or delete the existing entry.`,
      };
    }

    const newScore: GolfScore = {
      id: 'score_' + Math.random().toString(36).substring(2, 9),
      userId,
      score,
      date,
      courseName: courseName || 'Championship Course',
      createdAt: new Date().toISOString(),
    };

    // Combine and sort reverse chronologically (most recent first)
    const combined = [...currentScores, newScore];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Retain strictly the latest 5 scores (FIFO rolling eviction of older entries)
    const updated = combined.slice(0, 5);

    return {
      success: true,
      updatedScores: updated,
    };
  }

  /**
   * Updates an existing score entry with date uniqueness check
   */
  static updateScore(
    currentScores: GolfScore[],
    scoreId: string,
    updatedData: { score?: number; date?: string; courseName?: string }
  ): AddScoreResult {
    const target = currentScores.find(s => s.id === scoreId);
    if (!target) {
      return { success: false, error: 'Score not found' };
    }

    const newScore = updatedData.score !== undefined ? updatedData.score : target.score;
    const newDate = updatedData.date || target.date;

    if (!this.isValidScore(newScore)) {
      return { success: false, error: `Invalid Stableford score: ${newScore}. Must be 1–45.` };
    }

    if (!this.isValidDate(newDate)) {
      return { success: false, error: 'Invalid score date.' };
    }

    if (this.hasDuplicateDate(currentScores, newDate, scoreId)) {
      return { success: false, error: `A score for date ${newDate} already exists.` };
    }

    const updated = currentScores.map(s => {
      if (s.id === scoreId) {
        return {
          ...s,
          score: newScore,
          date: newDate,
          courseName: updatedData.courseName || s.courseName,
        };
      }
      return s;
    });

    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { success: true, updatedScores: updated };
  }

  /**
   * Deletes a score entry
   */
  static deleteScore(currentScores: GolfScore[], scoreId: string): GolfScore[] {
    return currentScores.filter(s => s.id !== scoreId);
  }

  /**
   * Calculate average Stableford score
   */
  static calculateAverage(scores: GolfScore[]): number {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }
}
