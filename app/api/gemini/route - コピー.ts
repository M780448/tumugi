import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body.message;

    const places = Array.isArray(body.places)
      ? body.places
      : [];

    if (!message) {
      return NextResponse.json(
        {
          error: "メッセージがありません",
        },
        {
          status: 400,
        }
      );
    }

    const placeText =
      places.length > 0
        ? places
            .map(
              (place: any, index: number) =>
                `${index + 1}. ${place.name} (${place.category})`
            )
            .join("\n")
        : "周辺スポットは見つかりませんでした。";

    const prompt = `
あなたは優しいお出かけコンシェルジュです。

ユーザーの気持ちに寄り添い、
必ず下記のスポット一覧の中からおすすめしてください。

【ユーザー】
${message}

【スポット一覧】
${placeText}

おすすめを3件以内で理由付きで回答してください。
`;

    let response;

    for (let i = 0; i < 3; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: prompt,
        });

        break;
      } catch (error: any) {
        console.error(error);

        if (error.status === 503 && i < 2) {
          console.log(`503のため再試行 (${i + 1}/3)...`);
          await sleep(2000);
          continue;
        }

        throw error;
      }
    }

    return NextResponse.json({
      reply: response?.text ?? "回答を取得できませんでした。",
    });
  } catch (error: any) {
    console.error(error);

    if (error.status === 503) {
      return NextResponse.json({
        reply:
          "現在AIが混み合っています🙇\n30秒ほど待ってもう一度お試しください。",
      });
    }

    return NextResponse.json(
      {
        error: "Gemini API Error",
      },
      {
        status: 500,
      }
    );
  }
}