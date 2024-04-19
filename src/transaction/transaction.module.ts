import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionResponse } from '../entities/transaction.entity';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionResponse]),
  ClientsModule.register([
    {
      name: 'KAFKA_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${process.env.KAFKA_HOST || 'localhost'}:${process.env.KAFKA_PORT || 9092}`],
        }
      },
    },
  ]),
],
  providers: [TransactionService, TransactionResolver],
  controllers: [TransactionController],
})
export class TransactionModule {}
