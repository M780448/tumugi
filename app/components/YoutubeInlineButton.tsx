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

export default function YoutubeInlineButton({
  videoUrl,
}: Props) {
  const [open, setOpen] = useState(false);

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    const match = url.match(regExp);

    const id = match
      ? match[1]
      : null;

    return id && id.length === 11
      ? id
      : null;
  };

  if (!videoUrl) {
    return null;
  }

  const videoId = getYoutubeId(videoUrl);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-pink-200
          bg-white
          text-[10px]
          shadow-sm
          transition
          hover:bg-pink-50
          hover:shadow
        "
        title="動画を再生"
      >
        ▶
      </button>

      {open && videoId && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/90
            p-4
          "
          onClick={() => setOpen(false)}
        >
          <div
            className="
              relative
              w-full
              max-w-5xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              onClick={() => setOpen(false)}
              className="
                absolute
                right-3
                top-3
                z-10
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-xl
                text-white
                transition
                hover:bg-black/80
              "
            >
              ✕
            </button>

            <div className="aspect-video overflow-hidden rounded-xl">
              <YouTube
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="h-full w-full"
                iframeClassName="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}