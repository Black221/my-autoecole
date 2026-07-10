/* Sommaire du cours : liste des thèmes à apprendre. */
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { themes } from "../data";
import { themeIcon } from "../ui/themeIcons";
import { Hero, TopBar } from "../ui/primitives";

export function CoursIndex() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <TopBar onBack={() => navigate("/")} />
      <Hero title="Le cours" subtitle={`${themes.length} thèmes pour tout maîtriser`} />

      <div className="space-y-3 px-5 pt-5">
        {themes.map((t, i) => {
          const Icon = themeIcon(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/cours/${t.id}`)}
              className="flex w-full items-center gap-4 rounded-[20px] bg-surface p-4 text-left shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]"
            >
              <span className="grid size-12 flex-none place-items-center rounded-2xl bg-brand-light text-brand">
                <Icon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-semibold">{t.titre}</span>
                </div>
                <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                  {t.resume}
                </p>
              </div>
              <ChevronRight size={20} className="flex-none text-muted" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
