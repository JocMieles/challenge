# Solucion

La solución implementa un sistema de procesamiento de transacciones financieras. Cada transacción es recibida por el modulo transaction, validada a través de un microservicio anti-fraude y luego actualiza su estado según el resultado de dicha validación. Todo esto es manejado por el manejador de colas **Kafka**.

# Tecnologías Utilizadas

<ol>
  <li>NestJS</li>
  <li>Kafka</li>
  <li>TypeORM</li>
  <li>GraphQL</li>
  <li>Docker</li>
</ol>

# Despliegue

Para desplegar debes tener instalado Docker y Docker Compose, clonar el repositorio y ejecutar el comando **docker-compose up -d**, recuerda colocar y configurar las variables necesarias en el archivo **.env.example**.
Esto iniciará todas las dependencias y servicios definidos, incluidos la API, Kafka y la base de datos. 

# Uso

Una vez que los servicios estén en ejecución, la API estará disponible en *http://localhost:3000* y para graphql en *http://localhost:3000/graphql*

# API 

**Crear una transacción**
POST http://localhost:3000/transactions Envía un JSON con la estructura del objeto CreateTransactionInput para crear una nueva transacción.
**graphql**
```json
mutation {
  createTransaction(
    createTransaction: {
      accountExternalIdDebit: "G",
      accountExternalIdCredit: "G",
      transferTypeId: 1,
      value: 100
    }
  ) {
    id
    ,accountExternalIdDebit
    ,accountExternalIdCredit
    ,transferTypeId
    ,value
    ,status
  }
}
```
**postman**
```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

**Recuperar una transacción**
GET http://localhost:3000/transactions/{id} Reemplaza {id} con el identificador único de la transacción que deseas recuperar.
**graphql**
```json
query {
  transaction(id: 1){
transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```

**Listar todas las transacciones**
GET http://localhost:3000/transactions Este punto final devuelve un array con todas las transacciones registradas en el sistema.
**graphql**
```json
query{
  transactions{
    transactionExternalId,
    transactionType{
      name
    },
    transactionStatus{
      name
    },
    value,
    createdAt
  }
}
```

# Consideraciones

Para una mayor optimización y mejora de la aplicación a futuro, lo ideal es crear particiones en Kafka por cada tipo de transferencia, y asi separarlas para un mejor procesamiento de las transacciones, pensando en que a diario se pueden recibir mas de 8 millones de esta.