import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsObject,
  IsNotEmptyObject,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { Field, InputType, Int } from "type-graphql";
import { Types } from "mongoose";

import { Order } from "@models/orders.model";
import { OrderDetails } from "@typedefs/order-details.type";
import { Address } from "@typedefs/addresses.type";
import { CreateOrderDetailsInput } from "@schemas/order-details.schema";
import { AddressInput } from "@schemas/addresses.schema";

@InputType()
export class CreateOrderInput implements Partial<Order> {
  @Field()
  @IsNotEmpty()
  owner: Types.ObjectId;

  @Field(() => AddressInput)
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AddressInput)
  shipAddress: Address;

  @Field(() => [CreateOrderDetailsInput])
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailsInput)
  details: OrderDetails[];

  @Field({ nullable: true })
  @IsNotEmpty()
  coupon?: string;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  couponDiscount?: number;
}
