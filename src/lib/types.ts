import type { Timestamp } from "firebase/firestore";

export type Seat = "a" | "b";
export type RevealMode = "volley" | "sealed";
export type Timing = "apart"; // "together" parked for v1.1
export type SessionStatus = "waiting" | "active" | "complete";

export interface Settings {
  timing: Timing;
  reveal: RevealMode;
  /** Question pack id. Absent on legacy sessions → treated as "aron". */
  pack?: string;
}

export interface SeatState {
  uid: string | null;
  name: string | null;
  joinedAt: Timestamp | null;
  /** Highest question number (1-36) this seat has answered. 0 = none yet. */
  lastAnswered: number;
  finished: boolean;
  /** The question number whose partner answer this seat starred for the keepsake. */
  favoriteQ?: number | null;
  /** Heartbeat — when this seat was last active, for presence ("Sam is here"). */
  lastSeen?: Timestamp | null;
}

export interface ReactionDoc {
  heart: boolean;
  note: string;
  uid: string;
  at: Timestamp | null;
}

export interface Session {
  createdAt: Timestamp | null;
  status: SessionStatus;
  settings: Settings;
  seatA: SeatState;
  seatB: SeatState;
}

export interface ResponseDoc {
  text: string;
  at: Timestamp | null;
  uid: string;
}

/** The caller's relationship to a session, resolved from their uid. */
export type Role =
  | { kind: "loading" }
  | { kind: "missing" } // session does not exist
  | { kind: "seatA" }
  | { kind: "seatB" }
  | { kind: "joiner" } // seat B open, caller can claim it
  | { kind: "full" }; // both seats taken, caller is neither
