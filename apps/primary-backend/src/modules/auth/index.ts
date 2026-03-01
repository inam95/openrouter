import { Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./services";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .post(
    "/sign-up",
    async ({ body, status }) => {
      const parsedBody = AuthModel.signUpBody.safeParse(body);
      if (!parsedBody.success) {
        return status(400, {
          message:
            parsedBody.error.issues[0]?.message ?? "Invalid sign up payload",
        });
      }

      try {
        const userId = await AuthService.signup(
          parsedBody.data.email,
          parsedBody.data.password
        );
        return {
          id: userId,
        };
      } catch (e) {
        console.log(e);
        return status(400, {
          message: "Error while sign up",
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
    async ({ jwt, body, status, cookie }) => {
      const parsedBody = AuthModel.signInBody.safeParse(body);
      if (!parsedBody.success) {
        return status(400, {
          message:
            parsedBody.error.issues[0]?.message ?? "Invalid sign in payload",
        });
      }

      const { correctCredentials, userId } = await AuthService.signin(
        parsedBody.data.email,
        parsedBody.data.password
      );
      if (correctCredentials && userId) {
        const token = await jwt.sign({ userId });
        cookie.auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
        });

        return {
          message: "Signed in successfully",
        };
      }

      return status(403, {
        message: "Invalid credentials",
      });
    },
    {
      body: AuthModel.signInBody,
      response: {
        200: AuthModel.signInResponse,
        403: AuthModel.signInFailedResponse,
        400: AuthModel.signInFailedResponse,
      },
    }
  );
