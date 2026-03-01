import { type App } from "primary-backend";
import { treaty } from "@elysiajs/eden";

export const client = treaty<App>("localhost:3000");
