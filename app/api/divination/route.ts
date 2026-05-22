import { flowers } from '@/app/lib/flowers';
import { NextResponse } from 'next/server';

function getWeatherType(weathercode: number) {
  if (weathercode === 0) return 'sunny';

  if (weathercode > 50) return 'rainy';

  return 'cloudy';
}

const defaultFlower = {
  name: 'ひまわり',
  type: 'sunny',
  season: 'summer',
  minTemp: 0,
  maxTemp: 50,
  language: '憧れ',
  message: '前向きな力をくれる花',
  image: '/flowers/sunflower.jpg',
};

export async function POST(req: Request) {
  try {
    const { temperature, weathercode } =
      await req.json();

    const weatherType =
      getWeatherType(weathercode);

    const matchedFlowers = flowers.filter(
      (flower) =>
        flower[1] === weatherType &&
        temperature >= flower[3] &&
        temperature <= flower[4]
    );

    const today = new Date().getDate();

    const selectedFlower =
      matchedFlowers.length > 0
        ? matchedFlowers[
            today % matchedFlowers.length
          ]
        : flowers[
            today % flowers.length
          ];

    const flower = {
      name: selectedFlower[0],
      type: selectedFlower[1],
      season: selectedFlower[2],
      minTemp: selectedFlower[3],
      maxTemp: selectedFlower[4],
      language: selectedFlower[5],
      message: selectedFlower[6],
      image: `/flowers/${selectedFlower[7]}`,
    };

    return NextResponse.json({
      flower,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '診断失敗' },
      { status: 500 }
    );
  }
}