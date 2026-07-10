/* L'intrus : parmi 4 panneaux, 3 d'une même famille et 1 d'une autre. */
import type { ChallengeMode, Choice, Question } from "../challenge";
import { categories, panneaux } from "../../data";
import { pickOne, sampleWhere, shuffle, uid } from "../rng";
import { img, quizablePanneaux, sample } from "./helpers";

export const oddOneOut: ChallengeMode = {
  kind: "odd-one-out",
  title: "L'intrus",
  tagline: "Repère le panneau d'une autre famille",
  emoji: "🕵️",
  secondsPerQuestion: 25,
  build({ count = 10 } = {}) {
    const pool = quizablePanneaux(panneaux);
    const richCats = categories.filter(
      (c) => pool.filter((p) => p.category === c.key).length >= 3,
    );
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      const cat = pickOne(richCats);
      const family = sample(
        pool.filter((p) => p.category === cat.key),
        3,
      );
      const intruder = pickOne(
        sampleWhere(pool, 1, (p) => p.category === cat.key),
      );
      if (family.length < 3 || !intruder) continue;
      const choices: Choice[] = shuffle([
        ...family.map((p) => ({
          id: uid("c"),
          image: img(p.image),
          label: p.name,
          correct: false,
        })),
        { id: uid("c"), image: img(intruder.image), label: intruder.name, correct: true },
      ]);
      questions.push({
        id: uid("odd"),
        kind: "odd-one-out",
        format: "qcm-image",
        prompt: "Trouve l'intrus : le panneau qui n'est pas de la même famille.",
        choices,
        multiple: false,
        explanation: `L'intrus est « ${intruder.name} » (${intruder.categoryLabel}). Les autres sont de la famille « ${cat.label} ».`,
      });
    }
    return questions;
  },
};
