import { Card, CardContent, Skeleton } from "@repo/ui";

type DashboardStatTileProps = {
  label: string;
  value: string | null;
  detail?: string;
  cardClassName?: string;
  valueClassName?: string;
};

export function DashboardStatTile({
  label,
  value,
  detail,
  cardClassName = "border-border/45 bg-card/42 backdrop-blur-xl",
  valueClassName = "text-3xl",
}: DashboardStatTileProps) {
  return (
    <Card className={cardClassName}>
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
            <p
              className={`mt-3 font-semibold tracking-tight text-foreground ${valueClassName}`}
            >
              {value}
            </p>
            {detail ? (
              <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
