// Arthur Aron's 36 questions, canonical order, in three escalating sets.
// A few originals are written for two people in a room; the async adaptation
// (the version we actually show) is used here, with the original noted.

export interface Question {
  /** 1-based position in the canonical order. */
  n: number;
  set: 1 | 2 | 3;
  text: string;
}

export interface SetIntro {
  set: 1 | 2 | 3;
  /** The question number this intro appears before. */
  beforeQuestion: number;
  title: string;
  blurb: string;
}

export const SET_INTROS: SetIntro[] = [
  {
    set: 1,
    beforeQuestion: 1,
    title: "Set I — Warming up",
    blurb:
      "Light, curious, getting-to-know-you. You're laying the groundwork. Answer honestly — the small stuff is how the bigger stuff gets easier.",
  },
  {
    set: 2,
    beforeQuestion: 13,
    title: "Set II — This is where it gets personal",
    blurb:
      "The questions start reaching deeper — memories, values, the things you don't usually say out loud. That's the point. Go where it's a little uncomfortable.",
  },
  {
    set: 3,
    beforeQuestion: 25,
    title: "Set III — All the way in",
    blurb:
      "The most intimate set. Regret, fear, what you'd save from a fire, what you genuinely admire about each other. You've earned this depth together.",
  },
];

export const QUESTIONS: Question[] = [
  // Set I
  { n: 1, set: 1, text: "Given the choice of anyone in the world, whom would you want as a dinner guest?" },
  { n: 2, set: 1, text: "Would you like to be famous? In what way?" },
  { n: 3, set: 1, text: "Before making a telephone call, do you ever rehearse what you're going to say? Why?" },
  { n: 4, set: 1, text: "What would constitute a “perfect” day for you?" },
  { n: 5, set: 1, text: "When did you last sing to yourself? To someone else?" },
  {
    n: 6,
    set: 1,
    text: "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
  },
  { n: 7, set: 1, text: "Do you have a secret hunch about how you will die?" },
  { n: 8, set: 1, text: "Name three things you and your partner appear to have in common." },
  { n: 9, set: 1, text: "For what in your life do you feel most grateful?" },
  { n: 10, set: 1, text: "If you could change anything about the way you were raised, what would it be?" },
  {
    n: 11,
    set: 1,
    // Original: "Take four minutes and tell your partner your life story in as much detail as possible."
    text: "Write the short version of your life story, in as much detail as you can fit.",
  },
  { n: 12, set: 1, text: "If you could wake up tomorrow having gained any one quality or ability, what would it be?" },

  // Set II
  {
    n: 13,
    set: 2,
    text: "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?",
  },
  { n: 14, set: 2, text: "Is there something that you've dreamed of doing for a long time? Why haven't you done it?" },
  { n: 15, set: 2, text: "What is the greatest accomplishment of your life?" },
  { n: 16, set: 2, text: "What do you value most in a friendship?" },
  { n: 17, set: 2, text: "What is your most treasured memory?" },
  { n: 18, set: 2, text: "What is your most terrible memory?" },
  {
    n: 19,
    set: 2,
    text: "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
  },
  { n: 20, set: 2, text: "What does friendship mean to you?" },
  { n: 21, set: 2, text: "What roles do love and affection play in your life?" },
  {
    n: 22,
    set: 2,
    // Original: "Alternate sharing something you consider a positive characteristic of your partner. Share a total of five items."
    text: "List five things you genuinely appreciate about your partner.",
  },
  {
    n: 23,
    set: 2,
    text: "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
  },
  { n: 24, set: 2, text: "How do you feel about your relationship with your mother?" },

  // Set III
  {
    n: 25,
    set: 3,
    // Original: "Make three true 'we' statements each."
    text: "Write three true “we” statements. (For example: “We are both in this room feeling…”)",
  },
  { n: 26, set: 3, text: "Complete this sentence: “I wish I had someone with whom I could share…”" },
  {
    n: 27,
    set: 3,
    text: "If you were going to become a close friend with your partner, please share what would be important for them to know.",
  },
  {
    n: 28,
    set: 3,
    text: "Tell your partner what you like about them; be honest this time, saying things you might not say to someone you've just met.",
  },
  { n: 29, set: 3, text: "Share with your partner an embarrassing moment in your life." },
  { n: 30, set: 3, text: "When did you last cry in front of another person? By yourself?" },
  { n: 31, set: 3, text: "Tell your partner something that you like about them already." },
  { n: 32, set: 3, text: "What, if anything, is too serious to be joked about?" },
  {
    n: 33,
    set: 3,
    text: "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
  },
  {
    n: 34,
    set: 3,
    text: "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?",
  },
  { n: 35, set: 3, text: "Of all the people in your family, whose death would you find most disturbing? Why?" },
  {
    n: 36,
    set: 3,
    // Original: a back-and-forth. Async: you pose the problem; your partner answers it.
    text: "Share a personal problem and describe how you'd like your partner's help with it — then tell them how you think they'd handle it.",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length; // 36

export function getQuestion(n: number): Question | undefined {
  return QUESTIONS.find((q) => q.n === n);
}

export function setIntroBefore(n: number): SetIntro | undefined {
  return SET_INTROS.find((s) => s.beforeQuestion === n);
}
