import { Link } from "react-router-dom";
import { Target, Timer, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/use-page-meta";

const features = [
  { icon: Target, title: "高準確度逐字稿", en: "High-accuracy transcripts", body: "Powered by OpenAI Whisper. Supports Chinese and English." },
  { icon: Timer, title: "三分鐘交付", en: "Three-minute turnaround", body: "Processed in the background — you get an email when it's ready." },
  { icon: BadgeCheck, title: "可商用授權", en: "Commercial-use ready", body: "You own the output. Use it however you like." },
];

export function LandingPage() {
  usePageMeta({
    title: "Video Speed Reader — Transcripts in three minutes",
    description: "Upload your video, get a clean, accurate transcript in three minutes. Chinese and English, powered by Whisper.",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Button asChild>
            <Link to="/sign-in">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
            <Reveal>
              <p className="mb-6 inline-block rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                For creators, educators & engineers
              </p>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">Video Speed Reader</h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-2xl font-medium sm:text-3xl">上傳影片，三分鐘內拿到逐字稿。</p>
              <p className="mt-3 text-lg text-muted-foreground">Upload your video, get a clean transcript in three minutes.</p>
            </Reveal>
            <Reveal delay={240}>
              <Button asChild size="lg" className="mt-10">
                <Link to="/sign-up">Get started <ArrowRight /></Link>
              </Button>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.en} delay={i * 100}>
                <div className="h-full rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-primary">{f.en}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 Video Speed Reader</footer>
    </div>
  );
}
