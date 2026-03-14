import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { app as authApp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apiKeys";
import { app as modelApp } from "./modules/models";
import { app as paymentApp } from "./modules/payments";
import { app as userApp } from "./modules/user";

export const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    })
  )
  .use(authApp)
  .use(apiKeyApp)
  .use(modelApp)
  .use(paymentApp)
  .use(userApp);

export type App = typeof app;
