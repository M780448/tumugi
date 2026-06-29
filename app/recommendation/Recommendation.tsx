'use client';

import { useEffect, useState } from 'react';
import RecommendationPlaylistButton from "@/app/components/RecommendationPlaylistButton";

type WeatherData = {
  temperature: number;
  weathercode: number;
};

type AsmrData = {
  title: string;
  video_url: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [asmrs, setAsmrs] = useState<AsmrData[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const response = await fetch('/api/components', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lat: latitude,
              lon: longitude,
            }),
          });

          const data = await response.json();

          console.log(data);

          if (response.ok) {
            setWeather({
              temperature: data.weather.temperature,
              weathercode: data.weather.weathercode,
            });

            setCategory(data.category);
            setAsmrs(data.asmr);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationDenied(true);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  if (locationDenied) {
    return (
      <div className="text-sm text-red-500">
        位置情報が許可されていません
        <p className="mt-3 text-xs text-muted-foreground">
          スマートフォン本体の位置情報をONにし、アドレスバー左側のアイコンから
          位置情報を「許可」に変更できます。
          <br />
          Safariの場合は「ぁあ」→「Webサイトの設定」→「位置情報」
        </p>
      </div>
    );
  }

  return (
    <div>
      {asmrs.length > 0 ? (
        <div className="space-y-0">
          <div className="mb-2 flex items-center gap-2">
            <p className="font-medium">
              今の空気に似合うおすすめ動画
            </p>

            <RecommendationPlaylistButton
              videoUrls={asmrs.map(video => video.video_url)}
            />
          </div>

          {asmrs.map((video, index) => (
            <a
              key={index}
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-purple-600"
            >
              <p className="text-sm">
                {video.title}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          おすすめ動画が見つかりませんでした
        </p>
      )}
    </div>
  );
}