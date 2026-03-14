export function getResponseErrorMessage(errorValue: unknown, fallback: string) {
  if (typeof errorValue === "string") {
    return errorValue;
  }

  if (
    errorValue &&
    typeof errorValue === "object" &&
    "message" in errorValue &&
    typeof errorValue.message === "string"
  ) {
    return errorValue.message;
  }

  return fallback;
}
