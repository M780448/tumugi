import { supabase } from "../utils/supabase";
import { Youtube } from "@/domain/Article";
import YoutubeInlineButton from "@/app/components/YoutubeInlineButton";

export default async function Home() {
  const { data: favorite } = await supabase
    .from("favorite")
    .select("*")
    .eq("id", 1)
    .single();

  if (!favorite) {
    return (
      <p>
        おすすめ動画が設定されていません
      </p>
    );
  }

  const { data: videos } = await supabase
    .from("youtube")
    .select("*")
    .in("id", [
      favorite.video1_id,
      favorite.video2_id,
      favorite.video3_id,
    ])
    .returns<Youtube[]>();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        おすすめ動画
      </h1>

      <div className="space-y-3">
        {videos?.map((video) => (
          <div
            key={video.id}
            className="
            rounded-xl
            border
            border-pink-100
            bg-pink-50/40
            p-4
            hover:bg-pink-50
            transition
            "
          >
            <div className="flex items-center gap-2">
              <YoutubeInlineButton
                videoUrl={video.video_url}
              />

              <p
                className="
                  flex-1
                  text-sm
                  font-semibold
                "
              >
                {video.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}