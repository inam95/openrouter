import { Skeleton } from "@repo/ui";

type ApiKeyListItemSkeletonProps = {
  className?: string;
  layoutClassName?: string;
  metaGridClassName?: string;
};

export function ApiKeyListItemSkeleton({
  className = "rounded-xl border border-border/35 bg-background/25 px-4 py-3",
  layoutClassName = "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
  metaGridClassName = "grid grid-cols-2 gap-4 sm:min-w-[220px]",
}: ApiKeyListItemSkeletonProps) {
  return (
    <div className={className}>
      <div className={layoutClassName}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className={metaGridClassName}>
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
