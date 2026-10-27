import { useCanGoBack, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  WifiOff,
  X,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import logo from "@/img/logo.png";
import { cn } from "@/lib/utils";

type AlertAction = { label: string; role?: "cancel" | "destructive" | "primary"; onPress?: () => void };
type AlertState = { title: string; message?: string; actions: AlertAction[] } | null;
type SheetState = { title?: string; content: ReactNode } | null;

const OverlayCtx = createContext<{
  openSheet: (sheet: SheetState) => void;
  closeSheet: () => void;
  openAlert: (alert: AlertState) => void;
  ask: (title: string, message: string) => Promise<boolean>;
} | null>(null);

export function useOverlay() {
  const value = useContext(OverlayCtx);
  if (!value) throw new Error("useOverlay must be used inside OverlayProvider");
  return value;
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState>(null);
  const [alert, setAlert] = useState<AlertState>(null);
  const askRef = useRef<(value: boolean) => void>(() => {});

  const api = {
    openSheet: setSheet,
    closeSheet: () => setSheet(null),
    openAlert: setAlert,
    ask: (title: string, message: string) =>
      new Promise<boolean>((resolve) => {
        askRef.current = resolve;
        setAlert({
          title,
          message,
          actions: [
            { label: "Don't Allow", role: "cancel", onPress: () => resolve(false) },
            { label: "Allow", role: "primary", onPress: () => resolve(true) },
          ],
        });
      }),
  };

  return (
    <OverlayCtx.Provider value={api}>
      {children}
      {sheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <button aria-label="Close sheet" className="absolute inset-0 bg-black/40" onClick={() => setSheet(null)} />
          <div className="sheet-up relative max-h-[88%] overflow-y-auto rounded-t-[20px] bg-[var(--sheet)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 shadow-card">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-divider" />
            {sheet.title && <h2 className="mb-3 text-[20px] font-semibold leading-snug">{sheet.title}</h2>}
            {sheet.content}
          </div>
        </div>
      )}
      {alert && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center px-8">
          <button aria-label="Dismiss alert" className="absolute inset-0 bg-black/40" onClick={() => setAlert(null)} />
          <div role="alertdialog" aria-labelledby="alert-title" className="relative w-full max-w-[300px] overflow-hidden rounded-[16px] bg-[var(--sheet)] text-center shadow-card">
            <div className="px-4 pb-4 pt-5">
              <h2 id="alert-title" className="text-[17px] font-semibold leading-snug">
                {alert.title}
              </h2>
              {alert.message && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{alert.message}</p>}
            </div>
            <div className="border-t border-divider">
              {alert.actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={cn(
                    "block min-h-11 w-full border-t border-divider text-[17px] first:border-t-0",
                    action.role === "destructive" && "font-semibold text-destructive",
                    action.role === "primary" && "font-semibold text-primary",
                    action.role === "cancel" && "text-primary",
                    !action.role && "text-primary",
                  )}
                  onClick={() => {
                    setAlert(null);
                    action.onPress?.();
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </OverlayCtx.Provider>
  );
}

export function Logo({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("overflow-hidden rounded-[24%] bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]", className)}
      style={{ width: size, height: size }}
    >
      <img src={logo} alt="KJ Gilbertson CPA" className="h-full w-full rounded-[20%] object-cover" />
    </div>
  );
}

export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const base = import.meta.env.BASE_URL || "/";
  return <img src={`${base}images/${src}`} alt={alt} className={cn("object-cover", className)} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "white" | "apple" | "google";
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] px-4 text-[17px] font-semibold transition-transform duration-200 active:scale-[0.98] disabled:opacity-45",
        variant === "primary" && "bg-primary text-white",
        variant === "secondary" && "border-2 border-primary bg-transparent text-primary",
        variant === "ghost" && "min-h-11 text-primary",
        variant === "destructive" && "bg-destructive text-white",
        variant === "white" && "bg-white text-ink",
        variant === "apple" && "bg-black text-white dark:bg-white dark:text-black",
        variant === "google" && "border border-divider bg-card text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  inputMode,
  right,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  right?: ReactNode;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</span>
      <span className="relative block">
        <input
          id={id}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-[52px] w-full rounded-[14px] border bg-card px-4 text-[17px] text-foreground placeholder:text-muted-foreground",
            error ? "border-destructive" : "border-divider",
            (isPassword || right) && "pr-12",
          )}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-muted-foreground"
            onClick={() => setShow((current) => !current)}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {right}
      </span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-[13px] text-destructive">
          <AlertTriangle size={14} aria-hidden /> {error}
        </span>
      )}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  max = 400,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
  placeholder?: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">) {
  const id = useId();
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-medium text-muted-foreground">
        {label}
        <span>
          {value.length}/{max}
        </span>
      </span>
      <textarea
        id={id}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "min-h-28 w-full rounded-[14px] border bg-card px-4 py-3 text-[17px] leading-relaxed placeholder:text-muted-foreground",
          error ? "border-destructive" : "border-divider",
        )}
      />
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-[17px] leading-snug">{label}</p>
        {detail && <p className="text-[13px] leading-relaxed text-muted-foreground">{detail}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-8 w-[52px] shrink-0 rounded-full p-[2px] transition-colors",
          checked ? "bg-success" : "bg-[#D5D8E4] dark:bg-[#3A3A48]",
        )}
      >
        <span
          className="block h-7 w-7 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.28)] transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0px)" }}
        />
      </button>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="grid rounded-[12px] bg-muted p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-11 rounded-[10px] px-2 text-[13px] font-semibold",
              selected ? "bg-card text-foreground shadow-card" : "text-muted-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSubmit?: () => void;
}) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="relative"
    >
      <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-sky" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-[12px] bg-muted pl-10 pr-4 text-[17px] placeholder:text-muted-foreground"
      />
    </form>
  );
}

function parentHref(pathname: string) {
  if (/^\/services\/.+/.test(pathname)) return "/services";
  if (/^\/appointments\/.+/.test(pathname)) return "/appointments";
  if (pathname.startsWith("/profile/") && pathname !== "/profile") return "/profile";
  if (pathname === "/notifications") return "/home";
  if (pathname === "/login" || pathname === "/onboarding") return "/onboarding";
  if (pathname === "/register" || pathname === "/forgot" || pathname === "/verify") return "/login";
  return "/home";
}

export function NavBar({
  title,
  back = false,
  onBack,
  right,
  transparent = false,
}: {
  title?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (canGoBack) {
      router.history.back();
      return;
    }
    const href = parentHref(pathname);
    if (href === "/services") navigate({ to: "/services", search: { q: "" } });
    else if (href === "/appointments") navigate({ to: "/appointments" });
    else if (href === "/profile") navigate({ to: "/profile" });
    else if (href === "/onboarding") navigate({ to: "/onboarding" });
    else if (href === "/login") navigate({ to: "/login" });
    else navigate({ to: "/home" });
  };

  return (
    <header
      className={cn(
        "z-20 shrink-0 border-b",
        transparent ? "border-transparent bg-transparent" : "border-divider bg-background/95 backdrop-blur-xl",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="grid h-11 grid-cols-[5.75rem_minmax(0,1fr)_5.75rem] items-center">
        {back ? (
          <button
            type="button"
            aria-label="Back"
            onClick={handleBack}
            className="flex h-11 items-center gap-0.5 pl-1 text-[17px] font-medium text-primary"
          >
            <ChevronLeft size={26} strokeWidth={2.4} />
            Back
          </button>
        ) : (
          <span />
        )}
        <h1 className="truncate text-center text-[17px] font-semibold">{title}</h1>
        <div className="flex items-center justify-end pr-2">{right}</div>
      </div>
    </header>
  );
}

export function Page({
  title,
  large,
  back,
  onBack,
  right,
  children,
  footer,
  onRefresh,
}: {
  title?: string;
  large?: boolean;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onRefresh?: () => Promise<void> | void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    const shell = document.getElementById("app-shell");
    if (!shell || !back) return;
    let tracking = false;
    let x = 0;
    let y = 0;
    const start = (event: TouchEvent) => {
      const touch = event.touches[0];
      const rect = shell.getBoundingClientRect();
      if (touch.clientX - rect.left < 24) {
        tracking = true;
        x = touch.clientX;
        y = touch.clientY;
      }
    };
    const end = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (touch.clientX - x > 80 && Math.abs(touch.clientY - y) < 60) {
        shell.querySelector<HTMLButtonElement>('header button[aria-label="Back"]')?.click();
      }
    };
    shell.addEventListener("touchstart", start, { passive: true });
    shell.addEventListener("touchend", end);
    return () => {
      shell.removeEventListener("touchstart", start);
      shell.removeEventListener("touchend", end);
    };
  }, [back]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <NavBar title={large && !compact ? undefined : title} back={back} onBack={onBack} right={right} />
      <div
        ref={scroller}
        onScroll={(event) => setCompact(event.currentTarget.scrollTop > 24)}
        onTouchStart={(event) => {
          if (!onRefresh) return;
          startY.current = event.touches[0].clientY;
        }}
        onTouchMove={(event) => {
          if (!onRefresh || refreshing || (scroller.current?.scrollTop ?? 0) > 0) return;
          const delta = event.touches[0].clientY - startY.current;
          if (delta > 0) setPull(Math.min(delta, 90));
        }}
        onTouchEnd={() => {
          if (pull > 64 && onRefresh) {
            setRefreshing(true);
            Promise.resolve(onRefresh()).finally(() => {
              setRefreshing(false);
              setPull(0);
            });
          } else setPull(0);
        }}
        className="min-h-0 flex-1 overflow-y-auto no-scrollbar"
      >
        {(pull > 0 || refreshing) && (
          <p className="py-2 text-center text-[13px] text-muted-foreground">{refreshing ? "Refreshing…" : "Pull to refresh"}</p>
        )}
        {large && title && (
          <h2 className="px-5 pb-2 text-[34px] font-bold leading-[1.15] tracking-tight">{title}</h2>
        )}
        {children}
        <div className="h-4" />
      </div>
      {footer && <div className="shrink-0 border-t border-divider bg-background/95 px-5 py-3 backdrop-blur">{footer}</div>}
    </div>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-3 flex items-end justify-between px-5">
      <h2 className="text-[22px] font-semibold leading-tight tracking-tight">{title}</h2>
      {action && (
        <button type="button" onClick={onAction} className="min-h-11 text-[15px] font-semibold text-primary">
          {action}
        </button>
      )}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[20px] bg-card shadow-card", className)}>{children}</div>;
}

export function PopularBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-accent bg-[#F8E8F3] px-2 py-0.5 text-[13px] font-semibold text-[#6E2458] dark:bg-[#3A2434] dark:text-[#F3C3E2]">
      Popular
    </span>
  );
}

export function StatusBadge({ status }: { status: "confirmed" | "pending" | "cancelled" | "completed" }) {
  const map = {
    confirmed: { label: "Confirmed", className: "bg-[color-mix(in_srgb,var(--success)_18%,transparent)] text-[var(--success-ink)]" },
    pending: { label: "Pending", className: "bg-[color-mix(in_srgb,var(--warning)_22%,transparent)] text-[var(--warning-ink)]" },
    cancelled: { label: "Cancelled", className: "bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] text-[var(--danger-ink)]" },
    completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  }[status];
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[13px] font-semibold", map.className)}>{map.label}</span>;
}

export function Group({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <section className="mt-6">
      {label && <h2 className="mb-2 px-8 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</h2>}
      <div className="mx-5 overflow-hidden rounded-[16px] bg-card shadow-card">{children}</div>
    </section>
  );
}

export function Row({
  icon,
  title,
  detail,
  onClick,
  destructive,
  value,
  chevron = true,
}: {
  icon?: ReactNode;
  title: string;
  detail?: string;
  onClick?: () => void;
  destructive?: boolean;
  value?: string;
  chevron?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[52px] w-full items-center gap-3 border-t border-divider px-4 py-2 text-left first:border-t-0">
      {icon && <span className="flex h-8 w-8 items-center justify-center text-sky">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[17px]", destructive && "text-destructive")}>{title}</span>
        {detail && <span className="block text-[13px] text-muted-foreground">{detail}</span>}
      </span>
      {value && <span className="text-[15px] text-muted-foreground">{value}</span>}
      {chevron && !destructive && <ChevronRight size={18} className="text-muted-foreground" />}
    </button>
  );
}

export function EmptyState({
  title,
  body,
  action,
  onAction,
  image,
  imageAlt,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="mx-5 rounded-[20px] bg-card px-5 py-8 text-center shadow-card">
      {image && <Photo src={image} alt={imageAlt ?? ""} className="mx-auto mb-4 h-36 w-full rounded-[16px]" />}
      <h3 className="text-[20px] font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      {action && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{action}</Button>
        </div>
      )}
    </div>
  );
}

export function ErrorState({ title, body, onRetry }: { title: string; body: string; onRetry: () => void }) {
  return (
    <div className="mx-5 rounded-[20px] bg-card px-5 py-8 text-center shadow-card">
      <WifiOff className="mx-auto text-destructive" />
      <h3 className="mt-3 text-[20px] font-semibold">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}

export function SkeletonRows() {
  return (
    <div className="space-y-3 px-5">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3 rounded-[16px] bg-card p-3 shadow-card">
          <div className="skel h-16 w-16 rounded-[12px]" />
          <div className="flex-1 space-y-2 py-1">
            <div className="skel h-4 w-3/4 rounded" />
            <div className="skel h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-divider first:border-t-0">
      <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left">
        <span className="flex-1 text-[17px] font-medium leading-snug">{title}</span>
        <ChevronDown className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} size={18} />
      </button>
      {open && <div className="px-4 pb-4 text-[15px] leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

export function CheckMark() {
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_16%,transparent)]" style={{ animation: "pop 0.45s cubic-bezier(0.2, 1.4, 0.36, 1) both" }}>
      <svg viewBox="0 0 52 52" className="h-12 w-12" aria-hidden>
        <circle cx="26" cy="26" r="23" fill="none" stroke="var(--success)" strokeWidth="3" />
        <path
          d="M15 27.5 L23 35 L38 18"
          fill="none"
          stroke="var(--success)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{ animation: "draw 0.45s ease 0.25s forwards" }}
        />
      </svg>
    </div>
  );
}

export function AppleGlyph() {
  return (
    <svg viewBox="0 0 14 17" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M11.3 8.9c0-2 1.6-2.9 1.7-3-1-.1-1.9.6-2.4.6s-1.3-.6-2.1-.5c-1.1 0-2.1.6-2.6 1.6-1.1 1.9-.3 4.8.8 6.4.5.8 1.2 1.6 2 1.6s1.1-.5 2.1-.5 1.3.5 2.1.5 1.4-.8 1.9-1.5c.6-.9.8-1.7.9-1.8-.1 0-1.6-.6-1.6-2.4zM9.6 4.4c.4-.5.7-1.3.6-2-.6 0-1.4.4-1.8.9-.4.5-.7 1.2-.6 1.9.7.1 1.4-.3 1.8-.8z"
      />
    </svg>
  );
}

export function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M9 7.4v3.5h4.9c-.2 1.2-1.4 3.5-4.9 3.5A5.4 5.4 0 1 1 9 3.6c1.5 0 2.6.6 3.2 1.2l2.2-2.1C13.1 1.4 11.2.5 9 .5 4.8.5 1.4 3.9 1.4 8.1S4.8 15.7 9 15.7c5.2 0 8.6-3.6 8.6-8.7 0-.6 0-1-.1-1.5H9z" />
    </svg>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <span className="text-[13px] font-semibold text-[#8A6400] dark:text-[#FFD56A]" aria-label={`${count} out of 5 stars`}>
      {"★".repeat(count)}
      <span className="text-muted-foreground">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export function CloseIcon() {
  return <X size={18} />;
}

export function CheckIcon() {
  return <Check size={18} />;
}
