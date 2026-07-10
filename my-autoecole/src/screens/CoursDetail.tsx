/* Fiche de cours : règles d'un thème + entraînement ciblé. */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { quizParTheme, themeById } from "../data";
import { themeIcon } from "../ui/themeIcons";
import { Button, Hero } from "../ui/primitives";

export function CoursDetail() {
  const { themeId = "" } = useParams();
  const navigate = useNavigate();
  const theme = themeById(themeId);

  useEffect(() => {
    if (!theme) navigate("/cours", { replace: true });
  }, [theme, navigate]);

  if (!theme) return null;

  const Icon = themeIcon(theme.id);
  const quizCount = quizParTheme(theme.id).length;

  return (
    <div className="flex flex-1 flex-col pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <Hero title={theme.titre} onBack={() => navigate("/cours")}>
        <div className="mt-3 flex items-start gap-3">
          <span className="grid size-11 flex-none place-items-center rounded-2xl bg-white/15">
            <Icon size={22} />
          </span>
          <p className="text-sm leading-relaxed text-white/90">{theme.resume}</p>
        </div>
      </Hero>

      <div className="flex-1 space-y-3 px-5 pt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          {theme.regles.length} points à retenir
        </div>
        {theme.regles.map((regle, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-[20px] bg-surface p-4 shadow-soft"
          >
            <span className="grid size-7 flex-none place-items-center rounded-full bg-brand-light text-[13px] font-bold text-brand-dark">
              {i + 1}
            </span>
            <p className="text-[15px] leading-relaxed text-ink">{regle}</p>
          </div>
        ))}
      </div>

      {quizCount > 0 && (
        <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <Button
            variant="primary"
            onClick={() => navigate(`/play/cours-quiz?theme=${theme.id}`)}
          >
            <Dumbbell size={18} /> S'entraîner sur ce thème
          </Button>
        </div>
      )}
    </div>
  );
}
