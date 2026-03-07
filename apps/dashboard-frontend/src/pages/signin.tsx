import { client } from "@/client";
import { signInBodySchema } from "@repo/contracts";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Separator,
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { type FormEvent, useState } from "react";

const CAPABILITIES = [
  {
    label: "Latest AI Models",
    detail: "Access flagship models from major providers through one integration surface",
  },
  {
    label: "One Consistent API",
    detail: "Keep your app code simple with a unified request shape across providers",
  },
  {
    label: "Provider Flexibility",
    detail: "Switch models and providers without rebuilding your product around one vendor",
  },
  {
    label: "Fast Iteration",
    detail: "Compare quality, speed, and cost without changing your architecture",
  },
];

export function Signin() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await client.auth["sign-in"].post({ email, password });

      if (response.status !== 200) {
        const responseData = response.error?.value;
        throw new Error(
          responseData?.message ??
            "We could not sign you in right now. Please try again."
        );
      }

      return response.data;
    },
    onMutate: () => {
      setFormError(null);
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: ({ value }) => {
        const parsed = signInBodySchema.safeParse(value);
        if (parsed.success) return undefined;
        return (
          parsed.error.issues[0]?.message ?? "Please fix the highlighted fields."
        );
      },
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const parsed = signInBodySchema.safeParse(value);
      if (!parsed.success) {
        setFormError(
          parsed.error.issues[0]?.message ??
            "Please fix the highlighted fields."
        );
        return;
      }

      try {
        await mutation.mutateAsync({
          email: parsed.data.email,
          password: parsed.data.password,
        });
      } catch {
        // Error UI is handled by React Query onError -> formError state.
      }
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit();
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* ---- Left hero panel ---- */}
      <div className="noise-overlay relative hidden w-[50%] overflow-hidden lg:block xl:w-[48%]">
        <div className="grid-pattern absolute inset-0 opacity-40" />

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

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, var(--background), transparent 30%, transparent 70%, var(--background)),
              linear-gradient(to bottom, var(--background), transparent 15%, transparent 85%, var(--background))
            `,
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex w-fit items-center gap-3">
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
          </Link>

          <div className="max-w-md space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground xl:text-6xl">
                Welcome
                <br />
                <span className="text-primary">back.</span>
              </h1>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                Sign in to continue routing across the best AI models from one
                unified interface.
              </p>
            </div>

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

          <div className="flex items-center gap-3">
            <div
              className="glow-line h-px w-8"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <p className="text-xs text-muted-foreground">
              One integration, infinite possibilities
            </p>
          </div>
        </div>
      </div>

      {/* ---- Right form panel ---- */}
      <div className="relative flex flex-1 items-center justify-center p-6 md:p-12">
        <div
          className="absolute right-0 top-0 h-[50%] w-[60%] opacity-30 blur-[100px]"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile-only branding */}
          <Link to="/" className="mb-8 flex w-fit items-center gap-3 lg:hidden">
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
          </Link>

          <Card className="card-glow border-border/50 bg-card/70 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Sign in
                </h2>
                <p className="text-sm text-muted-foreground">
                  Return to your unified model gateway.
                </p>
              </div>

              <form onSubmit={onSubmit} className="stagger-enter space-y-4">
                {/* Email */}
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="signin-email"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={mutation.isPending}
                        className="h-10 bg-background/50 placeholder:text-muted-foreground/40"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Password */}
                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="signin-password"
                          className="text-xs uppercase tracking-wider text-muted-foreground"
                        >
                          Password
                        </Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-muted-foreground transition-colors hover:text-primary"
                          tabIndex={-1}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
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
                  )}
                </form.Field>

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
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => {
                    return (
                      <Button
                        type="submit"
                        className="h-10 w-full font-medium cursor-pointer"
                        disabled={!canSubmit || isSubmitting || mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <Spinner />
                            Signing in...
                          </span>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    );
                  }}
                </form.Subscribe>
              </form>

              <div className="mt-6">
                <Separator className="bg-border/40" />
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

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
