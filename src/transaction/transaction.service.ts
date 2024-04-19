import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction, TransactionResponse, TransactionTypes } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE') private clientKafka: ClientKafka,
  ) { }

  /**
 * Crea una nueva transacción en la base de datos y emite un evento a Kafka para su procesamiento.
 * Utiliza UUIDs generados automáticamente para los campos accountExternalIdDebit y accountExternalIdCredit.
 * 
 * @param {CreateTransactionInput} createTransactionDto - Objeto que contiene los datos necesarios para crear la transacción.
 * @returns La transacción creada con sus respectivos UUIDs y otros datos relevantes.
 */
  async create(createTransactionDto: CreateTransactionInput) {
    // Aquí se crea la transacción en la base de datos y se envía el evento a Kafka
    const transaction: any = this.transactionsRepository.create(createTransactionDto);
    transaction.accountExternalIdDebit = uuidv4();
    transaction.accountExternalIdCredit = uuidv4();
    await this.transactionsRepository.save(transaction);
    this.clientKafka.emit(`${process.env.KAFKA_GROUP_TRAN || 'transaction_created'}`, { transaction });
    return transaction;
  }

  /**
 * Recupera todas las transacciones de la base de datos y las devuelve en un formato de respuesta específico.
 * Cada transacción es transformada a un DTO de respuesta que incluye el id, los identificadores externos de la cuenta,
 * el valor, la fecha de creación, el tipo de transacción y el estado de la transacción.
 * 
 * @returns {Promise<TransactionResponse[]>} Un arreglo de DTOs que representan la respuesta de la transacción.
 */
  async findAll() {
    const transactions = await this.transactionsRepository.find();
    return transactions.map(transaction => {
      const dto = new TransactionResponse();
      dto.id = transaction.id;
      dto.transactionExternalId = transaction.accountExternalIdDebit;
      dto.value = transaction.value;
      dto.createdAt = transaction.createdAt;
      dto.transactionType = { name: TransactionTypes[transaction.transferTypeId - 1].name };
      dto.transactionStatus = { name: transaction.status };
      return dto;
    });
  }

 /**
 * Actualiza una transacción existente en la base de datos con la información proporcionada.
 * Esta función espera recibir un objeto completo de transacción que incluya todas las propiedades necesarias
 * para actualizar un registro existente, como el identificador único y los valores que se desean modificar.
 * 
 * @param {Transaction} transaction - Objeto de transacción con los datos actualizados.
 * @returns {Promise<Transaction>} Devuelve una promesa que se resuelve con la transacción actualizada.
 */
  async update(transaction: Transaction) {
    return await this.transactionsRepository.save(transaction)
  }

  /**
 * Recupera una transacción por su ID y devuelve los detalles formateados de la transacción.
 * Si la transacción no existe, devuelve `null`. Esta función es útil para obtener la información
 * completa de una transacción, incluidos el tipo de transacción y el estado de la transacción,
 * que están formateados como objetos con una propiedad `name`.
 *
 * @param {number} id - El identificador único de la transacción que se va a recuperar.
 * @returns {Promise<Transaction | null>} - Promesa que resuelve con la transacción encontrada
 * o `null` si la transacción no existe.
  */
  async findOne(id: number) {
    const tran = await this.transactionsRepository.findOne({ where: { id: id } });
    if (!tran) return null;
    return {
      transactionExternalId: tran.accountExternalIdDebit,
      transactionType: {
        name: TransactionTypes[tran.transferTypeId - 1].name,
      },
      transactionStatus: {
        name: tran.status,
      },
      value: tran.value,
      createdAt: tran.createdAt,
    };
  }
}
