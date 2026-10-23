import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/jobs/:id/transcript — download a finished transcript as a .txt file.
// Queries run as the signed-in user, so Row Level Security already limits
// results to their own jobs; the explicit user_id filter is a second guard.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, current_session_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!job) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (job.status !== "done" || !job.current_session_id) {
    return NextResponse.json({ error: "not ready" }, { status: 409 });
  }

  const { data: session } = await supabase
    .from("job_sessions")
    .select("subtitle_txt_content")
    .eq("id", job.current_session_id)
    .single();
  const txt = session?.subtitle_txt_content;
  if (!txt) {
    return NextResponse.json({ error: "transcript missing" }, { status: 500 });
  }

  return new NextResponse(txt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="transcript-${id.slice(0, 8)}.txt"`,
      "Cache-Control": "no-store",
    },
  });
}
