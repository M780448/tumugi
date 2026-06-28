'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const YouTube = dynamic(
  () => import('react-youtube'),
  { ssr: false }
);

type Props = {
  videoUrls: string[];
};

export default function PlaylistModalButton({
  videoUrls,
}: Props) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getYoutubeId = (url: string) => {
    if (!url || typeof url !== 'string') return null;

    const regExp =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    const match = url.match(regExp);
    const id = match ? match[1] : null;

    return id && id.length === 11
      ? id
      : null;
  };

  if (!videoUrls.length) {
    return null;
  }

  const currentVideoUrl =
    videoUrls[currentIndex];

  const videoId =
    getYoutubeId(currentVideoUrl);

  const handleOpen = () => {
    setCurrentIndex(0);
    setOpen(true);
  };

  const handleNext = () => {
    if (
      currentIndex <
      videoUrls.length - 1
    ) {
      setCurrentIndex(
        currentIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        currentIndex - 1
      );
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="
          flex items-center justify-center gap-1
          rounded-lg border border-red-400/40
          bg-red-500/10
          px-2 py-1
          text-xs font-medium text-red-400
          transition
          hover:bg-red-500/20
          hover:text-red-300
        "
      >
        🎬 動画を連続再生
      </button>

      {open && videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-xl bg-card p-4"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              onClick={() => setOpen(false)}
              className="
                absolute right-4 top-4 z-10
                flex h-8 w-8 items-center justify-center
                rounded-full bg-black/50
                text-xl text-white
                hover:bg-black/80
              "
            >
              ✕
            </button>

            <p className="mb-3 text-center text-sm text-muted">
              {currentIndex + 1} / {videoUrls.length}
            </p>

            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <YouTube
                key={videoId}
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                onEnd={() => {
                  if (
                    currentIndex <
                    videoUrls.length - 1
                  ) {
                    setCurrentIndex(
                      (prev) => prev + 1
                    );
                  }
                }}
                className="h-full w-full"
                iframeClassName="h-full w-full"
              />
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={handlePrev}
                disabled={
                  currentIndex === 0
                }
                className="
                  rounded-lg border px-4 py-2
                  disabled:opacity-40
                "
              >
                ⏮ 前へ
              </button>

              <button
                onClick={handleNext}
                disabled={
                  currentIndex ===
                  videoUrls.length - 1
                }
                className="
                  rounded-lg border px-4 py-2
                  disabled:opacity-40
                "
              >
                ⏭ 次へ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}