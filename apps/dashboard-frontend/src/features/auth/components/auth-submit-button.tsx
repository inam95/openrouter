import { Button } from "@repo/ui";

export function AuthSubmitButton({
  disabled,
  isPending,
  idleLabel,
  pendingLabel,
}: {
  disabled: boolean;
  isPending: boolean;
  idleLabel: string;
  pendingLabel: string;
}) {
  return (
    <Button
      type="submit"
      className="h-10 w-full font-medium cursor-pointer"
      disabled={disabled}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {pendingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </Button>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
