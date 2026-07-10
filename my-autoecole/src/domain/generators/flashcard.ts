/* Flashcards : révision libre recto (image) / verso (nom + code). */
import type { ChallengeMode, Question } from "../challenge";
import { panneaux } from "../../data";
import { uid } from "../rng";
import { img, quizablePanneaux, sample } from "./helpers";

export const flashcard: ChallengeMode = {
  kind: "flashcard",
  title: "Flashcards",
  tagline: "Révise à ton rythme, retourne la carte",
  emoji: "🃏",
  build({ count = 15, categoryKey } = {}) {
    const pool = quizablePanneaux(panneaux);
    const base = categoryKey ? pool.filter((p) => p.category === categoryKey) : pool;
    const picks = sample(base, count);
    return picks.map<Question>((p) => ({
      id: uid("flash"),
      kind: "flashcard",
      format: "flashcard",
      prompt: "Connais-tu ce panneau ?",
      choices: [],
      multiple: false,
      flip: {
        front: "Quel est ce panneau ?",
        back: `${p.name}\n${p.code} · ${p.categoryLabel}`,
        image: img(p.image),
      },
      meta: { panneauId: p.id },
    }));
  },
};
