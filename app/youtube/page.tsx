import { supabase } from "../utils/supabase";
import { Youtube } from "@/domain/Article";
import YoutubeModalButton from "@/app/components/YoutubeModalButton";
import PlaylistModalButton from "@/app/components/PlaylistModalButton";
import Image from "next/image";
import SearchForm from "./SearchForm";


type Props = { searchParams: Promise<{ q?: string; }>; };
export default async function Home({ searchParams }: Props) { 

  const params = await searchParams; const keyword = params.q ?? "";
  let query = supabase.from("youtube").select("*").order("published_at", { ascending: false });
  
  if (keyword) { 
    query = query.ilike("title", `%${keyword}%`);
  }
  const { data, error } = await query .returns<Youtube[]>();

  return ( 
    <div> 
      <div className="mb-8"> 
        <h1 className="text-3xl font-extrabold tracking-tight">Youtube</h1> 
        <p className="mt-2 text-muted">Youtubeに投稿した動画一覧</p>
      </div> 

      <SearchForm initialKeyword={keyword} />

      <PlaylistModalButton
        videoUrls={
          data?.map(
            (item) => item.video_url
            ) ?? []
        }
      />

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {data?.map((post) => (
      <div
        key={post.id}
        className="group flex flex-col overflow-hidden rounded-xl border border-card-border bg-card transition-all hover:border-qiita-green hover:shadow-lg"
      >
        <a
          href={post.video_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </a>

      <div className="p-4">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-qiita-green">
          {post.title}
        </p>

        <YoutubeModalButton
        videoUrl={post.video_url}
        />
       </div>
     </div>
    ))}
  </div>
    </div> 
  ); 
 }