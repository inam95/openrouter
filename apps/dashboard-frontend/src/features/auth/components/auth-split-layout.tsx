import { Card, CardContent } from "@repo/ui";
import type { ReactNode } from "react";
import { Link } from "react-router";

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
] as const;

type AuthSplitLayoutProps = {
  heroTitle: ReactNode;
  heroDescription: ReactNode;
  cardTitle: string;
  cardDescription: string;
  children: ReactNode;
  footer: ReactNode;
  afterCard?: ReactNode;
};

export function AuthSplitLayout({
  heroTitle,
  heroDescription,
  cardTitle,
  cardDescription,
  children,
  footer,
  afterCard,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
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
          <BrandLink className="hidden lg:flex" />

          <div className="max-w-md space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground xl:text-6xl">
                {heroTitle}
              </h1>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                {heroDescription}
              </p>
            </div>

            <div className="space-y-4">
              {CAPABILITIES.map((capability, index) => (
                <div key={capability.label} className="group flex items-start gap-4">
                  <div className="relative mt-1.5 flex size-5 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/20" />
                    <span className="relative font-mono text-[10px] font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {capability.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {capability.detail}
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

      <div className="relative flex flex-1 items-center justify-center p-6 md:p-12">
        <div
          className="absolute right-0 top-0 h-[50%] w-[60%] opacity-30 blur-[100px]"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative z-10 w-full max-w-[420px]">
          <BrandLink className="mb-8 flex w-fit items-center gap-3 lg:hidden" />

          <Card className="card-glow border-border/50 bg-card/70 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {cardTitle}
                </h2>
                <p className="text-sm text-muted-foreground">{cardDescription}</p>
              </div>

              {children}

              {footer}
            </CardContent>
          </Card>

          {afterCard}
        </div>
      </div>
    </div>
  );
}

function BrandLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={`flex w-fit items-center gap-3 ${className ?? ""}`}>
      <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm">
        <BrandIcon />
      </div>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        OpenRouter
      </span>
    </Link>
  );
}

function BrandIcon() {
  return (
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
  );
}
