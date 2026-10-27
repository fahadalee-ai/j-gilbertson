import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ScanFace } from "lucide-react";
import { AppleGlyph, Button, CheckMark, Field, GoogleGlyph, Logo, Toggle } from "@/components/mobile";
import { firm, privacySections, termsSections } from "@/lib/content";
import { formatPhone, isEmail, isPhone, passwordLabel, passwordScore } from "@/lib/format";
import { haptic } from "@/lib/haptics";
import { DEMO, useApp, type ClientType } from "@/lib/store";
import { useOverlay } from "@/components/mobile";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" aria-label="Back" onClick={() => navigate({ to: "/welcome" })} className="mb-4 flex min-h-11 items-center gap-1 text-[17px] text-primary">
      <ArrowLeft size={20} /> Back
    </button>
  );
}

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { continueAsGuest, loginAsAlex, pushToast } = useApp();

  const social = (label: string) => {
    haptic("success");
    loginAsAlex();
    pushToast(`Signed in with ${label}`, "Welcome back, Alex.");
    navigate({ to: "/home" });
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#4C419A_0%,#4C419A_48%,#2EB4E8_100%)]">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10">
        <Logo size={112} />
        <h1 className="mt-5 text-center text-[28px] font-bold leading-tight text-white">{firm.shortName}</h1>
        <p className="mt-2 text-center text-[15px] text-white/90">{firm.tagline}</p>
      </div>
      <div className="rounded-t-[28px] bg-card px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 shadow-card">
        <div className="space-y-3">
          <Button onClick={() => navigate({ to: "/register" })}>Create Account</Button>
          <Button variant="secondary" onClick={() => navigate({ to: "/login" })}>Log In</Button>
          <Button
            variant="ghost"
            onClick={() => {
              continueAsGuest();
              navigate({ to: "/home" });
            }}
          >
            Continue as Guest
          </Button>
        </div>
        <div className="my-4 flex items-center gap-3 text-[13px] text-muted-foreground">
          <span className="h-px flex-1 bg-divider" /> or <span className="h-px flex-1 bg-divider" />
        </div>
        <div className="space-y-3">
          <Button variant="apple" onClick={() => social("Apple")}>
            <AppleGlyph /> Sign in with Apple
          </Button>
          <Button variant="google" onClick={() => social("Google")}>
            <GoogleGlyph /> Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginAsAlex, setRemember, remember, intent, pushToast, faceId } = useApp();
  const { ask } = useOverlay();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const message = login(email, password);
    if (message) {
      setErrors({ form: message });
      haptic("warning");
      return;
    }
    haptic("success");
    pushToast("Welcome back", "You are signed in.");
    navigate({ to: intent === "confirm-booking" ? "/book" : "/home" });
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-5 pb-8 pt-4">
      <BackButton />
      <h1 className="text-[34px] font-bold leading-tight">Welcome Back</h1>
      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">Log in to manage your appointments.</p>
      <div className="mt-6 space-y-4">
        <Field label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} placeholder="you@email.com" />
        <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} placeholder="Your password" />
        <Toggle checked={remember} onChange={setRemember} label="Remember me" />
        <button type="button" onClick={() => navigate({ to: "/forgot" })} className="min-h-11 text-[17px] font-semibold text-primary">
          Forgot Password?
        </button>
        {errors.form && <p className="text-[15px] text-destructive">{errors.form}</p>}
        <Button onClick={submit}>Log In</Button>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO.email);
            setPassword(DEMO.password);
          }}
          className="w-full text-center text-[13px] text-muted-foreground"
        >
          Preview login: {DEMO.email} · {DEMO.password}
        </button>
      </div>
      <div className="my-5 flex items-center gap-3 text-[13px] text-muted-foreground">
        <span className="h-px flex-1 bg-divider" /> or <span className="h-px flex-1 bg-divider" />
      </div>
      <div className="space-y-3">
        <Button variant="apple" onClick={() => { loginAsAlex(); navigate({ to: intent === "confirm-booking" ? "/book" : "/home" }); }}>
          <AppleGlyph /> Sign in with Apple
        </Button>
        <Button variant="google" onClick={() => { loginAsAlex(); navigate({ to: intent === "confirm-booking" ? "/book" : "/home" }); }}>
          <GoogleGlyph /> Continue with Google
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const allowed = faceId || (await ask("Face ID", "KJ Gilbertson CPA would like to use Face ID to sign you in on this iPhone."));
            if (!allowed) return;
            haptic("success");
            loginAsAlex();
            pushToast("Face ID recognized", "Signed in as Alex Morgan.");
            navigate({ to: intent === "confirm-booking" ? "/book" : "/home" });
          }}
        >
          <ScanFace size={20} /> Log in with Face ID
        </Button>
      </div>
      <p className="mt-6 text-center text-[15px] text-muted-foreground">
        Don't have an account?{" "}
        <button type="button" className="font-semibold text-primary" onClick={() => navigate({ to: "/register" })}>
          Register
        </button>
      </p>
    </div>
  );
}

export function RegisterScreen() {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const score = passwordScore(form.password);

  const set = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) next.name = "Enter your first and last name.";
    if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isPhone(form.phone)) next.phone = "Enter a 10-digit US phone number.";
    if (score < 2) next.password = "Use 8 or more characters with mixed case or a number.";
    if (form.password !== form.confirm) next.confirm = "Those passwords don't match.";
    if (!form.agree) next.agree = "Please agree to the Terms of Service and Privacy Policy.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const message = register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: formatPhone(form.phone),
      password: form.password,
      clientType: form.clientType,
    });
    if (message) {
      setErrors({ email: message });
      return;
    }
    haptic("success");
    navigate({ to: "/verify" });
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-5 pb-10 pt-4">
      <BackButton />
      <h1 className="text-[34px] font-bold leading-tight">Create Your Account</h1>
      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">We will text a code to verify your phone.</p>
      <div className="mt-6 space-y-4">
        <Field label="First name" value={form.firstName} onChange={(value) => set("firstName", value)} autoComplete="given-name" error={errors.name} />
        <Field label="Last name" value={form.lastName} onChange={(value) => set("lastName", value)} autoComplete="family-name" />
        <Field label="Email" type="email" inputMode="email" value={form.email} onChange={(value) => set("email", value)} error={errors.email} autoComplete="email" />
        <Field label="Phone number" inputMode="tel" value={form.phone} onChange={(value) => set("phone", formatPhone(value))} error={errors.phone} placeholder="(702) 555-0100" autoComplete="tel" />
        <Field label="Password" type="password" value={form.password} onChange={(value) => set("password", value)} error={errors.password} autoComplete="new-password" />
        <div>
          <div className="flex gap-1" aria-hidden>
            {[0, 1, 2, 3].map((bar) => (
              <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar < score ? "bg-primary" : "bg-divider"}`} />
            ))}
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">Strength: {passwordLabel(score)}</p>
        </div>
        <Field label="Confirm password" type="password" value={form.confirm} onChange={(value) => set("confirm", value)} error={errors.confirm} autoComplete="new-password" />
        <button
          type="button"
          onClick={() => openClientSheet(form.clientType, (value) => set("clientType", value))}
          className="flex min-h-[52px] w-full items-center justify-between rounded-[14px] border border-divider bg-card px-4 text-left"
        >
          <span>
            <span className="block text-[13px] text-muted-foreground">I am a</span>
            <span className="text-[17px]">{form.clientType}</span>
          </span>
        </button>
        <label className="flex items-start gap-3 text-[15px] leading-relaxed">
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
        {errors.agree && <p className="text-[13px] text-destructive">{errors.agree}</p>}
        <Button onClick={submit}>Create Account</Button>
      </div>
      <p className="mt-6 text-center text-[15px] text-muted-foreground">
        Already have an account?{" "}
        <button type="button" className="font-semibold text-primary" onClick={() => navigate({ to: "/login" })}>
          Log In
        </button>
      </p>
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
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const verify = () => {
    if (digits.join("").length < 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!pendingUserId || !completeVerification()) {
      setError("Create an account first, then request a code.");
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
    <div className="flex h-full flex-col px-5 pb-8 pt-4">
      <BackButton />
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
          {error && <p className="mt-3 text-[13px] text-destructive">{error}</p>}
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
  );
}

export function ForgotScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-4">
      <BackButton />
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
            <Field label="Email" type="email" inputMode="email" value={email} onChange={setEmail} error={error} autoComplete="email" />
          </div>
          <div className="mt-6">
            <Button
              onClick={() => {
                if (!isEmail(email)) {
                  setError("Enter the email on your account.");
                  return;
                }
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
