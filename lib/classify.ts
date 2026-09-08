import data from "../data/sakina.json";

// مطابقة بحدود الكلمة الحقيقية (وليس احتواء جزئي) — هذا ما يحل تداخلات
// مثل "قرار" داخل "استقرار" أو "أم" داخل "أمل" التي وُثّقت في قاعدة البيانات.
// \p{L} يغطي حروف العربية بشكل صحيح مع علم 'u'.
function wordBoundaryMatch(text: string, keyword: string) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "u");
  return re.test(text);
}

function pickContent(category: any) {
  const items = category.content.filter((c: any) => c.status === "VERIFIED");
  const pool = items.length > 0 ? items : category.content; // احتياط لو كل العناصر قيد المراجعة
  return pool[Math.floor(Math.random() * pool.length)];
}

// التصنيف: SAFETY_CRISIS له أولوية مطلقة وتتجاوز عتبة الثقة تمامًا،
// تماشيًا مع settings.safety_route في القاعدة.
export function classify(userText: string) {
  const text = (userText || "").trim();
  if (!text) return null;

  const safetyCategory = data.categories.find((c: any) => c.is_safety_route);
  if (safetyCategory && safetyCategory.keywords.some((kw: string) => wordBoundaryMatch(text, kw))) {
    return {
      category_code: safetyCategory.code,
      category_name: safetyCategory.name_ar,
      is_safety_route: true,
      content: pickContent(safetyCategory),
    };
  }

  for (const category of data.categories) {
    if (category.is_safety_route) continue;
    if (category.keywords.some((kw: string) => wordBoundaryMatch(text, kw))) {
      return {
        category_code: category.code,
        category_name: category.name_ar,
        is_safety_route: false,
        content: pickContent(category),
      };
    }
  }

  const fallback = data.categories.find((c: any) => c.code === "GENERAL_FALLBACK") ||
    data.categories[0];
  return {
    category_code: fallback.code,
    category_name: fallback.name_ar,
    is_safety_route: false,
    content: pickContent(fallback),
  };
}

export function getSelectableCategories() {
  return data.categories.filter((c: any) => !c.is_safety_route);
}

export function getSafetyCategory() {
  return data.categories.find((c: any) => c.is_safety_route);
}

export function classifyByCategory(categoryCode: string) {
  const category = data.categories.find((c: any) => c.code === categoryCode);
  if (!category) return null;
  return {
    category_code: category.code,
    category_name: category.name_ar,
    is_safety_route: !!category.is_safety_route,
    content: pickContent(category),
  };
}

export function getEngagementConfig() {
  return data.engagement_prompts;
}

export function getReciters() {
  return data.reciters;
}