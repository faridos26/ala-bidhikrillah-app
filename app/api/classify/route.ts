import { classify, classifyByCategory } from "../../../lib/classify";
import data from "../../../data/sakina.json";

// تصنيف النص المدخل واختيار المحتوى المناسب
export async function POST(request: Request) {
  const { text, category_code } = await request.json();

  // اختيار مباشر: المستخدم ضغط على تصنيف جاهز بدل كتابة نص حر
  if (category_code) {
    const result = classifyByCategory(category_code);
    if (!result) {
      return Response.json({ error: "تصنيف غير معروف" }, { status: 400 });
    }
    return Response.json(result);
  }

  if (!text || typeof text !== "string") {
    return Response.json({ error: "النص مطلوب" }, { status: 400 });
  }

  let result = classify(text);

  return Response.json(result);
}