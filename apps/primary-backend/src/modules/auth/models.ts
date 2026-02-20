import { t } from "elysia";

export namespace AuthModel {
  export const signInBody = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type SignInBody = typeof AuthModel.signInBody.static;

  export const signInResponse = t.Object({
    token: t.String(),
  });

  export type SignInResponse = typeof signInResponse.static;

  export const signUpBody = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export const signInFailedResponse = t.Object({
    message: t.Literal("Invalid credentials"),
  });

  export type SignInFailedResponse = typeof signInFailedResponse.static;

  export type SignUpBody = typeof signUpBody.static;

  export const signUpResponse = t.Object({
    id: t.String(),
  });

  export type SignUpResponse = typeof signUpResponse.static;

  export const signUpFailedResponse = t.Object({
    message: t.Literal("Error while sign in"),
  });

  export type SignUpFailedResponse = typeof signUpFailedResponse.static;
}
