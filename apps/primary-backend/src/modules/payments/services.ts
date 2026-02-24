import { prisma } from "db";

const ONRAMP_AMOUNT = 100;

export abstract class PaymentService {
  static async onramp(userId: string) {
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: ONRAMP_AMOUNT,
        },
      }),
      prisma.onrampTransaction.create({
        data: {
          userId,
          amount: ONRAMP_AMOUNT,
          status: "complete",
        },
      }),
    ]);

    return user.credits;
  }
}
