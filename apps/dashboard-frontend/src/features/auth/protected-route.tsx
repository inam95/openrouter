import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router";

import { AuthLoader } from "./auth-loader";
import { authQueryKeys, fetchSessionProfile } from "./lib/session";

export function ProtectedRoute() {
  const { isPending, isError } = useQuery({
    queryKey: authQueryKeys.session,
    queryFn: fetchSessionProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return <AuthLoader />;
  }

  if (isError) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
