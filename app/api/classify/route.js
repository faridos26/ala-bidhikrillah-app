import { classify, classifyByCategory } from "../../../lib/classify";
import data from "../../../data/sakina.json";

// دور الذكاء الاصطناعي هنا "تصنيف فقط" (كما في settings.ai_role) — لا يُولّد أي
// نص ديني، فقط يختار أقرب category_code من قائمة مغلقة عندما تفشل مطابقة
// الكلمات المفتاحية. يعمل فقط إذا كان ANTHROPIC_API_KEY متوفرًا في متغيرات البيئة.
async function classifyWithAI(text) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const codes = data.categories.filter((c) => !c.is_safety_route).map((c) => c.code);
  const prompt = `صنّف الجملة التالية إلى واحد فقط من هذه الرموز، وأجب برمز واحد فقط بلا أي شرح:
${codes.join(", ")}

الجملة: "${text}"`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 20,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const answer = (json.content?.[0]?.text || "").trim();
    return codes.includes(answer) ? answer : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
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

  // لو وقع على GENERAL_FALLBACK فقط (لا مطابقة كلمات إطلاقًا)، جرّب الذكاء الاصطناعي
  if (result.category_code === "GENERAL_FALLBACK") {
    const aiCode = await classifyWithAI(text);
    if (aiCode) {
      const aiCategory = data.categories.find((c) => c.code === aiCode);
      if (aiCategory) {
        const items = aiCategory.content.filter((c) => c.status === "VERIFIED");
        const pool = items.length > 0 ? items : aiCategory.content;
        result = {
          category_code: aiCategory.code,
          category_name: aiCategory.name_ar,
          is_safety_route: false,
          content: pool[Math.floor(Math.random() * pool.length)],
        };
      }
    }
  }

  return Response.json(result);
}
