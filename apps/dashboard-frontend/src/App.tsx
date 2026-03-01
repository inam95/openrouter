import { BrowserRouter, Routes, Route } from "react-router";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/dashboard";
import { Credits } from "./pages/credits";
import { ApiKeys } from "./pages/api-keys";
import { Landing } from "./pages/landing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  // const client = treaty<App>("localhost:3000");

  // function signin() {
  //   const res = client.auth["sign-in"]
  //     .post({
  //       email: "test1@test.com",
  //       password: "123456",
  //     })
  //     .then((result) => {
  //       if (result.status === 200) {
  //         const data = result.data;
  //       }
  //     });
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/api-keys" element={<ApiKeys />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
