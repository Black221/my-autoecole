/* Renderer flashcard : carte retournable 3D, auto-évaluation.
   Le flip est réinitialisé à chaque nouvelle carte (question.id). */
import { useEffect, useState } from "react";
import { RotateCw, ThumbsUp } from "lucide-react";
import type { Question } from "../../domain/challenge";
import { Button } from "../../ui/primitives";

export function Flashcard({
  question,
  onEval,
}: {
  question: Question;
  onEval: (known: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const flip = question.flip!;
  const [name, sub] = flip.back.split("\n");

  // Sécurité : repart toujours face avant quand la carte change.
  useEffect(() => {
    setFlipped(false);
  }, [question.id]);

  return (
    <div className="space-y-5">
      <div className="flip3d">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={`flip3d-inner block min-h-[320px] w-full ${flipped ? "flipped" : ""}`}
          aria-label="Retourner la carte"
        >
          {/* Face avant */}
          <div className="flip3d-face grid place-items-center rounded-[24px] bg-surface p-6 shadow-soft">
            {flip.image && (
              <img
                src={flip.image}
                alt=""
                className="max-h-[220px] max-w-[70%] object-contain"
              />
            )}
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
              <RotateCw size={15} /> Touche pour retourner
            </span>
          </div>
          {/* Face arrière */}
          <div className="flip3d-face flip3d-back grid place-items-center rounded-[24px] bg-linear-to-br from-brand to-brand-dark p-6 text-center text-white">
            <div>
              <div className="text-xl font-bold">{name}</div>
              <div className="mt-1 text-white/85">{sub}</div>
            </div>
          </div>
        </button>
      </div>

      {flipped && (
        <div className="flex gap-3 animate-fade-up">
          <Button variant="danger" onClick={() => onEval(false)}>
            <RotateCw size={18} /> À revoir
          </Button>
          <Button variant="primary" onClick={() => onEval(true)}>
            <ThumbsUp size={18} /> Je savais
          </Button>
        </div>
      )}
    </div>
  );
}
