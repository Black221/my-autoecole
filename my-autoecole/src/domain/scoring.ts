/* Barème et statistiques d'une session. */
import type { Evaluation } from "./challenge";

export interface ScoreState {
  answered: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

export const emptyScore: ScoreState = {
  answered: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
};

export function applyResult(s: ScoreState, ev: Evaluation): ScoreState {
  const streak = ev.correct ? s.streak + 1 : 0;
  return {
    answered: s.answered + 1,
    correct: s.correct + (ev.correct ? 1 : 0),
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
  };
}

export function ratio(s: ScoreState): number {
  return s.answered === 0 ? 0 : s.correct / s.answered;
}

/** Mention pédagogique en fonction du score. */
export function mention(r: number): { label: string; tone: "green" | "yellow" | "danger" } {
  if (r >= 0.9) return { label: "Excellent 🎉", tone: "green" };
  if (r >= 0.75) return { label: "Bien 👍", tone: "green" };
  if (r >= 0.5) return { label: "À consolider", tone: "yellow" };
  return { label: "À revoir", tone: "danger" };
}
