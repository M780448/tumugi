'use client';

import { useEffect, useState } from 'react';

type Result = {
  energy: string;
  score: number;
  message: string;
  mood: string;
  luckyColor: string;
  luckyAction: string;
  element: string;
};

export default function Divination() {
  const [result, setResult] = useState<Result | null>(null);

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
      }
    );
  }, []);

  if (!result) return <p>診断中...</p>;

  return (
    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
      <h2 className="text-lg font-bold mb-4">
        🔮 今日のつむぎ占い
      </h2>

      <p>気：{result.energy}</p>
      <p>属性：{result.element}</p>
      <p>総合運：{result.score}点</p>
      <p>流れ：{result.mood}</p>

      <p className="mt-3">{result.message}</p>

      <div className="mt-4 text-sm">
        <p>🎨 ラッキーカラー：{result.luckyColor}</p>
        <p>✨ おすすめ：{result.luckyAction}</p>
      </div>
    </div>
  );
}