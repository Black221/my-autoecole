/* Registre central des modes de challenge.
   Ajouter un mode = importer son générateur et l'ajouter ici. */
import type { ChallengeKind, ChallengeMode } from "./challenge";
import { recognition } from "./generators/recognition";
import { reverseRecognition } from "./generators/reverseRecognition";
import { category } from "./generators/category";
import { oddOneOut } from "./generators/oddOneOut";
import { coursQuiz } from "./generators/coursQuiz";
import { examBlanc } from "./generators/examBlanc";
import { flashcard } from "./generators/flashcard";

export const MODES: ChallengeMode[] = [
  recognition,
  reverseRecognition,
  category,
  oddOneOut,
  coursQuiz,
  flashcard,
  examBlanc,
];

export const modeByKind = (kind: string): ChallengeMode | undefined =>
  MODES.find((m) => m.kind === kind);

export type { ChallengeKind };
