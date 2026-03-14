import type { ApiKey } from "@repo/contracts";
import { Badge } from "@repo/ui";
import type { JSX } from "react";

import { formatCredits, formatLastUsed, maskApiKey } from "../lib/formatters";

type ApiKeyListItemProps = {
  apiKey: ApiKey;
  className?: string;
  layoutClassName?: string;
  metaGridClassName?: string;
  secretClassName?: string;
};

type ApiKeyListItemComponent = ((props: ApiKeyListItemProps) => JSX.Element) & {
  Meta: (props: { label: string; value: string }) => JSX.Element;
};

export const ApiKeyListItem: ApiKeyListItemComponent = ({
  apiKey,
  className = "rounded-xl border border-border/35 bg-background/25 px-4 py-3",
  layoutClassName = "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
  metaGridClassName = "grid grid-cols-2 gap-4 text-xs sm:min-w-[220px]",
  secretClassName = "mt-2 font-mono text-xs text-muted-foreground",
}: ApiKeyListItemProps) => {
  return (
    <div className={className}>
      <div className={layoutClassName}>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
            <StatusBadge disabled={apiKey.disabled} />
          </div>
          <SecretValue value={apiKey.apiKey} className={secretClassName} />
        </div>

        <div className={metaGridClassName}>
          <ApiKeyListItem.Meta
            label="Last used"
            value={formatLastUsed(apiKey.lastUsed)}
          />
          <ApiKeyListItem.Meta
            label="Spent"
            value={formatCredits(apiKey.creditConsumed)}
          />
        </div>
      </div>
    </div>
  );
};

ApiKeyListItem.Meta = function ApiKeyListItemMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
};

function StatusBadge({ disabled }: { disabled: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        disabled
          ? "border-border/50 bg-background/30 text-muted-foreground"
          : "border-primary/30 bg-primary/10 text-foreground"
      }
    >
      {disabled ? "disabled" : "active"}
    </Badge>
  );
}

function SecretValue({ value, className }: { value: string; className: string }) {
  return <p className={className}>{maskApiKey(value)}</p>;
}
