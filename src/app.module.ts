import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { GraphQLModule } from '@nestjs/graphql/dist';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.example',
    }),
    TransactionModule, AntiFraudModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.PGSQL_HOST || 'localhost'}`,
      port: parseFloat(`${process.env.PGSQL_PORT || '5432'}`),
      username: `${process.env.PGSQL_USERNAME || 'postgres'}`,
      password: `${process.env.PGSQL_PASSWORD || 'postgres'}`,
      database: `${process.env.PGSQL_DATABASE || 'postgres'}`,
      autoLoadEntities: true, // automágicamente carga las entidades
      synchronize: true, // en
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
