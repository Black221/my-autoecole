/* Renderer QCM image : grille 2×2 de panneaux à choisir. */
import { Check, X } from "lucide-react";
import type { Question } from "../../domain/challenge";

export function QcmImage({
  question,
  selected,
  revealed,
  onToggle,
}: {
  question: Question;
  selected: string[];
  revealed: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.choices.map((c) => {
        const isSel = selected.includes(c.id);
        const showCorrect = revealed && c.correct;
        const showWrong = revealed && isSel && !c.correct;

        let box = "border-line";
        if (showCorrect) box = "border-brand ring-4 ring-brand-light";
        else if (showWrong) box = "border-danger ring-4 ring-danger-light";
        else if (isSel) box = "border-brand";

        return (
          <button
            key={c.id}
            type="button"
            disabled={revealed}
            onClick={() => onToggle(c.id)}
            aria-label={c.label}
            className={`relative grid aspect-square place-items-center rounded-[20px] border-2 bg-surface p-4 transition-all active:scale-[0.98] disabled:active:scale-100 ${box}`}
          >
            {showCorrect && (
              <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-brand text-white">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
            {showWrong && (
              <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-danger text-white">
                <X size={14} strokeWidth={3} />
              </span>
            )}
            <img
              src={c.image}
              alt={revealed ? c.label : ""}
              className="max-h-full max-w-full object-contain"
            />
          </button>
        );
      })}
    </div>
  );
}
