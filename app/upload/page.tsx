import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { UploadForm } from "@/views/UploadForm";

export const metadata: Metadata = {
  title: "Upload — Video Speed Reader",
  description: "Submit a video link and get a transcript.",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  downloading: "bg-muted text-muted-foreground",
  transcribe: "bg-[#e0f7f8] text-[#00808a]",
  done: "bg-[#e6f6ec] text-[#1a7f3c]",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "排隊中 Pending",
  downloading: "下載中 Downloading",
  transcribe: "聽寫中 Transcribing",
  done: "完成 Done",
};

function truncate(text: string, max = 50) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, created_at, video_source_url, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Button asChild variant="secondary">
            <Link href="/app">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-4 py-12 sm:px-6">
        <section>
          <h1 className="text-3xl font-semibold">影片轉逐字稿 Transcribe a video</h1>
          <p className="mt-2 text-muted-foreground">Your 20 most recent videos. Finished transcripts can be downloaded as .txt.</p>

          <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
            {error ? (
              <p className="p-8 text-sm text-destructive">Couldn't load your videos: {error.message}</p>
            ) : !jobs || jobs.length === 0 ? (
              <p className="p-10 text-center text-muted-foreground">No transcriptions yet. Submit your first video below.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Created</th>
                    <th className="px-5 py-3 font-medium">URL</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b last:border-0">
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-5 py-3" title={job.video_source_url}>
                        {truncate(job.video_source_url)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[job.status] ?? STATUS_STYLE["pending"]}`}>
                          {STATUS_LABEL[job.status] ?? job.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {job.status === "done" ? (
                          <a
                            href={`/api/jobs/${job.id}/transcript`}
                            download={`transcript-${job.id.slice(0, 8)}.txt`}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <Download className="h-4 w-4" aria-hidden="true" /> .txt
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="max-w-xl">
          <h2 className="text-xl font-semibold">送出新影片 Submit a video</h2>
          <UploadForm />
        </section>
      </main>
    </div>
  );
}
