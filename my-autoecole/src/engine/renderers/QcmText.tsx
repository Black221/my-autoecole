/* Renderer QCM texte : média optionnel + liste de choix textuels. */
import { Check, X } from "lucide-react";
import type { Question } from "../../domain/challenge";

export function QcmText({
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
    <div className="space-y-4">
      {question.media?.image && (
        <div className="flex justify-center rounded-[20px] bg-surface p-5 shadow-soft">
          <img
            src={question.media.image}
            alt=""
            className="max-h-[38vh] w-auto max-w-full object-contain"
          />
        </div>
      )}
      <div className="space-y-3">
        {question.choices.map((c) => {
          const isSel = selected.includes(c.id);
          const showCorrect = revealed && c.correct;
          const showWrong = revealed && isSel && !c.correct;

          let box = "border-line bg-surface";
          let mark = "border-line text-muted";
          if (showCorrect) {
            box = "border-brand bg-brand-light";
            mark = "border-brand bg-brand text-white";
          } else if (showWrong) {
            box = "border-danger bg-danger-light";
            mark = "border-danger bg-danger text-white";
          } else if (isSel) {
            box = "border-brand bg-brand-light";
            mark = "border-brand bg-brand text-white";
          }

          return (
            <button
              key={c.id}
              type="button"
              disabled={revealed}
              onClick={() => onToggle(c.id)}
              className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-[15px] font-medium text-ink transition-all active:scale-[0.99] disabled:active:scale-100 ${box}`}
            >
              <span
                className={`grid size-7 flex-none place-items-center rounded-full border-2 text-[13px] font-bold ${mark}`}
              >
                {c.letter ? (
                  c.letter
                ) : showCorrect || isSel ? (
                  <Check size={15} strokeWidth={3} />
                ) : showWrong ? (
                  <X size={15} strokeWidth={3} />
                ) : (
                  ""
                )}
              </span>
              <span className="min-w-0">{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
