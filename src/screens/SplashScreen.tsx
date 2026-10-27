import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/mobile";
import { firm } from "@/lib/content";
import { useApp } from "@/lib/store";

export function SplashScreen() {
  const navigate = useNavigate();
  const { ready, user, onboarded } = useApp();
  const [tagline, setTagline] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setTagline(true), 700);
    return () => window.clearTimeout(fade);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      if (user) navigate({ to: "/home" });
      else if (onboarded) navigate({ to: "/welcome" });
      else navigate({ to: "/onboarding" });
    }, reduce ? 400 : 2500);
    return () => window.clearTimeout(timer);
  }, [ready, user, onboarded, navigate]);

  return (
    <div className="flex h-full flex-col items-center bg-[linear-gradient(180deg,#3a3284_0%,#4C419A_46%,#2EB4E8_100%)] px-6">
      <div className="flex flex-1 flex-col items-center justify-center pb-16">
        <div className="logo-pop">
          <Logo size={148} />
        </div>
        <p className={`mt-6 max-w-[260px] text-center text-[15px] leading-relaxed text-white transition-opacity duration-500 ${tagline ? "opacity-100" : "opacity-0"}`}>
          {firm.tagline}
        </p>
      </div>
      <div className="pb-10" aria-hidden>
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1C1B2E]/25 border-t-[#1C1B2E]" />
      </div>
      <p className="sr-only">Loading KJ Gilbertson CPA</p>
    </div>
  );
}
