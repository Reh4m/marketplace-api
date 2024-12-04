import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsObject,
  IsNotEmptyObject,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { Field, InputType } from "type-graphql";
import { Types } from "mongoose";

import { Sale, Status } from "@models/sales.model";
import { OrderDetails } from "@typedefs/order-details.type";
import { Address } from "@typedefs/addresses.type";
import { CreateOrderDetailsInput } from "@schemas/order-details.schema";
import { AddressInput } from "@schemas/addresses.schema";

@InputType()
export class CreateSaleInput implements Partial<Sale> {
  @Field(() => Types.ObjectId)
  @IsNotEmpty()
  order: Types.ObjectId;

  @Field(() => [CreateOrderDetailsInput])
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailsInput)
  details: OrderDetails[];

  @Field(() => Types.ObjectId)
  @IsNotEmpty()
  customer: Types.ObjectId;

  @Field(() => AddressInput)
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AddressInput)
  shipAddress: Address;

  @Field(() => Types.ObjectId)
  @IsNotEmpty()
  owner: Types.ObjectId;
}

@InputType()
export class UpdateSaleStatusInput {
  @Field(() => Status)
  @IsEnum(Status)
  status: Status;
}
