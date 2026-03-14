import { BrowserRouter, Navigate, Outlet, Routes, Route } from "react-router";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/dashboard";
import { Credits } from "./pages/credits";
import { ApiKeys } from "./pages/api-keys";
import { Landing } from "./pages/landing";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { client } from "./client";

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { isPending, isError } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const response = await client.user.profile.get();
      if (response.status !== 200) throw new Error("Unauthorized");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) return <AuthLoader />;
  if (isError) return <Navigate to="/signin" replace />;
  return <Outlet />;
}

function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-spin rounded-full size-8 border-2 border-border border-t-primary" />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/api-keys" element={<ApiKeys />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
