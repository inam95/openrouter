import { prisma } from "db";

export abstract class UserService {
  static async getUserDetails(userId: string) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });
  }
}
