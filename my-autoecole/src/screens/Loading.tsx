/* Écran de chargement (préchargement des images d'une série). */
import { Loader2 } from "lucide-react";
import { ProgressBar } from "../ui/primitives";

export function Loading({
  title,
  progress,
}: {
  title: string;
  progress: number;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="grid size-20 place-items-center rounded-3xl bg-brand-light text-brand">
        <Loader2 size={36} className="animate-spin" />
      </div>
      <h1 className="mt-6 text-xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-ink-soft">Préparation de la série…</p>
      <div className="mt-6 w-full max-w-xs">
        <ProgressBar value={progress} />
        <div className="mt-2 text-xs font-semibold text-muted">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
