// The screen deepens as the questions do. Set I is warm and light (morning);
// Set II shifts to dusk; Set III is candlelit and deep — sinking toward the
// 奥底, the very bottom. Backgrounds stay light enough that dark ink text reads
// on all three.

export interface SetTheme {
  /** Full-bleed backdrop gradient classes. */
  backdrop: string;
  /** Accent text colour for the "Set …" label. */
  accent: string;
}

const THEMES: Record<1 | 2 | 3, SetTheme> = {
  1: {
    backdrop: "bg-gradient-to-b from-[#fdf8f2] via-[#fbeee6] to-[#f6e1d7]",
    accent: "text-ember",
  },
  2: {
    backdrop: "bg-gradient-to-b from-[#f7e9e2] via-[#efd6d5] to-[#e4c2c7]",
    accent: "text-emberdark",
  },
  3: {
    backdrop: "bg-gradient-to-b from-[#ecd1ce] via-[#d9b3b9] to-[#c59ba6]",
    accent: "text-emberdark",
  },
};

export function setTheme(set: 1 | 2 | 3): SetTheme {
  return THEMES[set];
}
