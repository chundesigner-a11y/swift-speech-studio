import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LANGUAGES = new Set(["zh", "en", "ja"]);

// POST /api/jobs — enqueue a transcription job for the signed-in user.
// The insert runs with the user's own session (publishable key + RLS), and a
// database trigger creates the matching job_sessions row, so this route never
// needs the Supabase secret key.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    video_source_url?: unknown;
    topic?: unknown;
    language?: unknown;
  };

  const url = typeof body.video_source_url === "string" ? body.video_source_url.trim() : "";
  if (!/^https?:\/\/\S+$/i.test(url)) {
    return NextResponse.json({ error: "Enter a video link that starts with http:// or https://." }, { status: 400 });
  }
  const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim().slice(0, 200) : null;
  const language = typeof body.language === "string" && LANGUAGES.has(body.language) ? body.language : "zh";

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({ user_id: user.id, video_source_url: url, topic, language })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job_id: job.id });
}
