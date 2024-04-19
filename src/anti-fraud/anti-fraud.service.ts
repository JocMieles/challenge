import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusEnum } from 'src/entities/transaction.entity';

@Injectable()
export class AntiFraudService {
  constructor(@Inject('KAFKA_SERVICE') private kafka: ClientKafka) { }

  /**
 * Valida la transacción basándose en su valor. Si el valor de la transacción
 * supera un umbral definido (por ejemplo, 1000), la transacción se marca
 * como rechazada; de lo contrario, se aprueba.
 * 
 * @param {any} transactionObj - El objeto que contiene los datos de la transacción.
 * @returns {Object} - Un objeto que incluye el ID de la transacción y su nuevo estado.
 */
  public validate(transactionObj) {
    const transaction = transactionObj.transaction
    const status = transaction.value > 1000 ? TransactionStatusEnum.REJECTED : TransactionStatusEnum.APPROVED;
    this.kafka.emit(`${process.env.KAFKA_GROUP_FRAUD || 'anti_fraud'}`, {
      id: transaction.id,
      status: status,
    });
    return {
      id: transaction.id,
      status: status,
    };
  }
}
