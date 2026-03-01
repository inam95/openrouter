import {
  signInBodySchema,
  signInFailedResponseSchema,
  signInResponseSchema,
  signUpBodySchema,
  signUpFailedResponseSchema,
  signUpResponseSchema,
} from "@repo/contracts";

export namespace AuthModel {
  export const signInBody = signInBodySchema;
  export type SignInBody = import("@repo/contracts").SignInBody;

  export const signInFailedResponse = signInFailedResponseSchema;
  export type SignInFailedResponse =
    import("@repo/contracts").SignInFailedResponse;

  export const signInResponse = signInResponseSchema;
  export type SignInResponse = import("@repo/contracts").SignInResponse;

  export const signUpBody = signUpBodySchema;
  export type SignUpBody = import("@repo/contracts").SignUpBody;

  export const signUpFailedResponse = signUpFailedResponseSchema;
  export type SignUpFailedResponse =
    import("@repo/contracts").SignUpFailedResponse;

  export const signUpResponse = signUpResponseSchema;
  export type SignUpResponse = import("@repo/contracts").SignUpResponse;
}
