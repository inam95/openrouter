import { client } from "@/client";
import { Badge, Button, Card, CardContent, Separator } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const features = [
  {
    title: "Latest AI models",
    description:
      "Access flagship models from major providers through a single integration surface.",
    icon: SparkIcon,
  },
  {
    title: "One consistent API",
    description:
      "Keep your app code simple with a unified request shape instead of provider-specific SDKs.",
    icon: BracketsIcon,
  },
  {
    title: "Provider flexibility",
    description:
      "Switch models and providers without rebuilding your product around one vendor.",
    icon: RouteIcon,
  },
  {
    title: "Fast iteration",
    description:
      "Try different models for quality, speed, or cost by changing configuration instead of architecture.",
    icon: BoltIcon,
  },
  {
    title: "Model discovery",
    description:
      "Browse available models directly in the product and quickly see who provides them.",
    icon: SearchIcon,
  },
  {
    title: "Built for developers",
    description:
      "Go from sign up to API calls quickly with a clean dashboard and straightforward setup flow.",
    icon: TerminalIcon,
  },
];

export function Landing() {
  const modelsQuery = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const response = await client.models.get();

      if (response.status !== 200) {
        throw new Error("Unable to load models");
      }

      return response.data;
    },
  });

  const modelCount = modelsQuery.data?.models.length;
  const highlightedModels = modelsQuery.data?.models.slice(0, 6) ?? [];
  const companyNames = Array.from(
    new Set(modelsQuery.data?.models.map((model) => model.company.name) ?? [])
  ).slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="noise-overlay absolute inset-0" />
      <div className="grid-pattern absolute inset-0 opacity-25" />
      <div
        className="orb-1 absolute left-[8%] top-[8%] size-72 rounded-full opacity-20 blur-[85px]"
        style={{ backgroundColor: "var(--primary)" }}
      />
      <div
        className="orb-2 absolute right-[6%] top-[18%] size-64 rounded-full opacity-15 blur-[70px]"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <div
        className="orb-3 absolute bottom-[16%] left-[42%] size-52 rounded-full opacity-10 blur-[60px]"
        style={{ backgroundColor: "var(--chart-4)" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, var(--background), transparent 20%, transparent 80%, var(--background)),
            linear-gradient(to bottom, var(--background), transparent 12%, transparent 88%, var(--background))
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="border-border/50 bg-card/45 sticky top-4 z-30 rounded-2xl border backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm">
                <ZapIcon className="size-3.5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight">
                  OpenRouter
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Unified model gateway
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="cursor-pointer">
                <Link to="/signup" className="flex items-center gap-2">
                  Get started
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="grid gap-10 pb-20 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-6 border-border/60 bg-card/50 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
              >
                <span className="mr-2 inline-flex size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {modelCount ? `${modelCount}+ models available` : "Loading model surface"}
              </Badge>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                One API for{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--foreground) 0%, var(--primary) 35%, var(--accent) 70%, var(--chart-4) 100%)",
                  }}
                >
                  every AI model
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                Route to the best models from OpenAI, Anthropic, Google, Meta,
                and more. One integration, infinite possibilities.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="h-11 px-6 shadow-[0_0_40px_-12px_var(--primary)]"
                >
                  <Link to="/signup" className="flex items-center gap-2">
                    Start building
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-11 border-border/60 bg-card/40 px-6"
                >
                  <Link to="/dashboard">View dashboard</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <MetricTile value={modelCount ? `${modelCount}+` : "--"} label="models" />
                <MetricTile value={`${companyNames.length || 0}+`} label="major providers" />
                <MetricTile value="1" label="integration surface" />
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={feature.title} className="group flex items-start gap-4">
                    <div className="relative mt-1.5 flex size-5 shrink-0 items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-primary/20" />
                      <span className="relative font-mono text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {feature.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-4xl border border-border/30 bg-card/20 blur-2xl" />

              <div className="relative grid gap-4">
                <Card className="card-glow overflow-hidden border-border/50 bg-card/70 backdrop-blur-xl">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                      <span className="size-2.5 rounded-full bg-red-500/60" />
                      <span className="size-2.5 rounded-full bg-yellow-500/60" />
                      <span className="size-2.5 rounded-full bg-green-500/60" />
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                        request.ts
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Just change the base URL
                      </p>
                      <pre className="overflow-x-auto text-sm leading-7">
                        <code className="font-mono">
                          <span className="text-blue-400">{"const "}</span>
                          <span className="text-foreground">{"response "}</span>
                          <span className="text-muted-foreground">{"= "}</span>
                          <span className="text-blue-400">{"await "}</span>
                          <span className="text-yellow-300">{"fetch"}</span>
                          <span className="text-foreground">{"(\n"}</span>
                          <span className="text-emerald-400">
                            {'  "https://openrouter.ai/api/v1/chat"'}
                          </span>
                          <span className="text-foreground">{",\n  {\n"}</span>
                          <span className="text-foreground">{"    method: "}</span>
                          <span className="text-emerald-400">{'"POST"'}</span>
                          <span className="text-foreground">{",\n    body: JSON."}</span>
                          <span className="text-yellow-300">{"stringify"}</span>
                          <span className="text-foreground">{"({\n"}</span>
                          <span className="text-foreground">{"      model: "}</span>
                          <span className="text-emerald-400">
                            {'"anthropic/claude-sonnet-4-5"'}
                          </span>
                          <span className="text-foreground">
                            {",\n      messages: [{ role: "}
                          </span>
                          <span className="text-emerald-400">{'"user"'}</span>
                          <span className="text-foreground">{", content: "}</span>
                          <span className="text-emerald-400">{'"Hello!"'}</span>
                          <span className="text-foreground">
                            {" }]\n    })\n  }\n)"}
                          </span>
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            Model surface
                          </p>
                          <h3 className="mt-2 text-lg font-semibold tracking-tight">
                            Popular models
                          </h3>
                        </div>
                        <div className="rounded-full border border-border/50 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                          live
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {highlightedModels.length > 0 ? (
                          highlightedModels.map((model) => (
                            <div
                              key={model.id}
                              className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/35 px-3 py-2.5"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-card/60 text-xs font-bold text-muted-foreground">
                                {model.company.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {model.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {model.company.name}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-border/40 bg-background/35 px-3 py-6 text-sm text-muted-foreground">
                            Loading models from the backend...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                    <CardContent className="flex h-full flex-col p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Provider coverage
                      </p>
                      <div className="mt-4 space-y-3">
                        {companyNames.length > 0 ? (
                          companyNames.map((company, index) => (
                            <div key={company} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground">{company}</span>
                                <span className="font-mono text-muted-foreground">
                                  0{index + 1}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${92 - index * 10}%`,
                                    background:
                                      index % 3 === 0
                                        ? "var(--primary)"
                                        : index % 3 === 1
                                          ? "var(--accent)"
                                          : "var(--chart-4)",
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Loading providers...
                          </p>
                        )}
                      </div>

                      <Separator className="my-5 bg-border/40" />

                      <div className="rounded-xl border border-border/40 bg-background/35 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Promise
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          One integration surface for model access, faster
                          iteration, and less vendor lock-in.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="border-t border-border/40 py-20">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">
                Everything you need
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for developers who want to move fast without feeling boxed
                in.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
                The product promise stays simple, but the presentation should
                feel deliberate, premium, and useful from the first scroll.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="card-glow group relative overflow-hidden border-border/50 bg-card/55 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50">
                        <feature.icon className="size-5 text-primary" />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {modelsQuery.data?.models && modelsQuery.data.models.length > 0 && (
            <section className="border-t border-border/40 py-20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">
                    Popular models
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Access the latest and greatest from every major provider.
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="glow-line h-px w-8"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Live preview from your backend
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {modelsQuery.data.models.slice(0, 9).map((model, index) => (
                  <Card
                    key={model.id}
                    className={`border-border/50 backdrop-blur-xl ${
                      index === 0
                        ? "card-glow xl:col-span-2 bg-card/65"
                        : "bg-card/45"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/50 text-sm font-bold text-primary">
                        {model.company.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium tracking-tight text-foreground">
                          {model.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {model.company.name}
                        </p>
                      </div>
                      <span className="rounded-full border border-border/50 bg-background/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        model
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="py-20">
            <Card className="card-glow overflow-hidden border-border/50 bg-card/65 backdrop-blur-xl">
              <CardContent className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">
                    Ready to start building?
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Create a free account and start making API calls in minutes.
                  </h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    The message stays direct. The experience should feel sharp,
                    confident, and unmistakably product-designed.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" asChild className="h-11 px-6">
                    <Link to="/signup" className="flex items-center gap-2">
                      Create free account
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-11 border-border/60 bg-background/40 px-6"
                  >
                    <Link to="/signin">Sign in</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t border-border/30 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ZapIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">OpenRouter</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 OpenRouter. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/45 px-4 py-4 backdrop-blur-sm">
      <div className="text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ArrowRightIcon({ className }: IconProps) {
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

function ZapIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BracketsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h2M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2h-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RouteIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M4 6h7m0 0L8 3m3 3L8 9M20 18h-7m0 0l3-3m-3 3l3 3M7 18h.01M17 6h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M11 3L6 12h5l-1 9 8-12h-5l2-6h-4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TerminalIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M4 7l4 4-4 4m7 0h9M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type IconProps = {
  className?: string;
};
