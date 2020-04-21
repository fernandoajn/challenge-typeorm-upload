import { getCustomRepository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    let categoryId;

    const categoryExists = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      categoryId = newCategory.id;
    } else {
      categoryId = categoryExists.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
