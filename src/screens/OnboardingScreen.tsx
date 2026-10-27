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
      className="flex h-full flex-col bg-background"
      onTouchStart={(event) => {
        startX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - startX.current;
        if (delta < -50 && index < onboarding.length - 1) setIndex(index + 1);
        if (delta > 50 && index > 0) setIndex(index - 1);
      }}
    >
      <div className="flex justify-end px-3 pt-2">
        <button type="button" onClick={() => finish("/welcome")} className="min-h-11 px-3 text-[17px] font-semibold text-primary">
          Skip
        </button>
      </div>
      <div className="px-5">
        <Photo src={slide.image} alt={slide.alt} className="h-[46vh] w-full rounded-[20px]" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">{slide.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{slide.body}</p>
        <div className="mt-5 flex gap-2" aria-label="Onboarding progress">
          {onboarding.map((item, dot) => (
            <span key={item.title} className={`h-2 rounded-full ${dot === index ? "w-6 bg-primary" : "w-2 bg-divider"}`} />
          ))}
        </div>
        <div className="mt-auto pt-6">
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
  );
}
