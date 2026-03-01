import { client } from "@/client";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

type SignupPayload = {
  email: string;
  password: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const CAPABILITIES = [
  {
    label: "200+ Models",
    detail: "Access GPT-4, Claude, Gemini, Llama & more through one endpoint",
  },
  {
    label: "Smart Fallback",
    detail: "Automatic failover across providers — zero downtime",
  },
  {
    label: "Real-time Analytics",
    detail: "Per-request cost, latency, and token tracking",
  },
  {
    label: "Pay As You Go",
    detail: "Transparent pricing, no minimums, cancel anytime",
  },
];

export function Signup() {
  const navigate = useNavigate();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null
  );

  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
    }),
    [password]
  );

  const isPasswordStrong =
    passwordChecks.minLength &&
    passwordChecks.hasLetter &&
    passwordChecks.hasNumber;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const checksCompleted = [
    passwordChecks.minLength,
    passwordChecks.hasLetter,
    passwordChecks.hasNumber,
    passwordsMatch,
  ].filter(Boolean).length;

  const mutation = useMutation({
    mutationFn: async ({ email, password }: SignupPayload) => {
      const response = await client.auth["sign-up"].post({ email, password });

      if (response.status !== 200) {
        const responseData = response.data as { message?: string } | null;
        throw new Error(
          responseData?.message ??
            "We could not create your account right now. Please try again."
        );
      }

      return response.data;
    },
    onMutate: () => {
      setFormError(null);
    },
    onSuccess: () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRedirectCountdown(3);
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      navigate("/signin");
      return;
    }
    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFormError("Please provide a valid email address.");
      return;
    }
    if (!isPasswordStrong) {
      setFormError(
        "Password must be at least 8 characters with a letter and a number."
      );
      return;
    }
    if (!passwordsMatch) {
      setFormError("Passwords do not match.");
      return;
    }
    mutation.mutate({ email, password });
  }

  const isSubmitDisabled =
    mutation.isPending ||
    mutation.isSuccess ||
    email.length === 0 ||
    password.length === 0 ||
    confirmPassword.length === 0;

  /* ---- Success state ---- */
  if (mutation.isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="noise-overlay absolute inset-0 bg-background" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Countdown ring */}
          <div className="relative flex size-24 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                className="countdown-ring-animate"
              />
            </svg>
            <svg
              className="size-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                className="check-animate"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              You're in.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your workspace is ready. Redirecting to sign in
              {redirectCountdown !== null && (
                <span className="font-mono text-foreground">
                  {" "}
                  in {redirectCountdown}s
                </span>
              )}
              ...
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border/60"
          >
            <Link to="/signin">Skip to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ---- Main signup layout ---- */
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* ---- Left hero panel ---- */}
      <div className="noise-overlay relative hidden w-[50%] overflow-hidden lg:block xl:w-[48%]">
        {/* Grid pattern bg */}
        <div className="grid-pattern absolute inset-0 opacity-40" />

        {/* Floating glow orbs */}
        <div
          className="orb-1 absolute left-[15%] top-[20%] size-72 rounded-full opacity-20 blur-[80px]"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <div
          className="orb-2 absolute bottom-[25%] right-[10%] size-56 rounded-full opacity-15 blur-[60px]"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div
          className="orb-3 absolute bottom-[10%] left-[40%] size-40 rounded-full opacity-10 blur-[50px]"
          style={{ backgroundColor: "var(--chart-4)" }}
        />

        {/* Gradient fade at edges */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, var(--background), transparent 30%, transparent 70%, var(--background)),
              linear-gradient(to bottom, var(--background), transparent 15%, transparent 85%, var(--background))
            `,
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-4 text-primary"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              OpenRouter
            </span>
          </div>

          {/* Hero text */}
          <div className="max-w-md space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground xl:text-6xl">
                Route to
                <br />
                <span className="text-primary">any model.</span>
              </h1>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                A single API that unifies every major LLM. Build once, switch
                providers in a line of code.
              </p>
            </div>

            {/* Capability list */}
            <div className="space-y-4">
              {CAPABILITIES.map((cap, i) => (
                <div key={cap.label} className="group flex items-start gap-4">
                  <div className="relative mt-1.5 flex size-5 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/20" />
                    <span className="relative font-mono text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {cap.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cap.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="flex items-center gap-3">
            <div
              className="glow-line h-px w-8"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <p className="text-xs text-muted-foreground">
              Trusted by 10,000+ developers
            </p>
          </div>
        </div>
      </div>

      {/* ---- Right form panel ---- */}
      <div className="relative flex flex-1 items-center justify-center p-6 md:p-12">
        {/* Subtle gradient accent */}
        <div
          className="absolute right-0 top-0 h-[50%] w-[60%] opacity-30 blur-[100px]"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile-only branding */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-4 text-primary"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              OpenRouter
            </span>
          </div>

          <Card className="card-glow border-border/50 bg-card/70 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-6 space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Create an account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Get your API key and start routing in under a minute.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="stagger-enter space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-email"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={mutation.isPending}
                    className="h-10 bg-background/50 placeholder:text-muted-foreground/40"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-password"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={mutation.isPending}
                      className="h-10 bg-background/50 pr-10 placeholder:text-muted-foreground/40"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-confirm-password"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Confirm password
                  </Label>
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={mutation.isPending}
                    className="h-10 bg-background/50 placeholder:text-muted-foreground/40"
                  />
                </div>

                {/* Password strength */}
                {password.length > 0 && (
                  <div className="space-y-3 rounded-lg border border-border/40 bg-background/30 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Segmented strength bar */}
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor:
                              i < checksCompleted
                                ? checksCompleted <= 1
                                  ? "var(--destructive)"
                                  : checksCompleted <= 2
                                    ? "var(--chart-5)"
                                    : checksCompleted <= 3
                                      ? "var(--accent)"
                                      : "var(--success)"
                                : "var(--muted)",
                          }}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <PasswordCheck
                        label="8+ characters"
                        met={passwordChecks.minLength}
                      />
                      <PasswordCheck
                        label="Has a letter"
                        met={passwordChecks.hasLetter}
                      />
                      <PasswordCheck
                        label="Has a number"
                        met={passwordChecks.hasNumber}
                      />
                      <PasswordCheck
                        label="Passwords match"
                        met={passwordsMatch}
                      />
                    </div>
                  </div>
                )}

                {/* Error */}
                {formError && (
                  <Alert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-10 w-full font-medium"
                  disabled={isSubmitDisabled}
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="bg-border/40" />
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/50">
            By creating an account you agree to the{" "}
            <span className="underline underline-offset-2 transition-colors hover:text-muted-foreground">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2 transition-colors hover:text-muted-foreground">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={met}
        tabIndex={-1}
        className="pointer-events-none size-3 rounded-[2px] border-muted-foreground/30"
      />
      <span
        className={`text-[11px] transition-colors duration-200 ${
          met ? "text-foreground" : "text-muted-foreground/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}
