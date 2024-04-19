import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    /**
   * Busca una transacción por su ID y devuelve los detalles de la misma.
   * @param {number} id - El ID de la transacción a buscar.
   * @returns La transacción encontrada o `null` si no existe.
   */
  @Post()
  create(@Body() createTransaction: CreateTransactionInput) {
    return this.transactionService.create(createTransaction);
  }

  /**
   * Busca una transacción por su ID y devuelve los detalles de la misma.
   * @param {number} id - El ID de la transacción a buscar.
   * @returns La transacción encontrada o `null` si no existe.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.transactionService.findOne(id);
  }

  /**
   * Recupera todas las transacciones registradas en la base de datos.
   * @returns Un array de todas las transacciones.
   */
  @Get('')
  findAll(@Param() id: number) {
    return this.transactionService.findAll();
  }

  /**
   * Consume mensajes del tópico Kafka y actualiza las transacciones basadas en el contenido del mensaje.
   * @param payload - El mensaje recibido del tópico Kafka.
   */
  @MessagePattern(`${process.env.KAFKA_GROUP_FRAUD || 'anti_fraude'}`)
  consume(@Payload() payload) {
    this.transactionService.update(payload)
  }
}