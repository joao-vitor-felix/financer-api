import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/client";
import { IGetUserBalanceRepository } from "@/types";

export class PostgresGetUserBalanceRepository
  implements IGetUserBalanceRepository
{
  async execute(userId: string) {
    const {
      _sum: { amount: totalExpenses }
    } = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: "EXPENSE"
      },
      _sum: {
        amount: true
      }
    });

    const {
      _sum: { amount: totalEarnings }
    } = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: "EARNING"
      },
      _sum: {
        amount: true
      }
    });

    const {
      _sum: { amount: totalInvestments }
    } = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: "INVESTMENT"
      },
      _sum: {
        amount: true
      }
    });

    const initialBalance = new Prisma.Decimal(0);

    const _totalEarnings = totalEarnings ?? initialBalance;
    const _totalExpenses = totalExpenses ?? initialBalance;
    const _totalInvestments = totalInvestments ?? initialBalance;

    const balance = new Prisma.Decimal(
      Number(_totalEarnings) -
        Number(_totalExpenses) -
        Number(_totalInvestments)
    );

    return {
      earnings: _totalEarnings,
      expenses: _totalExpenses,
      investments: _totalInvestments,
      balance
    };
  }
}
