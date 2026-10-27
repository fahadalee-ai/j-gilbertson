import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { AppleGlyph, Button, CheckMark, Field, GoogleGlyph, Logo, NavBar, Toggle } from "@/components/mobile";
import { privacySections, termsSections } from "@/lib/content";
import { formatPhone, passwordLabel, passwordScore } from "@/lib/format";
import { haptic } from "@/lib/haptics";
import { DEMO, useApp, type ClientType } from "@/lib/store";
import { useOverlay } from "@/components/mobile";

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-[linear-gradient(165deg,#322C72_0%,#4C419A_70%,#3E4FA6_100%)] px-5 pb-16 pt-6 text-white">
      <Logo size={64} />
      <h1 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight">{title}</h1>
      <p className="mt-2 max-w-[18rem] text-[16px] leading-relaxed text-white/85">{subtitle}</p>
    </div>
  );
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginAsAlex, setRemember, remember, intent, pushToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nextPath = intent === "confirm-booking" ? "/book" : "/home";

  const submit = () => {
    if (login(email, password)) loginAsAlex();
    haptic("success");
    pushToast("Welcome back", "You are signed in.");
    navigate({ to: nextPath });
  };

  const social = () => {
    haptic("success");
    loginAsAlex();
    navigate({ to: nextPath });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <NavBar title="Log In" back onBack={() => navigate({ to: "/onboarding" })} />
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
      <AuthHeader title="Welcome back" subtitle="Sign in to view visits, documents, and reminders." />
      <div className="-mt-8 rounded-t-[28px] bg-background px-5 pb-10 pt-6">
        <div className="space-y-4 rounded-[24px] bg-card p-4 shadow-card">
          <Field label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} placeholder="Your password" />
          <Toggle checked={remember} onChange={setRemember} label="Remember me" />
          <div className="-mt-2 flex justify-end">
            <button type="button" onClick={() => navigate({ to: "/forgot" })} className="min-h-11 text-[15px] font-semibold text-primary">
              Forgot password?
            </button>
          </div>
          <Button onClick={submit}>Log In</Button>
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO.email);
              setPassword(DEMO.password);
            }}
            className="w-full rounded-[12px] bg-muted px-3 py-2 text-center text-[13px] text-muted-foreground"
          >
            Preview · {DEMO.email}
          </button>
        </div>
        <div className="my-5 flex items-center gap-3 text-[13px] text-muted-foreground">
          <span className="h-px flex-1 bg-divider" /> or <span className="h-px flex-1 bg-divider" />
        </div>
        <div className="space-y-3">
          <Button variant="apple" onClick={social}>
            <AppleGlyph /> Sign in with Apple
          </Button>
          <Button variant="google" onClick={social}>
            <GoogleGlyph /> Continue with Google
          </Button>
        </div>
        <p className="mt-6 text-center text-[15px] text-muted-foreground">
          New to the firm?{" "}
          <button type="button" className="font-semibold text-primary" onClick={() => navigate({ to: "/register" })}>
            Create an account
          </button>
        </p>
      </div>
      </div>
    </div>
  );
}

export function RegisterScreen() {
  const navigate = useNavigate();
  const { loginAsAlex } = useApp();
  const { register, openSheet: openClientSheet, openLegal } = useRegisterSheet();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    clientType: "Small Business Owner" as ClientType,
    agree: false,
  });
  const score = passwordScore(form.password);
  const strength = score <= 1 ? "bg-warning" : score === 2 ? "bg-primary" : "bg-success";

  const set = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const message = register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: formatPhone(form.phone),
      password: form.password,
      clientType: form.clientType,
    });
    if (message) loginAsAlex();
    haptic("success");
    navigate({ to: message ? "/home" : "/verify" });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <NavBar title="Register" back onBack={() => navigate({ to: "/login" })} />
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
      <AuthHeader title="Create your account" subtitle="A few details, then a text code to confirm your phone." />
      <div className="-mt-8 rounded-t-[28px] bg-background px-5 pb-10 pt-6">
        <div className="space-y-4 rounded-[24px] bg-card p-4 shadow-card">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" value={form.firstName} onChange={(value) => set("firstName", value)} autoComplete="given-name" />
            <Field label="Last name" value={form.lastName} onChange={(value) => set("lastName", value)} autoComplete="family-name" />
          </div>
          <Field label="Email" type="email" inputMode="email" value={form.email} onChange={(value) => set("email", value)} autoComplete="email" placeholder="you@email.com" />
          <Field label="Phone number" inputMode="tel" value={form.phone} onChange={(value) => set("phone", formatPhone(value))} placeholder="(702) 555-0100" autoComplete="tel" />
          <Field label="Password" type="password" value={form.password} onChange={(value) => set("password", value)} autoComplete="new-password" placeholder="Create a password" />
          <div>
            <div className="flex gap-1" aria-hidden>
              {[0, 1, 2, 3].map((bar) => (
                <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar < score ? strength : "bg-divider"}`} />
              ))}
            </div>
            <p className="mt-1.5 text-[13px] text-muted-foreground">Strength: {passwordLabel(score)}</p>
          </div>
          <Field label="Confirm password" type="password" value={form.confirm} onChange={(value) => set("confirm", value)} autoComplete="new-password" />
          <button
            type="button"
            onClick={() => openClientSheet(form.clientType, (value) => set("clientType", value))}
            className="flex min-h-[52px] w-full items-center justify-between rounded-[14px] border border-divider bg-background px-4 text-left"
          >
            <span>
              <span className="block text-[13px] text-muted-foreground">I am a</span>
              <span className="text-[17px] font-medium">{form.clientType}</span>
            </span>
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
          <label className="flex items-start gap-3 rounded-[14px] bg-muted px-3 py-3 text-[15px] leading-relaxed">
            <input type="checkbox" checked={form.agree} onChange={(event) => set("agree", event.target.checked)} className="mt-1 h-5 w-5 accent-[#4C419A]" />
            <span>
              I agree to the{" "}
              <button type="button" className="font-semibold text-primary" onClick={() => openLegal("terms")}>
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="font-semibold text-primary" onClick={() => openLegal("privacy")}>
                Privacy Policy
              </button>
              .
            </span>
          </label>
          <Button onClick={submit}>Create Account</Button>
        </div>
        <p className="mt-6 text-center text-[15px] text-muted-foreground">
          Already have an account?{" "}
          <button type="button" className="font-semibold text-primary" onClick={() => navigate({ to: "/login" })}>
            Log in
          </button>
        </p>
      </div>
      </div>
    </div>
  );
}

function useRegisterSheet() {
  const { register } = useApp();
  const { openSheet, closeSheet } = useOverlay();
  return {
    register,
    openLegal: (kind: "privacy" | "terms") => {
      openSheet({
        title: kind === "privacy" ? "Privacy Policy" : "Terms of Service",
        content: (
          <div className="max-h-[60vh] overflow-y-auto pb-4">
            <LegalBody kind={kind} />
          </div>
        ),
      });
    },
    openSheet: (current: ClientType, onPick: (value: ClientType) => void) => {
      const options: ClientType[] = ["Individual", "Freelancer", "Small Business Owner"];
      openSheet({
        title: "I am a",
        content: (
          <div className="pb-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className="flex min-h-[52px] w-full items-center justify-between border-t border-divider text-left text-[17px] first:border-t-0"
                onClick={() => {
                  onPick(option);
                  closeSheet();
                }}
              >
                {option}
                {option === current ? <span className="text-primary">Selected</span> : null}
              </button>
            ))}
          </div>
        ),
      });
    },
  };
}

export function VerifyScreen() {
  const navigate = useNavigate();
  const { completeVerification, pendingUserId, intent, pushToast } = useApp();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [done, setDone] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const verify = () => {
    if (!pendingUserId || !completeVerification()) {
      pushToast("Create an account first, then request a code.");
      return;
    }
    haptic("success");
    setDone(true);
    window.setTimeout(() => {
      pushToast("Phone verified", "Your account is ready.");
      navigate({ to: intent === "confirm-booking" ? "/book" : "/home" });
    }, 900);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <NavBar title="Verify" back onBack={() => navigate({ to: "/register" })} />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4">
      <h1 className="text-[34px] font-bold leading-tight">Verify Your Phone</h1>
      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">Enter the 6-digit code we sent. Any 6 digits work in this preview.</p>
      {done ? (
        <div className="mt-16">
          <CheckMark />
          <p className="mt-4 text-center text-[20px] font-semibold">Phone verified</p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex justify-between gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputs.current[index] = node;
                }}
                value={digit}
                inputMode="numeric"
                aria-label={`Digit ${index + 1}`}
                maxLength={1}
                className="h-14 w-full rounded-[14px] border border-divider bg-card text-center text-[22px] font-semibold"
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(-1);
                  const next = [...digits];
                  next[index] = value;
                  setDigits(next);
                  if (value && index < 5) inputs.current[index + 1]?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
                }}
                onPaste={(event) => {
                  const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                  if (!pasted) return;
                  event.preventDefault();
                  const next = pasted.split("");
                  while (next.length < 6) next.push("");
                  setDigits(next);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={seconds > 0}
            onClick={() => {
              setSeconds(30);
              pushToast("Code sent", "Check your messages for a new code.");
            }}
            className="mt-4 min-h-11 text-[15px] font-semibold text-primary disabled:text-muted-foreground"
          >
            {seconds > 0 ? `Resend code in 00:${String(seconds).padStart(2, "0")}` : "Resend code"}
          </button>
          <div className="mt-auto">
            <Button onClick={verify}>Verify</Button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export function ForgotScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <NavBar title="Password" back onBack={() => navigate({ to: "/login" })} />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4">
      {sent ? (
        <div className="mt-10 text-center">
          <CheckMark />
          <h1 className="mt-5 text-[28px] font-bold">Check your email</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">
            If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.
          </p>
          <div className="mt-8">
            <Button onClick={() => navigate({ to: "/login" })}>Back to Login</Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-[34px] font-bold leading-tight">Forgot Password</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">We will email you a link to choose a new password.</p>
          <div className="mt-6">
            <Field label="Email" type="email" inputMode="email" value={email} onChange={setEmail} autoComplete="email" />
          </div>
          <div className="mt-6">
            <Button
              onClick={() => {
                haptic("success");
                setSent(true);
              }}
            >
              Send Reset Link
            </Button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export function LegalBody({ kind }: { kind: "privacy" | "terms" }) {
  const sections = kind === "privacy" ? privacySections : termsSections;
  return (
    <div className="space-y-5 px-5 pb-8">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-[20px] font-semibold">{section.title}</h2>
          <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
