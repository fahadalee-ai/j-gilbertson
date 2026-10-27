import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button, Photo } from "@/components/mobile";
import { onboarding } from "@/lib/content";
import { haptic } from "@/lib/haptics";
import { useApp } from "@/lib/store";

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { markOnboarded } = useApp();
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const slide = onboarding[index];
  const last = index === onboarding.length - 1;

  const finish = (path: "/welcome") => {
    haptic("light");
    markOnboarded();
    navigate({ to: path });
  };

  return (
    <div
      className="relative h-full overflow-hidden bg-[#0E0C1C]"
      onTouchStart={(event) => {
        startX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - startX.current;
        if (delta < -50 && index < onboarding.length - 1) setIndex(index + 1);
        if (delta > 50 && index > 0) setIndex(index - 1);
      }}
    >
      <Photo src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-[center_30%]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0E0C1C]/80 to-transparent" />
      <div className="relative flex h-full flex-col">
        <div className="flex justify-end px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => finish("/welcome")}
            className="pointer-events-auto min-h-11 rounded-full bg-[#0E0C1C]/70 px-4 text-[17px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)] backdrop-blur-md"
          >
            Skip
          </button>
        </div>
        <div className="mt-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="rounded-[24px] bg-[#0E0C1C]/92 px-5 py-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-white">{slide.title}</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-white/92">{slide.body}</p>
            <div className="mt-5 flex gap-2" aria-label="Onboarding progress">
              {onboarding.map((item, dot) => (
                <span
                  key={item.title}
                  className={`h-2 rounded-full ${dot === index ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                />
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={() => {
                  if (last) finish("/welcome");
                  else {
                    haptic("light");
                    setIndex(index + 1);
                  }
                }}
              >
                {last ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
