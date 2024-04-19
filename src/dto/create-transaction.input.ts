import { Field, InputType } from '@nestjs/graphql/dist';
import { IsInt, Min, IsString, IsNumber } from 'class-validator';

//Resource to create a transaction that must containt
@InputType()
export class CreateTransactionInput {
  @Field()
  @IsString()
  accountExternalIdDebit: string;

  @Field()
  @IsString()
  accountExternalIdCredit: string;

  @Field()
  @IsInt()
  @Min(1)
  transferTypeId: number;

  @Field()
  @IsNumber({}, { message: 'El valor debe ser un número.' })
  @Min(0, { message: 'El campo debe ser mayor a 0' })
  value: number;
}