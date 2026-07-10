/* Reconnaissance inverse : un nom → choisir la bonne image (QCM image). */
import type { ChallengeMode, Question } from "../challenge";
import { panneaux } from "../../data";
import { uid } from "../rng";
import { imageChoices, quizablePanneaux, sample } from "./helpers";

export const reverseRecognition: ChallengeMode = {
  kind: "reverse-recognition",
  title: "Trouve le panneau",
  tagline: "Une signification, choisis le bon panneau",
  emoji: "🔎",
  secondsPerQuestion: 20,
  build({ count = 12, categoryKey } = {}) {
    const pool = quizablePanneaux(panneaux);
    const base = categoryKey ? pool.filter((p) => p.category === categoryKey) : pool;
    const picks = sample(base, count);
    return picks.map<Question>((p) => ({
      id: uid("rev"),
      kind: "reverse-recognition",
      format: "qcm-image",
      prompt: `Quel panneau signifie : « ${p.name} » ?`,
      choices: imageChoices(p, pool),
      multiple: false,
      explanation: `${p.code} — ${p.name} (${p.categoryLabel}).`,
      meta: { panneauId: p.id },
    }));
  },
};
