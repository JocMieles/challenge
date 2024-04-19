import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
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
  providers: [AntiFraudService],
  controllers: [AntiFraudController]
})
export class AntiFraudModule {}
