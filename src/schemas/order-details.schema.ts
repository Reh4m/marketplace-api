import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsNotEmptyObject,
  Min,
  Max,
} from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { Type } from "class-transformer";

import { OrderDetails } from "@typedefs/order-details.type";
import { Product } from "@models/products.model";
import { ProductDetailsInput } from "@schemas/products.schema";

@InputType()
export class CreateOrderDetailsInput implements Partial<OrderDetails> {
  @Field(() => ProductDetailsInput)
  @IsNotEmpty()
  @IsNotEmptyObject()
  @Type(() => ProductDetailsInput)
  product: Product;

  @Field()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;
}
