import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { Types } from "mongoose";

import { CartItem } from "@typedefs/cart-item.type";

@InputType()
export class CartItemInput implements Partial<CartItem> {
  @Field()
  @IsNotEmpty()
  product: Types.ObjectId;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  quantity: number;
}
