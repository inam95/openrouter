import { client } from "@/client";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { buildSigninRouteState } from "@/features/auth/lib/signin-route-state";
import { signUpFormSchema } from "@repo/contracts";
import {
  Alert,
  AlertDescription,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { type FormEvent, useState } from "react";

export function Signup() {
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
      const response = await client.auth["sign-up"].post({ email, password });

      if (response.status !== 200) {
        const responseData = response.error?.value;
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
    onSuccess: (_, { email, password }) => {
      navigate("/signin", { state: buildSigninRouteState(email, password) });
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value }) => {
        const parsed = signUpFormSchema.safeParse(value);
        if (parsed.success) return undefined;
        return (
          parsed.error.issues[0]?.message ?? "Please fix the highlighted fields."
        );
      },
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const parsed = signUpFormSchema.safeParse(value);
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
    <AuthSplitLayout
      heroTitle={
        <>
          Build with
          <br />
          <span className="text-primary">every model.</span>
        </>
      }
      heroDescription="Create your account and start routing across the best AI models from one unified interface."
      cardTitle="Create an account"
      cardDescription="Start building with one API for every AI model."
      footer={
        <>
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
        </>
      }
      afterCard={
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
      }
    >
      <form onSubmit={onSubmit} className="stagger-enter space-y-4">
        <form.Field name="email">
          {(field) => (
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
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={mutation.isPending}
                className="h-10 bg-background/50 placeholder:text-muted-foreground/40"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <PasswordField
              id="signup-password"
              label="Password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={field.state.value}
              onChange={field.handleChange}
              disabled={mutation.isPending}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((current) => !current)}
            />
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
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
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={mutation.isPending}
                className="h-10 bg-background/50 placeholder:text-muted-foreground/40"
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            if (values.password.length === 0) {
              return null;
            }

            const passwordChecks = {
              minLength: values.password.length >= 8,
              hasLetter: /[a-zA-Z]/.test(values.password),
              hasNumber: /\d/.test(values.password),
            };
            const passwordsMatch =
              values.confirmPassword.length > 0
                ? values.password === values.confirmPassword
                : false;
            const checksCompleted = [
              passwordChecks.minLength,
              passwordChecks.hasLetter,
              passwordChecks.hasNumber,
              passwordsMatch,
            ].filter(Boolean).length;

            return (
              <div className="space-y-3 rounded-lg border border-border/40 bg-background/30 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor:
                          index < checksCompleted
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
                  <PasswordCheck label="8+ characters" met={passwordChecks.minLength} />
                  <PasswordCheck label="Has a letter" met={passwordChecks.hasLetter} />
                  <PasswordCheck label="Has a number" met={passwordChecks.hasNumber} />
                  <PasswordCheck label="Passwords match" met={passwordsMatch} />
                </div>
              </div>
            );
          }}
        </form.Subscribe>

        {formError ? (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <AuthSubmitButton
              disabled={!canSubmit || isSubmitting || mutation.isPending}
              isPending={isSubmitting}
              idleLabel="Create account"
              pendingLabel="Creating account..."
            />
          )}
        </form.Subscribe>
      </form>
    </AuthSplitLayout>
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
