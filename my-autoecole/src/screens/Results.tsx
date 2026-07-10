/* Écran de résultats d'une session. */
import { useNavigate } from "react-router-dom";
import { Flame, Grid2x2, ListChecks, RotateCcw, Target } from "lucide-react";
import { useSession } from "../engine/sessionStore";
import { mention, ratio } from "../domain/scoring";
import { Badge, Button, Card, Screen } from "../ui/primitives";

export function Results({ onReplay }: { onReplay: () => void }) {
  const navigate = useNavigate();
  const { score, modeTitle, reset } = useSession();
  const r = ratio(score);
  const pct = Math.round(r * 100);
  const m = mention(r);

  const goHome = () => {
    reset();
    navigate("/");
  };

  const rows = [
    { icon: Target, label: "Bonnes réponses", value: `${score.correct}` },
    { icon: Flame, label: "Meilleure série", value: `${score.bestStreak}` },
    { icon: ListChecks, label: "Total", value: `${score.answered}` },
  ];

  return (
    <Screen>
      <div className="mt-5 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {modeTitle}
        </span>
        <h1 className="mt-2 text-[clamp(26px,7vw,32px)] font-bold">
          Session terminée
        </h1>
      </div>

      <div
        className="score-ring mx-auto my-6 grid size-40 place-items-center rounded-full"
        style={{ ["--pct" as string]: `${pct}%` }}
      >
        <div className="grid size-32 place-items-center rounded-full bg-surface text-center">
          <div>
            <div className="text-[32px] font-bold leading-none text-brand-dark">
              {pct}%
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              {score.correct}/{score.answered}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Badge tone={m.tone}>{m.label}</Badge>
      </div>

      <Card className="mt-6 p-0!">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center gap-3 px-5 py-4 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <row.icon size={18} className="text-brand" />
            <span className="flex-1 text-[15px]">{row.label}</span>
            <b>{row.value}</b>
          </div>
        ))}
      </Card>

      <div className="mt-6 space-y-3">
        <Button variant="primary" onClick={onReplay}>
          <RotateCcw size={18} /> Rejouer ce mode
        </Button>
        <Button variant="tonal" onClick={goHome}>
          <Grid2x2 size={18} /> Autres modes
        </Button>
      </div>
    </Screen>
  );
}
