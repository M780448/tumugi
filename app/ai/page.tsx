'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'こんにちは😊\n今日はどんな気分ですか？\n今の気持ちを教えてください。',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // 現在地取得
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        console.log('位置情報が取得できませんでした');
      }
    );
  }, []);

  // 自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!location) {
      alert('現在地を取得できませんでした。');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const placesRes = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      const places = await placesRes.json();

      const asmrRes = await fetch('/api/asmr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: userMessage.content,
        }),
      });

      const asmrData = await asmrRes.json();
 
      const geminiRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          places: places.places,
          asmr: asmrData.asmr,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await geminiRes.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '申し訳ありません。エラーが発生しました。',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex h-screen max-w-4xl flex-col bg-gradient-to-b from-green-50 via-white to-blue-50">

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-green-100 bg-white/70 px-6 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-green-700">🌿 おでかけAI</h1>
        <p className="mt-1 text-sm text-gray-500">
          今の気持ちに合わせて、おすすめのお出かけ先をご提案します
        </p>
      </header>

      {/* メッセージ */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl shadow-sm">
                🌿
              </div>
            )}

            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-5 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-400 text-white rounded-br-lg'
                  : 'border border-green-100 bg-green-50 text-gray-700 rounded-bl-lg'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* ローディング */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl shadow-sm">
              🌱
            </div>
            <div className="rounded-3xl border border-green-100 bg-green-50 px-5 py-4 text-gray-600 shadow-sm">
              おすすめを考えています...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 入力欄 */}
      <div className="border-t border-green-100 bg-white/70 p-5 backdrop-blur">
        <div className="flex gap-3">

          <input
            className="flex-1 rounded-full border border-green-200 bg-white px-5 py-3 shadow-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
            placeholder="今の気持ちを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-full bg-green-500 px-7 py-3 font-medium text-white hover:bg-green-600 disabled:bg-gray-300"
          >
            送信
          </button>

        </div>
      </div>

    </main>
  );
}