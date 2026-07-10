/* ============================================================
   Modèle cœur du moteur de challenges.

   Idée directrice : QUEL QUE SOIT le type de challenge, toute
   question se normalise en une même forme `Question`. Un unique
   `ChallengeRunner` sait alors jouer n'importe quel type, et
   ajouter un nouveau mode = écrire un générateur qui produit des
   `Question`.
   ============================================================ */

export type ChallengeKind =
  | "recognition" // image de panneau → nom (QCM texte)
  | "reverse-recognition" // nom → bonne image (QCM image)
  | "category" // panneau → sa famille (QCM texte)
  | "odd-one-out" // 4 images, trouver l'intrus (QCM image)
  | "cours-quiz" // question de connaissance (QCM texte, mono/multi)
  | "exam-blanc" // scène photo → sous-questions A/B/C/D (multi)
  | "flashcard"; // révision recto/verso (auto-évaluation)

/** Format d'affichage → sélectionne le renderer. */
export type QuestionFormat = "qcm-text" | "qcm-image" | "flashcard";

export interface Choice {
  id: string;
  /** Libellé texte (choix textuel) */
  label?: string;
  /** Image du choix (choix visuel) — chemin servi depuis /public */
  image?: string;
  /** Lettre affichée (examens blancs : A/B/C/D) */
  letter?: string;
  correct: boolean;
}

export interface Question {
  id: string;
  kind: ChallengeKind;
  format: QuestionFormat;
  /** Consigne affichée à l'utilisateur. */
  prompt: string;
  /** Média de la question (panneau à reconnaître, scène photo…). */
  media?: { image?: string };
  /** Choix proposés (vide pour une flashcard). */
  choices: Choice[];
  /** La question admet-elle plusieurs bonnes réponses ? */
  multiple: boolean;
  /** Explication montrée après la réponse. */
  explanation?: string;
  /** Contenu recto/verso pour les flashcards. */
  flip?: { front: string; back: string; image?: string };
  /** Métadonnées libres (ex: id du panneau source). */
  meta?: Record<string, unknown>;
}

/** Réponse de l'utilisateur : identifiants des choix sélectionnés.
 *  Flashcard : ["known"] ou ["unknown"]. */
export type Answer = string[];

export interface Evaluation {
  correct: boolean;
  correctChoiceIds: string[];
  selected: Answer;
}

/** Évalue une réponse contre les bons choix (mono ou multi). */
export function evaluate(q: Question, selected: Answer): Evaluation {
  if (q.kind === "flashcard") {
    return {
      correct: selected[0] === "known",
      correctChoiceIds: ["known"],
      selected,
    };
  }
  const correctIds = q.choices.filter((c) => c.correct).map((c) => c.id);
  const sameLength = correctIds.length === selected.length;
  const allMatch = correctIds.every((id) => selected.includes(id));
  return { correct: sameLength && allMatch, correctChoiceIds: correctIds, selected };
}

/* ---- Registre des modes ---- */

export interface BuildOptions {
  /** Nombre de questions souhaité. */
  count?: number;
  /** Restreindre à une catégorie de panneaux (selon le mode). */
  categoryKey?: string;
  /** Restreindre le quiz de cours à un thème (id de thème). */
  themeId?: string;
}

export interface ChallengeMode {
  kind: ChallengeKind;
  title: string;
  tagline: string;
  emoji: string;
  /** Le mode nécessite-t-il des assets non encore disponibles ? */
  needsAssets?: boolean;
  /** Temps imparti par question (secondes). Absent = pas de chrono. */
  secondsPerQuestion?: number;
  /** Construit une session de questions depuis le dataset. */
  build(options?: BuildOptions): Question[];
}

/** Collecte toutes les URLs d'images d'une liste de questions (préchargement). */
export function collectImages(questions: Question[]): string[] {
  const urls = new Set<string>();
  for (const q of questions) {
    if (q.media?.image) urls.add(q.media.image);
    if (q.flip?.image) urls.add(q.flip.image);
    for (const c of q.choices) if (c.image) urls.add(c.image);
  }
  return [...urls];
}
