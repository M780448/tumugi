import { NextResponse } from 'next/server';
import { supabase } from "@/app/utils/supabase";
import { Youtube } from "@/domain/Article";

async function search(keyword: string) {
  const { data, error } = await supabase
    .from("youtube")
    .select("*")
    .ilike("title", `%${keyword}%`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

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

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const errorDetail = await res.text();
      return NextResponse.json(
        { error: '外部APIエラー', detail: errorDetail },
        { status: res.status }
      );
    }

    const data = await res.json();

    const temp = data.current_weather?.temperature;
    const weathercode = data.current_weather?.weathercode;


    function getWeatherTag(temp: number, code: number) {
      if (code >= 51 && code <= 67) return '甘々';
      if (code >= 71 && code <= 77) return 'イチャイチャ';
      if (code >= 95) return '甘s';

      if (temp <= 10) return '甘やかし';
      if (temp <= 20) return '癒し';
      if (temp <= 28) return '甘やかし';

      return '男性向け';
    }

    const category = getWeatherTag(temp, weathercode);

    const asmrList = await search(category);

    const randomAsmr =
      asmrList
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    return NextResponse.json({
      weather: data.current_weather,
      category,
      asmr: randomAsmr,
    });

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