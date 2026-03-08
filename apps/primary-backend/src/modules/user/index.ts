import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { UserService } from "./services";
import { UserModel } from "./models";

export const app = new Elysia({ prefix: "user" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .resolve(async ({ cookie, status, jwt }) => {
    if (!cookie.auth) {
      return status(401);
    }
    const decoded = await jwt.verify(cookie.auth.value as string);
    if (!decoded || !decoded.userId) {
      return status(401);
    }
    return {
      userId: decoded.userId as string,
    };
  })
  .get(
    "/profile",
    async ({ userId, status }) => {
      const userData = await UserService.getUserDetails(userId);
      if (!userData) {
        return status(404, {
          message: "User not found",
        });
      }
      return userData;
    },
    {
      response: {
        200: UserModel.getProfileResponse,
        404: UserModel.getProfileFailedResponse,
      },
    }
  );
