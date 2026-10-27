import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, CalendarDays, CalendarPlus, House, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { useApp } from "@/lib/store";

const tabs = [
  { to: "/home", label: "Home", icon: House },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/book", label: "Book", icon: CalendarPlus },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

const roots = new Set(tabs.map((tab) => tab.to));

export function TabBar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { booking, resetBooking } = useApp();
  if (!roots.has(pathname as (typeof tabs)[number]["to"])) return null;
  if (pathname === "/book" && booking.step === 6) return null;

  return (
    <nav aria-label="Primary" className="grid shrink-0 grid-cols-5 border-t border-divider bg-card/95 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur">
      {tabs.map((tab) => {
        const active = pathname === tab.to;
        const Icon = tab.icon;
        return (
          <button
            key={tab.to}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => {
              haptic("light");
              if (tab.to === "/book" && booking.step === 6) resetBooking();
              navigate({ to: tab.to });
            }}
            className="flex min-h-[52px] flex-col items-center justify-center gap-0.5"
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-primary" : "text-muted-foreground"} />
            <span className={cn("text-[12px] font-medium", active ? "text-primary" : "text-muted-foreground")}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
