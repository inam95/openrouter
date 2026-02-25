import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apiKeys";
import { app as modelApp } from "./modules/models";
import { app as paymentApp } from "./modules/payments";

export const app = new Elysia()
  .use(authApp)
  .use(apiKeyApp)
  .use(modelApp)
  .use(paymentApp);

export type App = typeof app;
