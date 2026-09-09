import data from "../data/sakina_v1_6.json";

export type Content = {
  type: string;
  text_ar: string;
  source: string;
  reference: string;
  status: string;
  surah_number?: number;
  [key: string]: unknown;
};

export type Category = {
  code: string;
  name_ar: string;
  is_safety_route: boolean;
  keywords: string[];
  content: Content[];
};

export const sakinaData = data as {
  app: { name: string; version: string; status: string };
  reciters: unknown[];
  categories: Category[];
  engagement_prompts: unknown[];
};

export const THRESHOLD = 0.5;

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0624/g, "\u0648")
    .replace(/\u0626/g, "\u064A")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesKeyword(input: string, keyword: string) {
  const k = normalize(keyword);
  if (!k) return false;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\u0621-\\u064A\\u0660-\\u0669a-z0-9])${escaped}($|[^\\u0621-\\u064A\\u0660-\\u0669a-z0-9])`, "i").test(input);
}

function safetyCategory() {
  return sakinaData.categories.find((c) => c.code === "SAFETY_CRISIS")!;
}

export function classify(text: string) {
  const input = normalize(text || "");
  if (!input) return fallback();

  // Safety is always evaluated first so an emergency phrase cannot be masked by another category.
  const safety = safetyCategory();
  const safetyMatches = safety.keywords.filter((keyword) => matchesKeyword(input, keyword));
  if (safetyMatches.length) {
    return { category: safety, score: 1, matches: safetyMatches };
  }

  let best: { category: Category; score: number; matches: string[] } | null = null;

  for (const category of sakinaData.categories) {
    if (category.is_safety_route) continue;
    const matches = category.keywords.filter((keyword) => matchesKeyword(input, keyword));
    if (!matches.length) continue;
    const score = Math.min(1, 0.55 + matches.length * 0.15);
    if (!best || score > best.score) best = { category, score, matches };
  }

  if (!best || best.score < THRESHOLD) return fallback();
  return best;
}

export function fallback() {
  const category = sakinaData.categories.find((c) => c.code === "GENERAL_FALLBACK")!;
  return { category, score: 0, matches: [] as string[] };
}

export function verifiedContent(category: Category) {
  return category.content.filter((item) => item.status === "VERIFIED");
}

export function allVerifiedContent() {
  return sakinaData.categories.flatMap((category) =>
    verifiedContent(category).map((content) => ({ category, content }))
  );
}