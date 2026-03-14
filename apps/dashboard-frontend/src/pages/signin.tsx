import { client } from "@/client";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { getSigninRouteState } from "@/features/auth/lib/signin-route-state";
import { signInBodySchema } from "@repo/contracts";
import {
  Alert,
  AlertDescription,
  Input,
  Label,
  Separator,
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";
import { type FormEvent, useState } from "react";

export function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilled = getSigninRouteState(location.state);
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
      email: prefilled?.email ?? "",
      password: prefilled?.password ?? "",
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
    <AuthSplitLayout
      heroTitle={
        <>
          Welcome
          <br />
          <span className="text-primary">back.</span>
        </>
      }
      heroDescription="Sign in to continue routing across the best AI models from one unified interface."
      cardTitle="Sign in"
      cardDescription="Return to your unified model gateway."
      footer={
        <>
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
        </>
      }
    >
      <form onSubmit={onSubmit} className="stagger-enter space-y-4">
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
              id="signin-password"
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={field.state.value}
              onChange={field.handleChange}
              disabled={mutation.isPending}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((current) => !current)}
              action={
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              }
            />
          )}
        </form.Field>

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
              isPending={mutation.isPending}
              idleLabel="Sign in"
              pendingLabel="Signing in..."
            />
          )}
        </form.Subscribe>
      </form>
    </AuthSplitLayout>
  );
}
