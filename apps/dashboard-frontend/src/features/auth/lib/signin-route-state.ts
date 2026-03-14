export type SigninRouteState = {
  email?: string;
  password?: string;
} | null;

export function getSigninRouteState(state: unknown): SigninRouteState {
  if (!state || typeof state !== "object") {
    return null;
  }

  const routeState = state as Record<string, unknown>;

  return {
    email: typeof routeState.email === "string" ? routeState.email : undefined,
    password:
      typeof routeState.password === "string" ? routeState.password : undefined,
  };
}

export function buildSigninRouteState(email: string, password: string) {
  return { email, password } satisfies NonNullable<SigninRouteState>;
}
