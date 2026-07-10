/* Helpers partagés par les générateurs. */
import type { Choice } from "../challenge";
import type { Panneau } from "../../data";
import { sample, sampleWhere, shuffle, uid } from "../rng";

/** URL servie depuis /public (les JSON stockent "panneaux/A1a.jpeg"). */
export const img = (path: string) => `/${path}`;

/** Panneaux dont le nom est exploitable pour un QCM (évite les libellés vagues). */
export function quizablePanneaux(all: Panneau[]): Panneau[] {
  const vague = /Autres (dangers|interdictions|obligations)|Indications diverses/i;
  return all.filter((p) => !vague.test(p.name));
}

/** Construit 4 choix texte : la bonne réponse + 3 distracteurs (même
 *  catégorie en priorité pour la difficulté). */
export function textChoices(
  correct: Panneau,
  pool: Panneau[],
  label: (p: Panneau) => string,
): Choice[] {
  let distractors = sampleWhere(
    pool,
    3,
    (p) => p.category !== correct.category || label(p) === label(correct),
  );
  if (distractors.length < 3) {
    const extra = sampleWhere(
      pool,
      3 - distractors.length,
      (p) => p.id === correct.id || distractors.some((d) => d.id === p.id) || label(p) === label(correct),
    );
    distractors = [...distractors, ...extra];
  }
  const choices: Choice[] = [
    { id: uid("c"), label: label(correct), correct: true },
    ...distractors.map((d) => ({ id: uid("c"), label: label(d), correct: false })),
  ];
  return shuffle(choices);
}

/** Construit 4 choix image : la bonne + 3 distracteurs (même catégorie). */
export function imageChoices(correct: Panneau, pool: Panneau[]): Choice[] {
  let distractors = sampleWhere(
    pool,
    3,
    (p) => p.id === correct.id || p.category !== correct.category,
  );
  if (distractors.length < 3) {
    const extra = sampleWhere(
      pool,
      3 - distractors.length,
      (p) => p.id === correct.id || distractors.some((d) => d.id === p.id),
    );
    distractors = [...distractors, ...extra];
  }
  const choices: Choice[] = [
    { id: uid("c"), image: img(correct.image), correct: true, label: correct.name },
    ...distractors.map((d) => ({
      id: uid("c"),
      image: img(d.image),
      correct: false,
      label: d.name,
    })),
  ];
  return shuffle(choices);
}

export { sample };
