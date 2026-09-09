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

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // إزالة التشكيل
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // توحيد الألف
    .replace(/\u0649/g, "\u064A") // توحيد الياء
    .replace(/\u0624/g, "\u0648") // توحيد الواو
    .replace(/\u0626/g, "\u064A") // توحيد الياء المهموزة
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s]/g, "") // إزالة الرموز
    .replace(/\s+/g, " ") // توحيد المسافات
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

  // التحقق من حالة الطوارئ أولاً
  const safety = sakinaData.categories.find((c) => c.code === "SAFETY_CRISIS")!;
  const safetyMatches = safety.keywords.filter((kw) => containsKeyword(input, kw));
  if (safetyMatches.length > 0) {
    return { category: safety, score: 1, matches: safetyMatches };
  }

  // البحث في باقي الفئات
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

  // إذا لم نجد أي تطابق، نعود للمحتوى العام
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