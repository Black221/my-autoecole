/* Accueil : hero + statistiques + catalogue des modes de challenge. */
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { MODES } from "../domain/modes";
import { MODE_ICON } from "../ui/modeIcons";
import dataset from "../data";
import { Hero } from "../ui/primitives";

export function Home() {
  const navigate = useNavigate();
  const s = dataset.stats;

  const stats = [
    { value: s.panneaux, label: "panneaux" },
    { value: s.questionsCours, label: "quiz cours" },
    { value: s.questionsTest, label: "questions examen" },
  ];

  return (
    <div className="flex-1 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <Hero title="Permis+" subtitle="Prépare ton code de la route, à ton rythme 🇸🇳">
        <div className="mt-4 grid grid-cols-3 gap-2">
          {stats.map((st) => (
            <div
              key={st.label}
              className="rounded-2xl bg-white/12 px-3 py-2.5 backdrop-blur-sm"
            >
              <div className="text-xl font-bold leading-none">{st.value}</div>
              <div className="mt-1 text-[11px] leading-tight text-white/80">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </Hero>

      <div className="px-5 pt-6">
        <h2 className="text-[clamp(20px,5.5vw,24px)] font-bold">
          Modes d'entraînement
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choisis un défi — chaque série est générée à la volée depuis le cours.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => {
            const Icon = MODE_ICON[m.kind];
            return (
              <button
                key={m.kind}
                type="button"
                onClick={() => navigate(`/play/${m.kind}`)}
                className="flex w-full items-center gap-4 rounded-[20px] bg-surface p-4 text-left shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]"
              >
                <span className="grid size-12 flex-none place-items-center rounded-2xl bg-brand-light text-brand">
                  <Icon size={24} strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{m.title}</div>
                  <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                    {m.tagline}
                  </p>
                </div>
                <ChevronRight size={20} className="flex-none text-muted" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
