/* Reconnaissance : image de panneau → deviner son nom (QCM texte). */
import type { ChallengeMode, Question } from "../challenge";
import { panneaux } from "../../data";
import { uid } from "../rng";
import { img, quizablePanneaux, sample, textChoices } from "./helpers";

export const recognition: ChallengeMode = {
  kind: "recognition",
  title: "Reconnaissance",
  tagline: "Un panneau s'affiche, trouve sa signification",
  emoji: "🚸",
  secondsPerQuestion: 20,
  build({ count = 12, categoryKey } = {}) {
    const pool = quizablePanneaux(panneaux);
    const base = categoryKey ? pool.filter((p) => p.category === categoryKey) : pool;
    const picks = sample(base, count);
    return picks.map<Question>((p) => ({
      id: uid("reco"),
      kind: "recognition",
      format: "qcm-text",
      prompt: "Quel est ce panneau ?",
      media: { image: img(p.image) },
      choices: textChoices(p, pool, (x) => x.name),
      multiple: false,
      explanation: `${p.code} — ${p.name} (${p.categoryLabel}).`,
      meta: { panneauId: p.id },
    }));
  },
};
