/* Examen blanc : séries B01–B12, scène photo avec sous-questions A/B/C/D. */
import type { ChallengeMode, Choice, Question } from "../challenge";
import { series } from "../../data";
import { pickOne, uid } from "../rng";
import { img } from "./helpers";

const LETTERS = ["A", "B", "C", "D"] as const;

export const examBlanc: ChallengeMode = {
  kind: "exam-blanc",
  title: "Examen blanc",
  tagline: "Les vraies séries photo, correction officielle",
  emoji: "📝",
  // Les images de questions (120 Mo) sont référencées mais pas copiées
  // dans /public — voir DATASET.md (copier `tests/` vers `public/tests/`).
  needsAssets: true,
  build({ count = 10, categoryKey } = {}) {
    // categoryKey sert ici d'id de série optionnel (ex: "B03")
    const serie = categoryKey
      ? series.find((s) => s.id === categoryKey) ?? pickOne(series)
      : pickOne(series);
    return serie.questions.slice(0, count).map<Question>((q) => {
      const choices: Choice[] = LETTERS.map((letter) => ({
        id: uid("c"),
        letter,
        label: letter,
        correct: q.answers.includes(letter),
      }));
      return {
        id: uid("exam"),
        kind: "exam-blanc",
        format: "qcm-text",
        prompt: `${serie.title} · Question ${q.n} — coche les bonnes réponses (A/B/C/D).`,
        media: q.image ? { image: img(q.image) } : undefined,
        choices,
        multiple: true,
        explanation: `Bonne(s) réponse(s) : ${q.answers.join(", ") || "aucune"}.`,
        meta: { serie: serie.id, n: q.n },
      };
    });
  },
};
