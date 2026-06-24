"use client";

import { initials, seatColor } from "@/lib/people";
import type { Seat } from "@/lib/types";

export function Avatar({
  name,
  seat,
  active = false,
  size = "md",
}: {
  name: string | null | undefined;
  seat: Seat;
  active?: boolean;
  size?: "sm" | "md";
}) {
  const colors = seatColor(seat);
  const dim = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full font-medium ${colors.bg} ${dim}`}
      >
        {initials(name)}
      </span>
      {active && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-emerald-500" />
      )}
    </span>
  );
}

/** The two of you, side by side — a small reminder you're doing this together. */
export function Pair({
  aName,
  bName,
  activeSeat,
}: {
  aName: string | null;
  bName: string | null;
  activeSeat?: Seat | null;
}) {
  return (
    <span className="inline-flex items-center -space-x-2">
      <Avatar name={aName} seat="a" size="sm" active={activeSeat === "a"} />
      <Avatar name={bName} seat="b" size="sm" active={activeSeat === "b"} />
    </span>
  );
}
