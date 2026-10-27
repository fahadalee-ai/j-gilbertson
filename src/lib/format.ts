import { format, parse, addMinutes } from "date-fns";

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string) {
  const d = digits(value).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isPhone(value: string) {
  return digits(value).length === 10;
}

export function passwordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

export function passwordLabel(score: number) {
  return ["Too short", "Weak", "Fair", "Good", "Strong"][score] ?? "Too short";
}

export function isoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function longDate(iso: string) {
  return format(parse(iso, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");
}

export function shortDate(iso: string) {
  return format(parse(iso, "yyyy-MM-dd", new Date()), "EEE, MMM d");
}

export function monthLabel(iso: string) {
  return format(parse(iso, "yyyy-MM-dd", new Date()), "MMM d");
}

export function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function slotToDate(iso: string, time: string) {
  return parse(`${iso} ${time}`, "yyyy-MM-dd h:mm a", new Date());
}

export function addMins(iso: string, time: string, minutes: number) {
  return addMinutes(slotToDate(iso, time), minutes);
}

export function referenceCode() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `KJG-${n}`;
}

export function fileKind(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (/\.(png|jpe?g|heic|webp)$/.test(lower)) return "Image";
  return "File";
}
