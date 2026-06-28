import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(body);

    const { error } = await supabase
      .from("favorite")
      .upsert({
        id: 1,
        video1_id: body.video1_id,
        video2_id: body.video2_id,
        video3_id: body.video3_id,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        error,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}