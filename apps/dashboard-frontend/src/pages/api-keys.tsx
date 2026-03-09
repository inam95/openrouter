import { DashboardShell } from "@/dashboard-shell";
import {
  createApiKey,
  dashboardQueryKeys,
  fetchApiKeys,
  fetchProfile,
  formatCredits,
  formatLastUsed,
  maskApiKey,
} from "@/dashboard-data";
import { createApiKeyBodySchema, type CreateApiKeyResponse } from "@repo/contracts";
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
  Input,
  Label,
  Skeleton,
} from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

export function ApiKeys() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const profileQuery = useQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: fetchProfile,
  });

  const apiKeysQuery = useQuery({
    queryKey: dashboardQueryKeys.apiKeys,
    queryFn: fetchApiKeys,
  });

  const createKeyMutation = useMutation({
    mutationFn: createApiKey,
    onMutate: () => {
      setFormError(null);
      setCopied(false);
    },
    onSuccess: async (response) => {
      setCreatedKey(response);
      setName("");
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.apiKeys,
      });
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const apiKeys = apiKeysQuery.data?.apiKeys ?? [];
  const activeKeys = apiKeys.filter((apiKey) => !apiKey.disabled);
  const totalSpend = apiKeys.reduce(
    (total, apiKey) => total + apiKey.creditConsumed,
    0
  );
  const isLoading = apiKeysQuery.isPending && !apiKeysQuery.data;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const parsed = createApiKeyBodySchema.safeParse({ name: name.trim() });

    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? "Please enter a valid key name."
      );
      return;
    }

    try {
      await createKeyMutation.mutateAsync(parsed.data.name);
    } catch {
      // Error state is handled by the mutation callbacks.
    }
  }

  async function handleCopy() {
    if (!createdKey?.apiKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createdKey.apiKey);
      setCopied(true);
    } catch {
      setFormError("Clipboard access failed. Please copy the key manually.");
    }
  }

  return (
    <DashboardShell
      activeNav="api-keys"
      eyebrow="API keys"
      title="Generate keys with a cleaner, quieter flow."
      description="Create a new key, copy it once, and keep a simple list of what is active."
      credits={profileQuery.data?.credits}
      apiKeyCount={apiKeysQuery.data?.apiKeys.length}
      actions={
        <>
          <Button size="lg" asChild className="h-10 px-5">
            <Link to="#create-api-key" className="flex items-center gap-2">
              Create new key
              <PlusIcon className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-10 border-border/60 bg-card/30 px-5"
            onClick={() => void apiKeysQuery.refetch()}
          >
            Refresh list
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_300px]">
        <div className="space-y-4">
          {apiKeysQuery.error ? (
            <Alert
              variant="destructive"
              className="border-destructive/40 bg-card/60"
            >
              <AlertDescription>{apiKeysQuery.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <Card
            id="create-api-key"
            className="card-glow border-border/50 bg-card/58 backdrop-blur-xl scroll-mt-28"
          >
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">
                  Create a new API key
                </CardTitle>
                <CardDescription>
                  Use one key per app or environment.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="api-key-name"
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Key name
                  </Label>
                  <Input
                    id="api-key-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Production app, local testing..."
                    disabled={createKeyMutation.isPending}
                    className="h-10 bg-background/35"
                  />
                </div>

                {formError ? (
                  <Alert
                    variant="destructive"
                    className="border-destructive/40 bg-card/55"
                  >
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    className="h-10 px-5"
                    disabled={createKeyMutation.isPending}
                  >
                    {createKeyMutation.isPending ? "Creating key..." : "Create key"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-border/60 bg-background/25 px-5"
                    onClick={() => {
                      setName("");
                      setFormError(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {createdKey ? (
            <Card className="border-primary/25 bg-card/54 backdrop-blur-xl">
              <CardHeader className="border-b border-border/30">
                <div>
                  <CardTitle className="text-lg tracking-tight">
                    Copy this key now
                  </CardTitle>
                  <CardDescription>
                    Store it now before you move on.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="rounded-xl border border-primary/15 bg-background/25 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    New key
                  </p>
                  <p className="mt-3 break-all font-mono text-sm text-foreground">
                    {createdKey.apiKey}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="h-10 px-5" onClick={() => void handleCopy()}>
                    {copied ? "Copied" : "Copy key"}
                  </Button>
                  <Button variant="outline" className="h-10 px-5" asChild>
                    <Link to="/dashboard">Back to dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/50 bg-card/52 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">
                  Existing keys
                </CardTitle>
                <CardDescription>
                  A simple list of active and inactive keys.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ApiKeyCardSkeleton key={index} />
                ))
              ) : apiKeys.length > 0 ? (
                apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="rounded-xl border border-border/35 bg-background/25 px-4 py-3"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                        <p className="mt-2 font-mono text-xs text-muted-foreground">
                          {maskApiKey(apiKey.apiKey)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs sm:min-w-[220px]">
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
                <EmptyState />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">Stats</CardTitle>
                <CardDescription>Only the key numbers.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <MiniStat
                label="Total keys"
                value={isLoading ? "..." : `${apiKeys.length}`}
              />
              <MiniStat
                label="Active keys"
                value={isLoading ? "..." : `${activeKeys.length}`}
              />
              <MiniStat
                label="Credits consumed"
                value={isLoading ? "..." : formatCredits(totalSpend)}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30">
              <div>
                <CardTitle className="text-lg tracking-tight">Note</CardTitle>
                <CardDescription>
                  Name keys by environment and keep the list tidy.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <p className="text-sm leading-7 text-muted-foreground">
                Separate production, staging, and local usage so spend stays easy
                to read later.
              </p>
              <Button variant="outline" className="mt-4 h-10 w-full" asChild>
                <Link to="/credits#onramp">Go to credits</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border/55 bg-background/20 p-5">
      <p className="text-base font-semibold text-foreground">
        No API keys created yet
      </p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        Your first key will appear here after you create it.
      </p>
    </div>
  );
}

function ApiKeyCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/35 bg-background/25 px-4 py-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:min-w-[220px]">
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M12 5v14M5 12h14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
