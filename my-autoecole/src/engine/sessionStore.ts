/* État d'une session de challenge (file de questions, réponses, score). */
import { create } from "zustand";
import type { Answer, ChallengeKind, Evaluation, Question } from "../domain/challenge";
import { evaluate } from "../domain/challenge";
import { applyResult, emptyScore, type ScoreState } from "../domain/scoring";

export type SessionStatus = "idle" | "running" | "finished";

interface SessionState {
  status: SessionStatus;
  modeKind: ChallengeKind | null;
  modeTitle: string;
  questions: Question[];
  index: number;
  results: Record<string, Evaluation>;
  score: ScoreState;

  start(kind: ChallengeKind, title: string, questions: Question[]): void;
  /** Évalue et enregistre la réponse à la question courante. */
  commit(selected: Answer): Evaluation;
  next(): void;
  reset(): void;
}

export const useSession = create<SessionState>((set, get) => ({
  status: "idle",
  modeKind: null,
  modeTitle: "",
  questions: [],
  index: 0,
  results: {},
  score: emptyScore,

  start(kind, title, questions) {
    set({
      status: questions.length ? "running" : "finished",
      modeKind: kind,
      modeTitle: title,
      questions,
      index: 0,
      results: {},
      score: emptyScore,
    });
  },

  commit(selected) {
    const { questions, index, results, score } = get();
    const q = questions[index];
    const ev = evaluate(q, selected);
    set({
      results: { ...results, [q.id]: ev },
      score: applyResult(score, ev),
    });
    return ev;
  },

  next() {
    const { index, questions } = get();
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      set({ status: "finished" });
    } else {
      set({ index: nextIndex });
    }
  },

  reset() {
    set({
      status: "idle",
      modeKind: null,
      modeTitle: "",
      questions: [],
      index: 0,
      results: {},
      score: emptyScore,
    });
  },
}));
