import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql/dist';

export enum TransactionStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export const TransactionTypes = [
  { name: 'Deposit' },
  { name: 'Withdrawal' },
  { name: 'Transfer' },
  { name: 'Payment' }
];

//Resource to create a transaction that must containt
@ObjectType() 
@Entity() 
export class Transaction {
  @Field(() => ID) 
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Field()
  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Field(() => Int)
  @Column()
  transferTypeId: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Field()
  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING
  })
  status: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}


@ObjectType()
class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
class TransactionStatus {
  @Field()
  name: string;
}

//Resource to retrieve a transaction
@ObjectType()
export class TransactionResponse {
  @Field()
  id: number;

  @Field()
  transactionExternalId: string;

  @Field(type => TransactionType)
  transactionType: TransactionType;

  @Field(type => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: Date;
}
