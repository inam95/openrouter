import { DashboardShell } from "@/dashboard-shell";
import {
  dashboardQueryKeys,
  fetchApiKeys,
  fetchProfile,
  formatCredits,
  onrampCredits,
} from "@/dashboard-data";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export function Credits() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: fetchProfile,
  });

  const apiKeysQuery = useQuery({
    queryKey: dashboardQueryKeys.apiKeys,
    queryFn: fetchApiKeys,
  });

  const onrampMutation = useMutation({
    mutationFn: onrampCredits,
    onMutate: () => {
      setSuccessMessage(null);
    },
    onSuccess: async (response) => {
      setSuccessMessage(
        `Credits updated successfully. Available balance is now ${formatCredits(
          response.credits
        )}.`
      );
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.profile,
      });
    },
  });

  const credits = profileQuery.data?.credits ?? 0;
  const apiKeys = apiKeysQuery.data?.apiKeys ?? [];
  const totalSpend = apiKeys.reduce(
    (total, apiKey) => total + apiKey.creditConsumed,
    0
  );
  const activeKeys = apiKeys.filter((apiKey) => !apiKey.disabled).length;
  const isLoading = profileQuery.isPending && !profileQuery.data;
  const reserveLabel =
    credits >= 250
      ? "Ready to experiment"
      : credits >= 100
        ? "Build, but keep an eye on spend"
        : "Low balance";
  const reserveWidth = Math.min(100, Math.max(10, (credits / 300) * 100));

  return (
    <DashboardShell
      activeNav="credits"
      eyebrow="Credits"
      title="A simpler view of your balance."
      description="Check what is available now and run the current onramp flow when you need more room."
      credits={profileQuery.data?.credits}
      apiKeyCount={apiKeysQuery.data?.apiKeys.length}
      actions={
        <>
          <Button
            size="lg"
            className="h-10 px-5"
            onClick={() => void onrampMutation.mutateAsync()}
            disabled={onrampMutation.isPending}
          >
            {onrampMutation.isPending ? "Running onramp..." : "Run onramp"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-10 border-border/60 bg-card/30 px-5"
          >
            <Link to="/api-keys#create-api-key">Create API key</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_300px]">
        <div className="space-y-4">
          {profileQuery.error ? (
            <Alert
              variant="destructive"
              className="border-destructive/40 bg-card/60"
            >
              <AlertDescription>{profileQuery.error.message}</AlertDescription>
            </Alert>
          ) : null}

          {successMessage ? (
            <Alert className="border-primary/30 bg-card/65">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          {onrampMutation.error ? (
            <Alert
              variant="destructive"
              className="border-destructive/40 bg-card/60"
            >
              <AlertDescription>{onrampMutation.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <Card className="card-glow overflow-hidden border-border/50 bg-card/58 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                <div className="border-border/30 border-b p-6 md:border-b-0 md:border-r">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    Available
                  </p>
                  {isLoading ? (
                    <>
                      <Skeleton className="mt-4 h-12 w-32" />
                      <Skeleton className="mt-3 h-4 w-2/3" />
                    </>
                  ) : (
                    <>
                      <h2 className="mt-4 text-5xl font-bold tracking-tight text-foreground">
                        {formatCredits(credits)}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                        Live balance from your profile.
                      </p>
                    </>
                  )}

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${reserveWidth}%`,
                        background:
                          credits >= 250
                            ? "var(--primary)"
                            : credits >= 100
                              ? "var(--chart-5)"
                              : "var(--destructive)",
                      }}
                    />
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                    {isLoading ? "Loading..." : reserveLabel}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {credits >= 250
                      ? "You have room for active testing."
                      : credits >= 100
                        ? "You can keep building, but watch spend."
                        : "A top-up is the safest next step."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <SignalTile
                      label="Keys"
                      value={apiKeysQuery.isPending ? "..." : `${activeKeys}`}
                    />
                    <SignalTile
                      label="Consumed"
                      value={apiKeysQuery.isPending ? "..." : formatCredits(totalSpend)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            id="onramp"
            className="border-border/50 bg-card/52 backdrop-blur-xl scroll-mt-28"
          >
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">
                  Credit onramp
                </CardTitle>
                <CardDescription>
                  Trigger the current backend onramp flow.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="rounded-xl border border-border/35 bg-background/25 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-lg">
                    <p className="text-sm font-medium text-foreground">
                      Run a balance update
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      This calls the live onramp endpoint and refreshes the shown
                      balance after it completes.
                    </p>
                  </div>

                  <Button
                    className="h-10 px-5"
                    onClick={() => void onrampMutation.mutateAsync()}
                    disabled={onrampMutation.isPending}
                  >
                    {onrampMutation.isPending ? "Processing..." : "Run onramp now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/52 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">Summary</CardTitle>
                <CardDescription>
                  A short read on where things stand.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <OutlookRow
                title="Balance"
                detail={
                  isLoading
                    ? "Loading available credits..."
                    : `${formatCredits(credits)} credits available.`
                }
              />
              <OutlookRow
                title="Key footprint"
                detail={
                  apiKeys.length > 0
                    ? `${activeKeys} active keys have consumed ${formatCredits(totalSpend)} so far.`
                    : "No active keys yet."
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">Guide</CardTitle>
                <CardDescription>Simple ranges.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <ThresholdRow
                label="0-99"
                detail="Low runway."
                tone="var(--destructive)"
              />
              <ThresholdRow
                label="100-249"
                detail="Usable buffer."
                tone="var(--chart-5)"
              />
              <ThresholdRow
                label="250+"
                detail="Comfortable room."
                tone="var(--primary)"
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">Next</CardTitle>
                <CardDescription>
                  Common follow-up routes.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <RouteLink
                label="Create API key"
                detail="Generate a fresh credential."
                to="/api-keys#create-api-key"
              />
              <RouteLink
                label="Back to dashboard"
                detail="Return to the full account overview."
                to="/dashboard"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function SignalTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function OutlookRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
    </div>
  );
}

function ThresholdRow({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label} credits</p>
        <span
          className="inline-flex size-2 rounded-full"
          style={{ backgroundColor: tone }}
        />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

function RouteLink({
  label,
  detail,
  to,
}: {
  label: string;
  detail: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-border/35 bg-background/25 px-4 py-3 transition-colors hover:bg-background/35"
    >
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </Link>
  );
}
