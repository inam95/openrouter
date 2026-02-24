import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentService } from "./services";
import { PaymentModel } from "./models";

export const app = new Elysia({ prefix: "payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .resolve(async ({ cookie, status, jwt }) => {
    const decoded = await jwt.verify(cookie.auth.value as string);

    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return {
      userId: decoded.userId as string,
    };
  })
  .post(
    "/onramp",
    async ({ userId, status }) => {
      try {
        const credits = await PaymentService.onramp(userId);
        return {
          message: "Onramp successful",
          credits,
        };
      } catch (error) {
        return status(411, {
          message: "Onramp failed",
        });
      }
    },
    {
      response: {
        200: PaymentModel.onrampResponse,
        411: PaymentModel.onrampFailedResponse,
      },
    }
  );
