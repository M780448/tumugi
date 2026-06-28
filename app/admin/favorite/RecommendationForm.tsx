'use client';

import { useState } from 'react';

type Video = {
  id: number;
  title: string;
};

type Props = {
  videos: Video[];
};

export default function RecommendationForm({
  videos,
}: Props) {
  const [recommend1, setRecommend1] =
    useState('');

  const [recommend2, setRecommend2] =
    useState('');

  const [recommend3, setRecommend3] =
    useState('');

  const handleSave = async () => {
    const video1 = videos.find(
      (video) => video.title === recommend1
    );

    const video2 = videos.find(
      (video) => video.title === recommend2
    );

    const video3 = videos.find(
      (video) => video.title === recommend3
    );

    const response = await fetch(
      '/api/favorite',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          video1_id: video1?.id,
          video2_id: video2?.id,
          video3_id: video3?.id,
        }),
      }
    );

    if (!response.ok) {
      alert('保存に失敗しました');
      return;
    }
    setRecommend1("");
    setRecommend2("");
    setRecommend3("");
    alert('保存しました');
  };

  return (
    <div className="mx-auto max-w-3xl">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          おすすめ動画設定
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          トップページに表示する動画を選択してください
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              おすすめ動画①
            </label>

            <input
              list="video-list-1"
              value={recommend1}
              onChange={(e) =>
                setRecommend1(
                  e.target.value
                )
              }
              placeholder="動画を選択"
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:border-pink-300
                focus:outline-none
              "
            />

            <datalist id="video-list-1">
              {videos.map((video) => (
                <option
                  key={video.id}
                  value={video.title}
                />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              おすすめ動画②
            </label>

            <input
              list="video-list-2"
              value={recommend2}
              onChange={(e) =>
                setRecommend2(
                  e.target.value
                )
              }
              placeholder="動画を選択"
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:border-pink-300
                focus:outline-none
              "
            />

            <datalist id="video-list-2">
              {videos
                .filter(
                  (video) =>
                    video.title !==
                    recommend1
                )
                .map((video) => (
                  <option
                    key={video.id}
                    value={video.title}
                  />
                ))}
            </datalist>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              おすすめ動画③
            </label>

            <input
              list="video-list-3"
              value={recommend3}
              onChange={(e) =>
                setRecommend3(
                  e.target.value
                )
              }
              placeholder="動画を選択"
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:border-pink-300
                focus:outline-none
              "
            />

            <datalist id="video-list-3">
              {videos
                .filter(
                  (video) =>
                    video.title !==
                      recommend1 &&
                    video.title !==
                      recommend2
                )
                .map((video) => (
                  <option
                    key={video.id}
                    value={video.title}
                  />
                ))}
            </datalist>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="
              mt-4
              w-full
              rounded-xl
              bg-pink-400
              py-3
              text-white
              font-medium
              transition
              hover:bg-pink-500
            "
          >
            保存する
          </button>

        </div>
      </div>
    </div>
  );
}