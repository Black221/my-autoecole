/* Catégorie : à quelle famille appartient ce panneau ? (QCM texte) */
import type { ChallengeMode, Choice, Question } from "../challenge";
import { categories, panneaux } from "../../data";
import { sampleWhere, shuffle, uid } from "../rng";
import { img, quizablePanneaux, sample } from "./helpers";

export const category: ChallengeMode = {
  kind: "category",
  title: "Les familles",
  tagline: "Classe chaque panneau dans sa catégorie",
  emoji: "🗂️",
  secondsPerQuestion: 15,
  build({ count = 12 } = {}) {
    const pool = quizablePanneaux(panneaux);
    const picks = sample(pool, count);
    return picks.map<Question>((p) => {
      const wrong = sampleWhere(categories, 3, (c) => c.key === p.category);
      const choices: Choice[] = shuffle([
        { id: uid("c"), label: p.categoryLabel, correct: true },
        ...wrong.map((c) => ({ id: uid("c"), label: c.label, correct: false })),
      ]);
      return {
        id: uid("cat"),
        kind: "category",
        format: "qcm-text",
        prompt: "À quelle famille appartient ce panneau ?",
        media: { image: img(p.image) },
        choices,
        multiple: false,
        explanation: `${p.code} — ${p.name} : famille « ${p.categoryLabel} ».`,
        meta: { panneauId: p.id },
      };
    });
  },
};
