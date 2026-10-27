export function haptic(kind: "light" | "success" | "warning" = "light") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const pattern = kind === "success" ? [12, 40, 16] : kind === "warning" ? [20, 30, 20] : [10];
    navigator.vibrate?.(pattern);
  } catch {
    /* Some browsers block vibration without a user gesture. */
  }
}
