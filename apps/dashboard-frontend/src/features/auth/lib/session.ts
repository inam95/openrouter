import { client } from "@/client";

export const authQueryKeys = {
  session: ["auth", "session"] as const,
};

export async function fetchSessionProfile() {
  const response = await client.user.profile.get();

  if (response.status !== 200) {
    throw new Error("Unauthorized");
  }

  return response.data;
}
