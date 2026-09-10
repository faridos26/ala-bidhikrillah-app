import data from "../data/sakina_v1_6.json";
import duasData from "../data/duas.json";
import prophetStoriesData from "../data/prophetStories.json";

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

export type DuaInfo = {
  dua_ar: string;
  source: string;
  reference: string;
  dhikr_ar: string;
  dhikr_source: string;
};

export type ProphetStory = {
  prophet: string;
  title: string;
  icon: string;
  introduction: string;
  story: string;
  quran_verses: { text_ar: string; reference: string }[];
  lesson: string;
  connection: string;
};

export const sakinaData = data as {
  app: { name: string; version: string; status: string };
  reciters: unknown[];
  categories: Category[];
  engagement_prompts: unknown[];
};

export const duasDataMap = duasData as Record<string, DuaInfo>;
export const prophetStories = prophetStoriesData.stories as Record<string, ProphetStory>;

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0624/g, "\u0648")
    .replace(/\u0626/g, "\u064A")
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeyword(input: string, keyword: string): boolean {
  const normalizedInput = normalizeArabic(input);
  const normalizedKeyword = normalizeArabic(keyword);
  if (!normalizedKeyword) return false;
  return normalizedInput.includes(normalizedKeyword);
}

export function classify(text: string) {
  const input = normalizeArabic(text || "");

  if (!input) {
    return {
      category: sakinaData.categories.find((c) => c.code === "GENERAL_FALLBACK")!,
      score: 0,
      matches: [] as string[],
    };
  }

  const safety = sakinaData.categories.find((c) => c.code === "SAFETY_CRISIS")!;
  const safetyMatches = safety.keywords.filter((kw) => containsKeyword(input, kw));
  if (safetyMatches.length > 0) {
    return { category: safety, score: 1, matches: safetyMatches };
  }

  let bestCategory: Category | null = null;
  let bestMatches: string[] = [];

  for (const category of sakinaData.categories) {
    if (category.is_safety_route) continue;
    const matches = category.keywords.filter((kw) => containsKeyword(input, kw));
    if (matches.length > bestMatches.length) {
      bestCategory = category;
      bestMatches = matches;
    }
  }

  if (bestCategory && bestMatches.length > 0) {
    return {
      category: bestCategory,
      score: Math.min(1, 0.6 + bestMatches.length * 0.1),
      matches: bestMatches,
    };
  }

  return {
    category: sakinaData.categories.find((c) => c.code === "GENERAL_FALLBACK")!,
    score: 0,
    matches: [] as string[],
  };
}

export function verifiedContent(category: Category) {
  return category.content.filter((item) => item.status === "VERIFIED");
}

export function allVerifiedContent() {
  return sakinaData.categories.flatMap((category) =>
    verifiedContent(category).map((content) => ({ category, content }))
  );
}

export function getDuaForCategory(categoryCode: string): DuaInfo | undefined {
  return duasDataMap[categoryCode];
}

export function getProphetStoryForCategory(categoryCode: string): ProphetStory | undefined {
  return prophetStories[categoryCode];
}