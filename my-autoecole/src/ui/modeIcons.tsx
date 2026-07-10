/* Association mode de challenge → icône lucide (design moderne, sans emoji). */
import {
  BookOpen,
  ClipboardCheck,
  FolderTree,
  Images,
  Layers,
  ScanSearch,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import type { ChallengeKind } from "../domain/challenge";

export const MODE_ICON: Record<ChallengeKind, LucideIcon> = {
  recognition: ScanSearch,
  "reverse-recognition": Images,
  category: FolderTree,
  "odd-one-out": SearchX,
  "cours-quiz": BookOpen,
  flashcard: Layers,
  "exam-blanc": ClipboardCheck,
};
