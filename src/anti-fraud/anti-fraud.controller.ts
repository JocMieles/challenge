import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController {
    constructor(private readonly antiFraudService: AntiFraudService) {}
    
    /**
 * Controlador que maneja mensajes de Kafka relacionados con la creación de transacciones.
 * Escucha específicamente por el patrón de mensaje 'transaction_created' o el definido
 * por la variable de entorno KAFKA_GROUP_TRAN.
 *
 * @param {any} payload - El cuerpo del mensaje recibido desde Kafka, que contiene los datos de la transacción.
 */
    @MessagePattern(`${process.env.KAFKA_GROUP_TRAN || 'transaction_created'}`)
    consume(@Payload() payload) {
      this.antiFraudService.validate(payload)
    }
}
