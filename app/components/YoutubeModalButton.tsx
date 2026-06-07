'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const YouTube = dynamic(
  () => import('react-youtube'),
  { ssr: false }
);

type Props = {
  videoUrl?: string;
};

export default function YoutubeModalButton({
  videoUrl,
}: Props) {
  const [open, setOpen] = useState(false);

  const getYoutubeId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    
    // 通常URL, ショートリンク, Shortsに対応した堅牢な正規表現
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    // マッチした結果の1番目（動画ID部分）を取得
    const id = match ? match[1] : null;

    // YouTubeの動画IDは必ず11文字であるためバリデーション
    return (id && id.length === 11) ? id : null;
  };


  if (!videoUrl) {
    return null; 
  }


  const videoId = getYoutubeId(videoUrl);

  const handleOpen = () => {
    console.log("Original URL:", videoUrl);
    console.log("Extracted Video ID:", videoId);
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        onTouchStart={handleOpen} 
        className="
        mt-3 flex w-full items-center justify-center gap-2
        rounded-lg border border-red-400/40
        bg-red-500/10
        px-4 py-2
        text-sm font-medium text-red-400
        transition
        hover:bg-red-500/20
        hover:text-red-300
        "
      >
        🎬 再生する
      </button>

      {open && videoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-3xl rounded-xl bg-card p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 text-xl text-white bg-black/50 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80"
            >
              ✕
            </button>

            <div className="overflow-hidden rounded-lg bg-black aspect-video">
              <YouTube
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
