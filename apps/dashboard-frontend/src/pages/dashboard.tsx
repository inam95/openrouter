import { DashboardShell } from "@/dashboard-shell";
import {
  dashboardQueryKeys,
  fetchApiKeys,
  fetchProfile,
  formatCredits,
  formatLastUsed,
  maskApiKey,
} from "@/dashboard-data";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export function Dashboard() {
  const profileQuery = useQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: fetchProfile,
  });

  const apiKeysQuery = useQuery({
    queryKey: dashboardQueryKeys.apiKeys,
    queryFn: fetchApiKeys,
  });

  const credits = profileQuery.data?.credits ?? 0;
  const apiKeys = apiKeysQuery.data?.apiKeys ?? [];
  const activeKeys = apiKeys.filter((apiKey) => !apiKey.disabled);
  const disabledKeys = apiKeys.length - activeKeys.length;
  const totalSpend = apiKeys.reduce(
    (total, apiKey) => total + apiKey.creditConsumed,
    0
  );
  const highestSpendKey = [...apiKeys].sort(
    (left, right) => right.creditConsumed - left.creditConsumed
  )[0];
  const latestActivity = [...apiKeys]
    .filter((apiKey) => apiKey.lastUsed)
    .sort(
      (left, right) =>
        new Date(String(right.lastUsed)).getTime() -
        new Date(String(left.lastUsed)).getTime()
    )
    .slice(0, 3);
  const dashboardErrors = [
    profileQuery.error?.message,
    apiKeysQuery.error?.message,
  ].filter(Boolean);
  const isLoading =
    (profileQuery.isPending && !profileQuery.data) ||
    (apiKeysQuery.isPending && !apiKeysQuery.data);
  const runwayLabel =
    credits >= 250
      ? "Comfortable runway"
      : credits >= 100
        ? "Watch balance"
        : "Low runway";

  return (
    <DashboardShell
      activeNav="dashboard"
      eyebrow="Overview"
      title="A calmer view of your keys and credits."
      description="The essentials only: current balance, active keys, and the next actions that matter."
      credits={profileQuery.data?.credits}
      apiKeyCount={apiKeysQuery.data?.apiKeys.length}
      actions={
        <>
          <Button size="lg" asChild className="h-10 px-5">
            <Link to="/api-keys#create-api-key" className="flex items-center gap-2">
              Create API key
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-10 border-border/60 bg-card/30 px-5"
          >
            <Link to="/credits#onramp">Add credits</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricTile
            label="Credits"
            value={isLoading ? null : formatCredits(credits)}
            detail={
              credits >= 250
                ? "Healthy balance"
                : credits >= 100
                  ? "Enough for active testing"
                  : "Top up soon"
            }
          />
          <MetricTile
            label="Active keys"
            value={isLoading ? null : `${activeKeys.length}`}
            detail={
              activeKeys.length > 0
                ? `${disabledKeys} inactive`
                : "No active keys yet"
            }
          />
          <MetricTile
            label="Consumed"
            value={isLoading ? null : formatCredits(totalSpend)}
            detail={highestSpendKey ? highestSpendKey.name : "No usage yet"}
          />
        </div>

        {dashboardErrors.length > 0 ? (
          <Alert variant="destructive" className="border-destructive/40 bg-card/60">
            <AlertDescription>{dashboardErrors.join(" ")}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <Card className="card-glow border-border/50 bg-card/58 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">API keys</CardTitle>
                <CardDescription>
                  Your latest keys and their status.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <KeyRowSkeleton key={index} />
                ))
              ) : apiKeys.length > 0 ? (
                apiKeys.slice(0, 4).map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="rounded-xl border border-border/35 bg-background/25 px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {apiKey.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              apiKey.disabled
                                ? "border-border/50 bg-background/30 text-muted-foreground"
                                : "border-primary/30 bg-primary/10 text-foreground"
                            }
                          >
                            {apiKey.disabled ? "disabled" : "active"}
                          </Badge>
                        </div>
                        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                          {maskApiKey(apiKey.apiKey)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs sm:min-w-[210px]">
                        <MetaItem
                          label="Last used"
                          value={formatLastUsed(apiKey.lastUsed)}
                        />
                        <MetaItem
                          label="Spent"
                          value={formatCredits(apiKey.creditConsumed)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyPanel
                  title="No API keys yet"
                  detail="Create your first key to start sending requests."
                  ctaLabel="Create key"
                  ctaTo="/api-keys#create-api-key"
                />
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/50 bg-card/52 backdrop-blur-xl">
              <CardHeader className="border-b border-border/30">
                <div>
                  <CardTitle className="text-lg tracking-tight">Balance</CardTitle>
                  <CardDescription>
                    A compact read on current runway.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {isLoading ? "Loading..." : runwayLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {highestSpendKey
                      ? `${highestSpendKey.name} is the busiest key right now.`
                      : "Usage will appear here once your keys are active."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/52 backdrop-blur-xl">
              <CardHeader className="border-b border-border/30">
                <div>
                  <CardTitle className="text-lg tracking-tight">
                    Recent activity
                  </CardTitle>
                  <CardDescription>
                    The most recent key touches.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <ActivitySkeleton key={index} />
                    ))}
                  </div>
                ) : latestActivity.length > 0 ? (
                  <div className="space-y-3">
                    {latestActivity.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="rounded-xl border border-border/35 bg-background/25 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {apiKey.name}
                        </p>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {formatLastUsed(apiKey.lastUsed)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-muted-foreground">
                    Activity will appear once requests start flowing.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function MetricTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | null;
  detail: string;
}) {
  return (
    <Card className="border-border/45 bg-card/42 backdrop-blur-xl">
      <CardContent className="px-5 py-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </p>
        {value === null ? (
          <>
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </>
        ) : (
          <>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function KeyRowSkeleton() {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:min-w-[210px]">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-4 w-20" />
    </div>
  );
}

function EmptyPanel({
  title,
  detail,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  detail: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/55 bg-background/20 p-5">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {detail}
      </p>
      <Button className="mt-4 h-10" asChild>
        <Link to={ctaTo}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
