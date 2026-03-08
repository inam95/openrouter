import {
  getProfileResponseSchema,
  getProfileFailedResponseSchema,
} from "@repo/contracts";

export namespace UserModel {
  export const getProfileResponse = getProfileResponseSchema;
  export type GetProfileResponse = import("@repo/contracts").GetProfileResponse;

  export const getProfileFailedResponse = getProfileFailedResponseSchema;
  export type GetProfileFailedResponse =
    import("@repo/contracts").GetProfileFailedResponse;
}
