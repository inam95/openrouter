import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./utils";

type SidebarContextValue = {
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  children,
  defaultOpenMobile = false,
}: React.ComponentProps<"div"> & {
  defaultOpenMobile?: boolean;
}) {
  const [openMobile, setOpenMobile] = React.useState(defaultOpenMobile);

  const value = React.useMemo(
    () => ({
      openMobile,
      setOpenMobile,
      toggleSidebar: () => setOpenMobile((current) => !current),
    }),
    [openMobile]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-provider"
        className="group/sidebar-wrapper flex min-h-screen w-full"
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "bg-background/80 fixed inset-0 z-40 transition-opacity duration-200 md:hidden",
          openMobile
            ? "pointer-events-auto opacity-100 backdrop-blur-sm"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpenMobile(false)}
        aria-hidden="true"
      />

      <aside
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 flex w-70 shrink-0 flex-col border-r border-sidebar-border transition-transform duration-200 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0",
          openMobile ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 border-b border-sidebar-border p-3", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-3", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-sidebar-border p-3", className)}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("relative min-w-0 flex-1", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 text-[11px] font-medium uppercase tracking-[0.24em] text-sidebar-foreground/55",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        outline:
          "border border-sidebar-border bg-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:border-sidebar-ring/40 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
      },
      size: {
        default: "min-h-11",
        sm: "min-h-9 text-xs",
        lg: "min-h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function SidebarMenuButton({
  className,
  asChild = false,
  isActive = false,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    isActive?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card/45 text-foreground transition-colors hover:bg-accent md:hidden",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-4"
      >
        <path
          d="M4 7h16M4 12h16M4 17h16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

export {
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
  useSidebar,
};
