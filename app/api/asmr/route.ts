import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";


export async function POST(req: NextRequest) {
  try {
    const { mood } = await req.json();

    const { data, error } = await supabase
      .from("youtube")
    　.select("title")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      asmr: data,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "取得失敗" },
      { status: 500 }
    );
  }
}