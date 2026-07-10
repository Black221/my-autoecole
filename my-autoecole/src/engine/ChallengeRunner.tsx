/* Joue n'importe quelle Question : dispatch par format, gère la
   sélection, le chrono, le feedback (pop-up) et l'enchaînement. */
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Flag, X, XCircle } from "lucide-react";
import { useSession } from "./sessionStore";
import { QcmText } from "./renderers/QcmText";
import { QcmImage } from "./renderers/QcmImage";
import { Flashcard } from "./renderers/Flashcard";
import { Button, ProgressBar } from "../ui/primitives";

export function ChallengeRunner({ onExit }: { onExit: () => void }) {
  const { questions, index, commit, next, secondsPerQuestion } = useSession();
  const q = questions[index];

  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const timed = secondsPerQuestion != null && q?.format !== "flashcard";

  useEffect(() => {
    setSelected([]);
    setRevealed(false);
    setOk(false);
    setRemaining(timed ? secondsPerQuestion! : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id]);

  useEffect(() => {
    if (!timed || revealed || remaining == null || remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => (r == null ? null : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [remaining, revealed, timed]);

  useEffect(() => {
    if (timed && !revealed && remaining === 0) {
      const ev = commit(selected);
      setOk(ev.correct);
      setRevealed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  if (!q) return null;

  const total = questions.length;
  const isLast = index === total - 1;
  const timeout = revealed && !ok && remaining === 0;

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

  const urgent = remaining != null && remaining <= 5 && !revealed;
  const mmss =
    remaining == null
      ? ""
      : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  const isQcm = q.format !== "flashcard";

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
        <div className="flex flex-none flex-col items-end gap-1">
          {timed && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums transition-colors ${
                urgent ? "bg-danger-light text-danger" : "bg-brand-light text-brand-dark"
              }`}
            >
              <Clock size={12} strokeWidth={2.5} />
              {mmss}
            </span>
          )}
          <span className="text-[11px] font-semibold text-muted">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      <div className={`flex-1 px-5 ${revealed && isQcm ? "pb-72" : "pb-6"}`}>
        <h2 className="my-4 text-lg font-semibold leading-snug">{q.prompt}</h2>

        <div className="animate-fade-up" key={q.id}>
          {q.format === "flashcard" ? (
            <Flashcard question={q} onEval={onFlashEval} />
          ) : q.format === "qcm-image" ? (
            <QcmImage question={q} selected={selected} revealed={revealed} onToggle={toggle} />
          ) : (
            <QcmText question={q} selected={selected} revealed={revealed} onToggle={toggle} />
          )}
        </div>
      </div>

      {/* Barre de validation (avant réponse) */}
      {isQcm && !revealed && (
        <div className="sticky bottom-0 flex gap-3 bg-linear-to-t from-canvas from-70% to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <Button variant="primary" disabled={selected.length === 0} onClick={validate}>
            {q.multiple ? "Valider ma réponse" : "Valider"}
          </Button>
        </div>
      )}

      {/* Pop-up de feedback (après réponse) */}
      {isQcm && revealed && (
        <div className="fixed inset-0 z-40">
          <div className="animate-backdrop absolute inset-0 bg-black/25" />
          <div className="animate-sheet-up absolute inset-x-0 bottom-0 mx-auto max-w-[720px]">
            <div className="rounded-t-[24px] bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,27,20,0.16)]">
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
              <div
                className={`flex items-center gap-2 text-base font-bold ${
                  ok ? "text-brand" : "text-danger"
                }`}
              >
                {ok ? <CheckCircle2 size={22} /> : timeout ? <Clock size={22} /> : <XCircle size={22} />}
                {ok ? "Bonne réponse" : timeout ? "Temps écoulé" : "Réponse incorrecte"}
              </div>
              {q.explanation && (
                <p className="mt-2 max-h-[38vh] overflow-y-auto text-[15px] leading-relaxed text-ink-soft">
                  {q.explanation}
                </p>
              )}
              <Button className="mt-4" variant="primary" onClick={next}>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
