import { supabase } from "./utils/supabase";
import { Youtube, Twitcasting } from "@/domain/Article";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Recommendation from "./recommendation/Recommendation"

async function YoutubeArticles() {
  const { data, error } = await supabase
    .from("youtube")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(6)
    .returns<Youtube[]>();
  
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data?.map((post) => (
        <a 
           key={post.id} 
           href={post.video_url}
           target="_blank" 
           rel="noopener noreferrer"
           className="group overflow-hidden rounded-xl border border-card-border bg-card transition-all hover:border-qiita-green hover:shadow-lg"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <Image 
              src={post.thumbnail_url} 
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-qiita-green">
              {post.title}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

async function TwitcastingArticles() {
  const { data, error } = await supabase
    .from("twitcasting")
    .select("*")
    .order("tw_published_at", { ascending: false })
    .limit(6)
    .returns<Twitcasting[]>();

  return(
    <div className="grid gap-4 sm:grid-cols-2">
      {data?.map((post) => (
        <a
          key={post.id} 
          href={post.tw_video_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-xl border border-card-border bg-card transition-all hover:border-qiita-green hover:shadow-lg"
        >
          <div className="relative aspect-video w-full overflow-hidden">
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
  );
}

export default async function Home() {
  const isAdmin = true;
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          つむぎのお部屋
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
          ASMR・配信活動
        </p>
      </section>

      <section className="rounded-2xl border border-pink-100 bg-rose-50/40 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2 w-2 rounded-full bg-pink-400" />
          お知らせ
        </div>

        <div className="text-sm leading-5 text-gray-700">
          <p className="mb-3">
            Twitcasメンバーシップ配信：5日 19日
          </p>

          <p className="mb-0">
            Youtubeメンバーシップ開設中
          </p>

          <a
            href="https://www.youtube.com/channel/UC2FPq3-zTQ_72coWYoEb6jg/join"
            className="text-blue-500 underline"
          >
            メンバーシップはこちら
          </a>
                  
          <div className="mt-2 flex items-center gap-2">
            <p>お気に入り</p>

            {isAdmin && (
              <a
              href="/admin/favorite"
              className="text-xs text-blue-500"
              >
                
              </a>
            )}
          
          </div>

          <Link
          href="/favorite"
          className="text-sm font-medium text-muted transition-colors hover:text-qiita-green"
          >
            
          </Link>
          <Recommendation />
        </div>
      </section>

<section className="rounded-2xl border border-purple-100 bg-purple-50 px-5 py-4">
  <div className="flex flex-col gap-6">

    <h2 className="text-sm font-semibold">
      コンテンツ
    </h2>

    {/* 今日の花 */}
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold">
          🌼 今日の花
        </h2>
        <p className="mt-1 text-sm text-muted">
          今の空気に似合う花をお届けします
        </p>
      </div>

      <Link
        href="/divination"
        className="flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow whitespace-nowrap"
      >
        表示する
      </Link>
    </div>

    {/* お出かけ＆ボイス */}
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold">
          癒しのお出かけ＆シチュエーションボイスを提案します
        </h2>
      </div>

      <Link
        href="/ai"
        className="flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow whitespace-nowrap"
      >
        表示する
      </Link>
    </div>

  </div>
</section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block h-6 w-1 rounded-full bg-qiita-green" />
            動画投稿
          </h2>
          <Link
            href="/youtube"
            className="text-sm font-medium text-muted transition-colors hover:text-qiita-green"
          >
            すべて見る &rarr;
          </Link>
        </div>
      　<Suspense fallback={<div>Loading articles...</div>}>
          <YoutubeArticles />
        </Suspense>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block h-6 w-1 rounded-full bg-accent" />
            ライブ配信
          </h2>
          <Link
            href="/twitcasting"
            className="text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            すべて見る &rarr;
          </Link>
        </div>
        <Suspense fallback={<div>Loading blog articles...</div>}>
          <TwitcastingArticles />
        </Suspense>
      </section>
    </div>
  );
}