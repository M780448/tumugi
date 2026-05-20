import { NextResponse } from 'next/server';

function getWeatherEnergy(weathercode: number) {
  if (weathercode === 0) {
    return {
      type: '陽',
      energy: '前進',
      baseScore: 90,
      message: [
        '新しい一歩を踏み出す日です',
        '行動するほど運が巡ります',
        '挑戦が良い流れを生みます',
      ],
    };
  }

  if (weathercode > 50) {
    return {
      type: '水',
      energy: '浄化',
      baseScore: 72,
      message: [
        'ゆっくり心を整える日です',
        '焦らず余白を大切に',
        '静かな休息が力になります',
      ],
    };
  }

  return {
    type: '風',
    energy: '調和',
    baseScore: 82,
    message: [
      '落ち着いて整える日に',
      '小さな積み重ねが吉です',
      '静かな集中が力になります',
    ],
  };
}

function getTemperatureEnergy(temp: number) {
  if (temp >= 28) return { bonus: 5, mood: '活動' };
  if (temp <= 10) return { bonus: -3, mood: '内省' };
  return { bonus: 2, mood: '安定' };
}

export async function POST(req: Request) {
  try {
    const { temperature, weathercode } = await req.json();

    const weather = getWeatherEnergy(weathercode);
    const temp = getTemperatureEnergy(temperature);

    const today = new Date();
    const daySeed =
      today.getDate() + today.getMonth() + today.getDay();

    const score =
      weather.baseScore +
      temp.bonus +
      (daySeed % 7) - 3;

    const luckyColors = [
      '淡い青',
      '桜色',
      'ミントグリーン',
      'ラベンダー',
      'アイボリー',
      '空色',
    ];

    const luckyActions = [
      '散歩',
      '読書',
      '深呼吸',
      '整理整頓',
      '新しい挑戦',
      'ゆっくり休む',
    ];

    const messageIndex =
      daySeed % weather.message.length;

    return NextResponse.json({
      energy: weather.energy,
      score: Math.max(60, Math.min(100, score)),
      message: weather.message[messageIndex],
      mood: temp.mood,
      luckyColor:
        luckyColors[daySeed % luckyColors.length],
      luckyAction:
        luckyActions[daySeed % luckyActions.length],
      element: weather.type,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '診断に失敗しました' },
      { status: 500 }
    );
  }
}