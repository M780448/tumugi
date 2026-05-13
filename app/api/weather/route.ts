import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lon } = body;

    if (lat === undefined || lon === undefined) {
      return NextResponse.json(
        { error: '緯度・経度が提供されていません' },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    console.log("Fetching from:", apiUrl);

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const errorDetail = await res.text();
      return NextResponse.json(
        { error: '外部APIエラー', detail: errorDetail },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Server Error:", error);

    return NextResponse.json(
      {
        error: 'サーバー内部で例外が発生しました',
        message: error.message
      },
      { status: 500 }
    );
  }
}