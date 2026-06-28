import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body.message;
    const places = body.places ?? [];
    const asmr = body.asmr ?? [];

    const placeText =
      places.length > 0
        ? places.map((p: any, i: number) =>
            `${i + 1}. ${p.name}（${p.category}）`
          ).join("\n")
        : "周辺スポットなし";

    const asmrText =
      [...asmr]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map((a: any, i: number) => `${i + 1}. ${a.title}`)
        .join("\n");

    const prompt = `
あなたは「癒しのお出かけ＆シチュエーションボイスコンシェルジュ」です。

ユーザーの気分に寄り添い、
次の2つをセットで提案してください。

---

【ユーザーの気分】
${message}

---

【周辺スポット】
${placeText}

---

【ASMR一覧】
${asmrText}

---

【ルール】

・スポットは必ず一覧から選ぶ
・シチュエーションボイスも必ず一覧から選ぶ
・それぞれ2〜3個ずつ選ぶ
・理由はやさしく1〜2文
・最後に励ましの一言

---

【出力フォーマット】

🌿 おすすめスポット

- ○○（理由）
- ○○（理由）

🎧 おすすめシチュエーションボイス

- ○○	
- ○○

💬 メッセージ
（励まし）
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      reply: result.text,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gemini API Error" },
      { status: 500 }
    );
  }
}