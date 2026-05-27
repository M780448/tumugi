'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Result = {
  energy: string;
  score: number;
  message: string;
  mood: string;
  luckyColor: string;
  luckyAction: string;
  element: string;

  flower: {
    name: string;
    image: string;
    language: string;
    message: string;
  };
};

export default function Divination() {
  const [result, setResult] = useState<Result | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const weatherRes = await fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        });

        const weatherData = await weatherRes.json();

        const divRes = await fetch('/api/divination', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(weatherData),
        });

        const divData = await divRes.json();

        setResult(divData);
      },

      // ↓ 拒否時
      () => {
        setLocationDenied(true);
      }
    );
  }, []);

  // 位置情報拒否
  if (locationDenied) {
    return (
      <div className="text-sm text-red-500">
        位置情報が許可されていません
      </div>
    );
  }

  // ローディング
  if (!result) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5 text-center">
        診断中...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl p-6">
      <div className="mx-auto max-w-md">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-md">
          <Image
            src={result.flower.image}
            alt={result.flower.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-2xl font-bold">
            🌸 今日の花
          </h2>

          <p className="mt-2 text-xl font-semibold text-purple-700">
            {result.flower.name}
          </p>

          <p className="mt-4 text-sm text-muted">
            花言葉：{result.flower.language}
          </p>

          <p className="mt-3 text-sm leading-7">
            {result.flower.message}
          </p>
        </div>
      </div>
    </div>
  );
}