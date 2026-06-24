// Question packs. Aron's 36 is the flagship; the others extend Okusoko to other
// relationships. Every pack keeps the same shape — three escalating sets with
// intros — so the question loop, gating, and finale work unchanged across packs.

import { QUESTIONS as ARON_QUESTIONS, SET_INTROS as ARON_INTROS } from "./questions";
import type { Question, SetIntro } from "./questions";

export type { Question, SetIntro } from "./questions";

export interface QuestionPack {
  id: string;
  name: string;
  /** One-line description shown on the create screen. */
  tagline: string;
  intros: SetIntro[];
  questions: Question[];
}

interface SetSpec {
  title: string;
  blurb: string;
  questions: string[];
}

/** Flatten three set specs into numbered questions + intros at each set boundary. */
function buildPack(id: string, name: string, tagline: string, sets: SetSpec[]): QuestionPack {
  const questions: Question[] = [];
  const intros: SetIntro[] = [];
  let n = 1;
  sets.forEach((spec, i) => {
    const set = (i + 1) as 1 | 2 | 3;
    intros.push({ set, beforeQuestion: n, title: spec.title, blurb: spec.blurb });
    for (const text of spec.questions) {
      questions.push({ n, set, text });
      n += 1;
    }
  });
  return { id, name, tagline, intros, questions };
}

const ARON: QuestionPack = {
  id: "aron",
  name: "The 36 Questions",
  tagline: "Aron's original study — the canonical path to closeness.",
  intros: ARON_INTROS,
  questions: ARON_QUESTIONS,
};

const FRIENDS = buildPack(
  "friends",
  "Friends Edition",
  "For a friendship you want to take deeper.",
  [
    {
      title: "Set I — Easing in",
      blurb: "Light and curious. The everyday stuff that's secretly revealing.",
      questions: [
        "What's a small thing that reliably makes your day better?",
        "Who outside your family has shaped who you are the most?",
        "What were you like as a kid — would I have recognized you?",
        "What's something you've genuinely changed your mind about in the last few years?",
        "What's a compliment someone gave you that has stuck with you?",
        "What does a perfect, ordinary weekend look like for you?",
        "What's something you're a little embarrassed to admit you love?",
        "When do you feel most like yourself?",
      ],
    },
    {
      title: "Set II — Further in",
      blurb: "The things you don't usually lead with. Go where it's a bit honest.",
      questions: [
        "What's something you're quietly working through right now?",
        "When in our friendship did you first feel close to me?",
        "What's a fear you don't talk about much?",
        "What do you need from your friends that you rarely ask for?",
        "What's a moment you felt truly proud of yourself?",
        "What's something you wish people understood about you?",
        "Has a friendship ended in a way that still affects you?",
        "What does it look like, to you, when someone really shows up for you?",
      ],
    },
    {
      title: "Set III — All the way in",
      blurb: "The closest set. The things you'd only say to someone who's earned it.",
      questions: [
        "What do you value about me as a friend — honestly?",
        "Is there anything you've wanted to tell me but haven't?",
        "What's a regret you carry?",
        "When did you last feel lonely, even with people around?",
        "How do you hope the people who know you will remember you?",
        "What's something hard you're now grateful you went through?",
        "What could I do to be a better friend to you?",
        "What's a promise you'd want us to make to each other?",
      ],
    },
  ]
);

const FAMILY = buildPack(
  "family",
  "Family Edition",
  "For a parent, sibling, or relative you want to know more deeply.",
  [
    {
      title: "Set I — Where we come from",
      blurb: "Memory and roots. The stories that made us.",
      questions: [
        "What's your earliest happy memory of our family?",
        "What family tradition do you hope we never lose?",
        "What were you like at my age?",
        "What's a story about our family I've probably never heard?",
        "Who in the family do you most take after, and how?",
        "What food or smell instantly takes you back to home?",
        "What's something you're genuinely proud of about our family?",
        "What did an ordinary day look like when you were growing up?",
      ],
    },
    {
      title: "Set II — The harder things",
      blurb: "What usually goes unsaid between family. Say a little of it.",
      questions: [
        "Is there something you wish we'd done differently as a family?",
        "What were you most afraid of when you were younger?",
        "What's a sacrifice someone made for you that you've never forgotten?",
        "When did you feel most supported by our family? When least?",
        "What do you wish we talked about more openly?",
        "What's a dream you set aside? Why?",
        "What surprised you most about growing older?",
        "What's a value you hope gets passed down through us?",
      ],
    },
    {
      title: "Set III — Closest to the heart",
      blurb: "The most honest set. The things family rarely says out loud.",
      questions: [
        "What do you wish I understood about you?",
        "Is there something you've never said to me that you'd like to?",
        "What's a regret you hope I never repeat?",
        "When did you last feel truly proud of me?",
        "What do you worry about, for me?",
        "What would you want people to say about you one day?",
        "How could we take better care of each other?",
        "What does family really mean to you?",
      ],
    },
  ]
);

const LONG_DISTANCE = buildPack(
  "long-distance",
  "Long-Distance Edition",
  "For partners apart — built to close the gap, one answer at a time.",
  [
    {
      title: "Set I — Across the gap",
      blurb: "Small and present. The little things that travel.",
      questions: [
        "If distance disappeared tomorrow, what's the first thing you'd want to do together?",
        "What small moment today made you think of me?",
        "What's a part of your daily life here that I can't see, but should know about?",
        "What song feels like us right now?",
        "What do you miss most that isn't the obvious thing?",
        "What's something new about you since we were last together?",
        "Where do you picture us a year from now?",
        "What tiny ritual could we share across the distance?",
      ],
    },
    {
      title: "Set II — The weight of it",
      blurb: "The honest middle. What the distance actually costs.",
      questions: [
        "What's the hardest part of this distance for you, truthfully?",
        "When do you feel most connected to me, even apart?",
        "What's a worry about us you haven't said out loud?",
        "What do you need more of from me right now?",
        "What have you learned about yourself, being apart from me?",
        "When did you last feel really proud of me from afar?",
        "What's a fear you have about closing the distance one day?",
        "What does commitment look like to you when no one's watching?",
      ],
    },
    {
      title: "Set III — The closest distance",
      blurb: "All the way in. The things worth saying out loud, even from far.",
      questions: [
        "What do you most trust about us?",
        "Is there anything you've been holding back from telling me?",
        "What's a moment apart you most wished I'd been there for?",
        "When did you last cry over this distance?",
        "Is home a place or a person, for you?",
        "What do you want our first day living in the same place to feel like?",
        "What could I do to make the distance lighter for you?",
        "What promise do you want to make to me today?",
      ],
    },
  ]
);

export const PACK_LIST: QuestionPack[] = [ARON, FRIENDS, FAMILY, LONG_DISTANCE];

const PACKS: Record<string, QuestionPack> = Object.fromEntries(
  PACK_LIST.map((p) => [p.id, p])
);

export const DEFAULT_PACK_ID = ARON.id;

/** Resolve a pack id (falling back to Aron for legacy sessions with no pack). */
export function getPack(id: string | undefined | null): QuestionPack {
  return (id && PACKS[id]) || ARON;
}

export function packTotal(pack: QuestionPack): number {
  return pack.questions.length;
}

export function getQuestionIn(pack: QuestionPack, n: number): Question | undefined {
  return pack.questions.find((q) => q.n === n);
}

export function setIntroBeforeIn(pack: QuestionPack, n: number): SetIntro | undefined {
  return pack.intros.find((s) => s.beforeQuestion === n);
}
