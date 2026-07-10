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

/** Teinte (fond + icône) par mode, pour égayer le catalogue. */
export const MODE_ACCENT: Record<ChallengeKind, string> = {
  recognition: "bg-brand-light text-brand",
  "reverse-recognition": "bg-[#e5eef8] text-[#2f7dbc]",
  category: "bg-teranga-light text-teranga",
  "odd-one-out": "bg-[#efe7fb] text-[#7c4dff]",
  "cours-quiz": "bg-[#e6f2f6] text-[#2593a6]",
  flashcard: "bg-[#fdecec] text-danger",
  "exam-blanc": "bg-[#fff4cc] text-[#8a6d00]",
};
