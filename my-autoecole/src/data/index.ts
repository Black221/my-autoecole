// Point d'entrée typé du dataset "code de la route".
// Généré/alimenté par scripts/build_panneaux.py, scripts/build_tests.py et cours.json.
import panneauxData from "./panneaux.json";
import testsData from "./tests.json";
import coursData from "./cours.json";

/* ------------------------------------------------------------------ */
/* Panneaux                                                            */
/* ------------------------------------------------------------------ */

export type CategorieKey =
  | "danger"
  | "intersection"
  | "interdiction"
  | "obligation"
  | "zone"
  | "fin"
  | "indication"
  | "services"
  | "localisation"
  | "direction"
  | "balise"
  | "passage_niveau"
  | "temporaire";

export interface Panneau {
  /** Identifiant unique (= code, suffixé si variantes : B14-50, C14-1...) */
  id: string;
  /** Code officiel du panneau (A1a, B1, AB4, ...) */
  code: string;
  /** Nom / signification */
  name: string;
  category: CategorieKey;
  categoryLabel: string;
  /** Chemin de l'image servie depuis /public (ex: "panneaux/A1a.jpeg") */
  image: string;
  source: { page: number; index: number };
}

export interface Categorie {
  key: CategorieKey;
  label: string;
  count: number;
}

export const panneaux: Panneau[] = panneauxData.panneaux as Panneau[];
export const categories: Categorie[] = panneauxData.categories as Categorie[];

export const panneauxParCategorie = (key: CategorieKey): Panneau[] =>
  panneaux.filter((p) => p.category === key);

export const panneauById = (id: string): Panneau | undefined =>
  panneaux.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/* Tests (examens blancs QCM photo A/B/C/D)                            */
/* ------------------------------------------------------------------ */

export type Lettre = "A" | "B" | "C" | "D";

export interface QuestionTest {
  n: number;
  /** Chemin de l'image de la question (relatif à `tests/`, à servir) */
  image: string | null;
  /** Lettres correctes parmi A/B/C/D */
  answers: Lettre[];
}

export interface SerieTest {
  id: string;
  title: string;
  cover: string | null;
  questionCount: number;
  questions: QuestionTest[];
  missingImages: number[];
}

export const series: SerieTest[] = testsData.series as SerieTest[];

export const serieById = (id: string): SerieTest | undefined =>
  series.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* Cours (fiches + QCM de connaissance)                                */
/* ------------------------------------------------------------------ */

export interface ThemeCours {
  id: string;
  titre: string;
  resume: string;
  regles: string[];
}

export interface QuestionCours {
  id: string;
  theme: string;
  question: string;
  options: string[];
  /** Indices (0-based) des bonnes réponses (peut être multiple) */
  correct: number[];
  explanation: string;
}

export const themes: ThemeCours[] = coursData.themes as ThemeCours[];
export const quizCours: QuestionCours[] = coursData.quiz as QuestionCours[];

export const themeById = (id: string): ThemeCours | undefined =>
  themes.find((t) => t.id === id);

export const quizParTheme = (themeId: string): QuestionCours[] =>
  quizCours.filter((q) => q.theme === themeId);

/* ------------------------------------------------------------------ */
/* Agrégat + statistiques                                              */
/* ------------------------------------------------------------------ */

export const dataset = {
  panneaux,
  categories,
  series,
  themes,
  quizCours,
  stats: {
    panneaux: panneaux.length,
    categories: categories.length,
    seriesTest: series.length,
    questionsTest: series.reduce((n, s) => n + s.questionCount, 0),
    themesCours: themes.length,
    questionsCours: quizCours.length,
  },
};

export default dataset;
