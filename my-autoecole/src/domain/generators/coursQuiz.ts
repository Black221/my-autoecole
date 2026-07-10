/* QCM de connaissance : questions issues du cours (cours.json). */
import type { ChallengeMode, Choice, Question } from "../challenge";
import { quizCours, themeById } from "../../data";
import { sample, shuffle, uid } from "../rng";

export const coursQuiz: ChallengeMode = {
  kind: "cours-quiz",
  title: "Quiz du cours",
  tagline: "Règles, vitesses, priorités, distances…",
  emoji: "📚",
  secondsPerQuestion: 30,
  build({ count = 12, themeId } = {}) {
    const pool = themeId ? quizCours.filter((q) => q.theme === themeId) : quizCours;
    const picks = sample(pool, count);
    return picks.map<Question>((q) => {
      const choices: Choice[] = shuffle(
        q.options.map((opt, i) => ({
          id: uid("c"),
          label: opt,
          correct: q.correct.includes(i),
        })),
      );
      const theme = themeById(q.theme);
      return {
        id: uid("cours"),
        kind: "cours-quiz",
        format: "qcm-text",
        prompt: q.question,
        choices,
        multiple: q.correct.length > 1,
        explanation: q.explanation,
        meta: { theme: theme?.titre ?? q.theme },
      };
    });
  },
};
