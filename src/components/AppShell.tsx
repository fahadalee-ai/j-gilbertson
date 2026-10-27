import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Check, WifiOff, X } from "lucide-react";
import { OverlayProvider } from "./mobile";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const { ready, toasts, dismissToast } = useApp();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className="min-h-dvh">
      <div id="app-shell" className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background text-foreground">
        <OverlayProvider>
          {!online && (
            <div className="z-40 flex items-center gap-2 bg-[#1C1B2E] px-4 py-2 text-[13px] text-white">
              <WifiOff size={16} />
              You're offline. You can keep browsing. Booking confirms when you reconnect.
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-hidden">{ready ? children : <div className="h-full bg-background" />}</div>
          <div className="pointer-events-none absolute inset-x-0 top-3 z-[70] flex flex-col gap-2 px-4">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto flex items-start gap-3 rounded-[16px] bg-[#1C1B2E] px-4 py-3 text-white shadow-card">
                <Check className="mt-0.5 shrink-0 text-[#8EE0B8]" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{toast.title}</p>
                  {toast.body && <p className="text-[13px] leading-relaxed text-white/80">{toast.body}</p>}
                </div>
                <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)} className="flex h-11 w-11 items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </OverlayProvider>
      </div>
    </div>
  );
}
