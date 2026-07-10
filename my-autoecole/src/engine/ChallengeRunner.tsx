/* Joue n'importe quelle Question : dispatch par format, gère la
   sélection, la validation, le feedback et l'enchaînement. */
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Flag, X, XCircle } from "lucide-react";
import { useSession } from "./sessionStore";
import { QcmText } from "./renderers/QcmText";
import { QcmImage } from "./renderers/QcmImage";
import { Flashcard } from "./renderers/Flashcard";
import { Button, ProgressBar } from "../ui/primitives";

export function ChallengeRunner({ onExit }: { onExit: () => void }) {
  const { questions, index, commit, next } = useSession();
  const q = questions[index];

  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setSelected([]);
    setRevealed(false);
    setOk(false);
  }, [q?.id]);

  if (!q) return null;

  const total = questions.length;
  const isLast = index === total - 1;

  const toggle = (id: string) => {
    if (revealed) return;
    setSelected((prev) => {
      if (q.multiple) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return [id];
    });
  };

  const validate = () => {
    const ev = commit(selected);
    setOk(ev.correct);
    setRevealed(true);
  };

  const onFlashEval = (known: boolean) => {
    commit(known ? ["known"] : ["unknown"]);
    next();
  };

  return (
    <>
      <div className="flex items-center gap-3 px-5 pb-3 pt-[calc(1rem+env(safe-area-inset-top))]">
        <button
          onClick={onExit}
          aria-label="Quitter"
          className="grid size-10 flex-none place-items-center rounded-full bg-surface text-ink-soft shadow-soft active:scale-95"
        >
          <X size={18} />
        </button>
        <ProgressBar value={total ? index / total : 0} />
        <span className="flex-none text-sm font-semibold text-muted">
          {index + 1}/{total}
        </span>
      </div>

      <div className="flex-1 px-5 pb-6">
        <h2 className="my-4 text-lg font-semibold leading-snug">{q.prompt}</h2>

        <div className="animate-fade-up" key={q.id}>
          {q.format === "flashcard" ? (
            <Flashcard question={q} onEval={onFlashEval} />
          ) : q.format === "qcm-image" ? (
            <QcmImage
              question={q}
              selected={selected}
              revealed={revealed}
              onToggle={toggle}
            />
          ) : (
            <QcmText
              question={q}
              selected={selected}
              revealed={revealed}
              onToggle={toggle}
            />
          )}
        </div>

        {revealed && q.explanation && (
          <div
            className={`mt-4 flex gap-2 rounded-[20px] p-4 text-sm leading-relaxed animate-fade-up ${
              ok
                ? "bg-brand-light text-brand-dark"
                : "bg-danger-light text-[#8f1419]"
            }`}
          >
            <span className="mt-0.5 flex-none">
              {ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </span>
            <div>
              <b className="mb-0.5 block">
                {ok ? "Bonne réponse" : "Réponse incorrecte"}
              </b>
              {q.explanation}
            </div>
          </div>
        )}
      </div>

      {q.format !== "flashcard" && (
        <div className="sticky bottom-0 flex gap-3 bg-linear-to-t from-canvas from-70% to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          {!revealed ? (
            <Button variant="primary" disabled={selected.length === 0} onClick={validate}>
              {q.multiple ? "Valider ma réponse" : "Valider"}
            </Button>
          ) : (
            <Button variant="primary" onClick={next}>
              {isLast ? (
                <>
                  <Flag size={18} /> Voir le résultat
                </>
              ) : (
                <>
                  Question suivante <ArrowRight size={18} />
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
