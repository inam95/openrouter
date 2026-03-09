import { Button } from "@repo/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/sidebar";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";

import { formatCredits } from "./dashboard-data";

type DashboardShellProps = {
  activeNav: "dashboard" | "api-keys" | "credits";
  eyebrow: string;
  title: string;
  description: string;
  credits?: number;
  apiKeyCount?: number;
  actions?: ReactNode;
  children: ReactNode;
};

export function DashboardShell({
  activeNav,
  eyebrow,
  title,
  description,
  credits,
  apiKeyCount,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="noise-overlay absolute inset-0" />
      <div className="grid-pattern absolute inset-0 opacity-10" />
      <div
        className="orb-1 absolute left-[6%] top-[7%] size-64 rounded-full opacity-14 blur-[95px]"
        style={{ backgroundColor: "var(--primary)" }}
      />
      <div
        className="orb-2 absolute right-[8%] top-[18%] size-56 rounded-full opacity-10 blur-[80px]"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <div
        className="orb-3 absolute bottom-[12%] left-[42%] size-44 rounded-full opacity-8 blur-[70px]"
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

      <SidebarProvider>
        <div className="relative z-10 flex min-h-screen w-full">
          <Sidebar className="bg-sidebar/72 backdrop-blur-xl">
            <SidebarHeader className="gap-4 border-sidebar-border/70 px-4 py-5">
              <Link to="/" className="flex items-center gap-3 rounded-xl">
                <div className="flex size-9 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground">
                  <PulseIcon className="size-3.5 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                    OpenRouter
                  </span>
                  <p className="text-[11px] text-sidebar-foreground/55">
                    Workspace
                  </p>
                </div>
              </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeNav === item.key}
                          className="font-medium"
                        >
                          <NavLink to={item.to}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent className="gap-2">
                  <SidebarMetric
                    label="Credits"
                    value={
                      typeof credits === "number"
                        ? formatCredits(credits)
                        : "Loading"
                    }
                  />
                  <SidebarMetric
                    label="Keys"
                    value={
                      typeof apiKeyCount === "number"
                        ? `${apiKeyCount}`
                        : "Loading"
                    }
                  />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="space-y-3 border-sidebar-border/70 px-4 py-4">
              <Button className="h-10 w-full" asChild>
                <Link to="/credits#onramp">Add credits</Link>
              </Button>
              <p className="text-xs leading-6 text-sidebar-foreground/45">
                Live data from profile, payments, and API keys.
              </p>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
              <header className="border-border/40 bg-card/35 sticky top-4 z-30 rounded-2xl border backdrop-blur-xl">
                <div className="flex flex-col gap-5 px-4 py-4 sm:px-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-center gap-3">
                      <SidebarTrigger />
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          {eyebrow}
                        </p>
                        <h1 className="mt-1 max-w-3xl text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {title}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill
                        label="Credits"
                        value={
                          typeof credits === "number"
                            ? formatCredits(credits)
                            : "Loading"
                        }
                      />
                      <StatusPill
                        label="Keys"
                        value={
                          typeof apiKeyCount === "number"
                            ? `${apiKeyCount}`
                            : "Loading"
                        }
                      />
                    </div>
                  </div>
                  {actions ? (
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                      {actions}
                    </div>
                  ) : null}
                </div>
              </header>

              <main className="flex-1 pb-14 pt-6">
                <section>{children}</section>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border/50 bg-background/45 px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-2 font-mono text-foreground">{value}</span>
    </div>
  );
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/20 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/50">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-sm text-sidebar-foreground">{value}</p>
    </div>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M3 12h4l2.2-5 3.6 10L15 12h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 7v-7h7v7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M14 8a4 4 0 118 0 4 4 0 01-8 0zm0 0L3 19m0 0h4m-4 0v-4m7-7l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M12 7c4.418 0 8-1.343 8-3s-3.582-3-8-3-8 1.343-8 3 3.582 3 8 3zm8 0v6c0 1.657-3.582 3-8 3s-8-1.343-8-3V7m16 6v6c0 1.657-3.582 3-8 3s-8-1.343-8-3v-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navigationItems = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: GridIcon },
  { key: "api-keys", label: "API Keys", to: "/api-keys", icon: KeyIcon },
  { key: "credits", label: "Credits", to: "/credits", icon: CoinsIcon },
] as const;
