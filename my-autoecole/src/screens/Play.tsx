/* Orchestration d'une session : construit les questions, précharge les
   images (écran de chargement) puis joue la session et affiche le résultat. */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { modeByKind } from "../domain/modes";
import { collectImages } from "../domain/challenge";
import { useSession } from "../engine/sessionStore";
import { preloadImages } from "../engine/preload";
import { ChallengeRunner } from "../engine/ChallengeRunner";
import { Results } from "./Results";
import { Loading } from "./Loading";

export function Play() {
  const { kind = "" } = useParams();
  const navigate = useNavigate();
  const status = useSession((s) => s.status);
  const start = useSession((s) => s.start);
  const reset = useSession((s) => s.reset);
  const mode = modeByKind(kind);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const begin = useCallback(async () => {
    if (!mode) return;
    setLoading(true);
    setProgress(0);
    const questions = mode.build({});
    await preloadImages(collectImages(questions), 8000, (l, t) =>
      setProgress(t ? l / t : 1),
    );
    start(mode.kind, mode.title, questions, mode.secondsPerQuestion ?? null);
    setLoading(false);
  }, [mode, start]);

  useEffect(() => {
    if (!mode) {
      navigate("/", { replace: true });
      return;
    }
    begin();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  if (!mode) return null;
  if (loading) return <Loading title={mode.title} progress={progress} />;
  if (status === "finished") return <Results onReplay={begin} />;
  if (status === "running")
    return (
      <ChallengeRunner
        onExit={() => {
          reset();
          navigate("/");
        }}
      />
    );
  return null;
}
