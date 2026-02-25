import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrowserRouter, Routes, Route } from "react-router";

import { type App } from "primary-backend";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import { treaty } from "@elysiajs/eden";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/dashboard";
import { Credits } from "./pages/credits";
import { ApiKeys } from "./pages/api-keys";
import { Landing } from "./pages/landing";

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
  );
}

export default App;
