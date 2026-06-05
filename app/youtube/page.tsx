import { supabase } from "../utils/supabase";
import { Youtube } from "@/domain/Article";
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> 
        {data?.map((post) => ( 
          <a key={post.id} href={post.video_url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-card-border bg-card transition-all overflow-hidden hover:border-qiita-green hover:shadow-lg" >
            <div className="relative h-40 w-full overflow-hidden">
              <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
 
            <div className="p-4">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-qiita-green"> {post.title} </p>
            </div>
          </a> 
        ))} 
      </div> 
    </div> 
  ); 
 }