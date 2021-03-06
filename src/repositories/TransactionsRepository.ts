import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sumTransactions = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += Number(transaction.value);
        } else {
          accumulator.outcome += Number(transaction.value);
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const balance = {
      income: sumTransactions.income,
      outcome: sumTransactions.outcome,
      total: sumTransactions.income - sumTransactions.outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
