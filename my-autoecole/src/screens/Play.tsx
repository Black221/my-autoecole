/* Orchestration d'une session : construit les questions depuis le mode,
   affiche le Runner puis les Résultats. */
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { modeByKind } from "../domain/modes";
import { useSession } from "../engine/sessionStore";
import { ChallengeRunner } from "../engine/ChallengeRunner";
import { Results } from "./Results";

export function Play() {
  const { kind = "" } = useParams();
  const navigate = useNavigate();
  const status = useSession((s) => s.status);
  const start = useSession((s) => s.start);
  const reset = useSession((s) => s.reset);
  const mode = modeByKind(kind);

  const begin = useCallback(() => {
    if (!mode) return;
    start(mode.kind, mode.title, mode.build({}));
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
