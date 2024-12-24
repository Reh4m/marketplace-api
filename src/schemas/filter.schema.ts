import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsArray,
  Min,
} from "class-validator";
import { Types } from "mongoose";
import { Field, InputType, Int, ObjectType } from "type-graphql";

import { Condition } from "@models/products.model";

@ObjectType()
class ProductsFilterByPrice {
  @Field(() => Int)
  min: number;

  @Field(() => Int)
  max: number;
}

@InputType()
class FilterProductsByPriceInput {
  @Field(() => Int)
  @IsNumber()
  @Min(0)
  min: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  max: number;
}

@InputType()
export class FilterProductsInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  category?: Types.ObjectId;

  @Field(() => FilterProductsByPriceInput, { nullable: true })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @Type(() => FilterProductsByPriceInput)
  priceRange?: ProductsFilterByPrice;

  @Field(() => [Condition], { nullable: true })
  @IsNotEmpty()
  @IsArray()
  condition?: Condition[];
}
