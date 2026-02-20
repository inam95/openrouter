import { Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./services";

export const app = new Elysia({ prefix: "auth" })
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(body.email, body.password);
        return {
          id: userId,
        };
      } catch {
        return status(400, {
          message: "Error while sign in",
        });
      }
    },
    {
      body: AuthModel.signUpBody,
      response: {
        200: AuthModel.signUpResponse,
        400: AuthModel.signUpFailedResponse,
      },
    }
  )
  .post(
    "/sign-in",
    async ({ body }) => {
      const token = await AuthService.signin(body.email, body.password);
      return {
        token,
      };
    },
    {
      body: AuthModel.signInBody,
      response: {
        200: AuthModel.signInResponse,
        400: AuthModel.signInFailedResponse,
      },
    }
  );
