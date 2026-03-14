import { Button } from "@repo/ui";
import { Link } from "react-router";

type DashboardEmptyStateProps = {
  title: string;
  detail: string;
  ctaLabel?: string;
  ctaTo?: string;
};

export function DashboardEmptyState({
  title,
  detail,
  ctaLabel,
  ctaTo,
}: DashboardEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border/55 bg-background/20 p-5">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {detail}
      </p>
      {ctaLabel && ctaTo ? (
        <Button className="mt-4 h-10" asChild>
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
