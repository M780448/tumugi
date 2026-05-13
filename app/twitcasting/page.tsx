import { supabase } from "../utils/supabase";
import { Twitcasting } from "@/domain/Article";
import Image from "next/image";


export default async function Home() {

  const { data, error } = await supabase
    .from("twitcasting")
    .select("*")
    .order("tw_published_at", { ascending: false })
    .returns<Twitcasting[]>();


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Twitcast</h1>
        <p className="mt-2 text-muted">twitcasライブ配信アーカイブ一覧</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((post) => (
            <a 
              key={post.id} 
              href={post.tw_video_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group rounded-xl border border-card-border bg-card transition-all overflow-hidden hover:border-qiita-green hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image 
                src={post.tw_thumbnail_url} 
                alt={post.tw_title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-qiita-green">
                  {post.tw_title}
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}