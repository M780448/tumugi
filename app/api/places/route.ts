import { NextRequest, NextResponse } from "next/server";

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();

    console.log("latitude:", latitude);
    console.log("longitude:", longitude);

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "位置情報がありません。" },
        { status: 400 }
      );
    }

    const query = `
[out:json][timeout:20];

(
  node(around:1000,${latitude},${longitude})["tourism"];
  way(around:1000,${latitude},${longitude})["tourism"];
  relation(around:1000,${latitude},${longitude})["tourism"];

  node(around:1000,${latitude},${longitude})["amenity"="cafe"];
  way(around:1000,${latitude},${longitude})["amenity"="cafe"];

  node(around:1000,${latitude},${longitude})["amenity"="restaurant"];
  way(around:1000,${latitude},${longitude})["amenity"="restaurant"];

  node(around:1000,${latitude},${longitude})["amenity"="library"];
  way(around:1000,${latitude},${longitude})["amenity"="library"];

  node(around:1000,${latitude},${longitude})["leisure"="park"];
  way(around:1000,${latitude},${longitude})["leisure"="park"];
);

out center;
`;

    console.log(query);

for (const url of OVERPASS_URLS) {
  try {
    console.log("==========");
    console.log("URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "MyAIApp/1.0",
      },
      body: new URLSearchParams({
        data: query,
      }).toString(),
      cache: "no-store",
    });

    console.log("status:", response.status);

    const text = await response.text();

    console.log(text.substring(0, 500));

    if (!response.ok) {
      continue;
    }

    const data = JSON.parse(text);

    const places = (data.elements ?? [])
      .filter((place: any) => place.tags?.name)
      .map((place: any) => ({
        name: place.tags.name,
        lat: place.lat ?? place.center?.lat,
        lon: place.lon ?? place.center?.lon,
        category:
          place.tags.tourism ??
          place.tags.amenity ??
          place.tags.leisure ??
          "その他",
      }));

    console.log("取得件数:", places.length);

    return NextResponse.json({
      places,
    });
  } catch (err) {
    console.error(`Overpass接続エラー`, err);
  }
}

    return NextResponse.json(
      {
        error: "Overpass APIへ接続できませんでした。",
      },
      {
        status: 503,
      }
    );
  } catch (error) {
    console.error("APIルート内エラー:", error);

    return NextResponse.json(
      {
        error: "周辺スポットの取得に失敗しました。",
      },
      {
        status: 500,
      }
    );
  }
}