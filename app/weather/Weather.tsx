'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
  temperature: number;
  weathercode: number;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
          const response = await fetch('/api/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lon: longitude }),
          });
          const data = await response.json();
          if (response.ok) {
            setWeather({
              temperature: data.current_weather.temperature,
              weathercode: data.current_weather.weathercode,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  }, []);

  const getWeatherText = (code: number) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '🌤️';
    if (code <= 48) return '☁️';
    if (code <= 67) return '☔';
    if (code <= 77) return '❄️';
    return '❓';
  };

  if (loading) {
    return <div className="text-xs text-muted px-2">...</div>;
  }

  if (locationDenied) {
    return (
      <div className="text-xs text-muted px-2">
        📍位置情報を許可すると現在地の天気を表示できます
      </div>
    );
  }

  if (!weather) {
    return <div className="text-xs text-muted px-2">📍位置情報を許可すると現在地の天気を表示できます</div>;
  }

  return (
    <div className="flex items-center gap-2 px-2 text-sm font-medium text-muted">
      <span>{getWeatherText(weather.weathercode)}</span>
      <span>{weather.temperature}°C</span>
    </div>
  );
}