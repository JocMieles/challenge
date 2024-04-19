import { Transaction, TransactionResponse } from '../entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql/dist';

@Resolver(() => [Transaction])
export class TransactionResolver {
  constructor(private readonly transactionsService: TransactionService) { }

  /** 
  * Servicio para traer todos los productos registrados dentro de un escenario del proyecto 
  * @param createTransactionDto identificación del escenario *
  * @returns createTransactionDto 
  */
  @Mutation(() => Transaction)
  async createTransaction(@Args('createTransaction') createTransactionInput: CreateTransactionInput) {
    return this.transactionsService.create(createTransactionInput);
  }

  /** 
  * Servicio para traer todos los productos registrados dentro de un escenario del proyecto 
  * @param createTransactionDto identificación del escenario *
  * @returns createTransactionDto 
  */
  @Query(() => [TransactionResponse])
  async transactions() {
    const all = await this.transactionsService.findAll();
    return all;
  }

  /** 
  * Servicio para traer todos los productos registrados dentro de un escenario del proyecto 
  * @param createTransactionDto identificación del escenario *
  * @returns createTransactionDto 
  */
  @Query(() => TransactionResponse, { nullable: true })
  async transaction(@Args('id', { type: () => Int }) id: number): Promise<any | null> {
    const transaction: any = await this.transactionsService.findOne(id);

    if (!transaction) {
      return null;
    }
    return transaction;
  }
}