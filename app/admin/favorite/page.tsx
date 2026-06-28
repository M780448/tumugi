import { supabase } from "@/app/utils/supabase";
import { Youtube } from "@/domain/Article";
import RecommendationForm from "./RecommendationForm";

export default async function Home() {
  const { data } = await supabase
    .from("youtube")
    .select("*")
    .order("published_at", { ascending: false })
    .returns<Youtube[]>();

  return (
    <RecommendationForm
      videos={data ?? []}
    />
  );
}