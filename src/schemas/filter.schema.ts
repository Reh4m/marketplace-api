import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsArray,
  Min,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Types } from "mongoose";
import { Field, InputType, Int, ObjectType } from "type-graphql";

import { Condition } from "@models/products.model";

@ObjectType()
class ProductsFilterByPrice {
  @Field((_type) => Int)
  min: number;

  @Field((_type) => Int)
  max: number;
}

@InputType()
class FilterProductsByPriceInput {
  @Field((_type) => Int)
  @IsNumber()
  @Min(0)
  min: number;

  @Field((_type) => Int)
  @IsNumber()
  @Min(0)
  max: number;
}

@InputType()
export class FilterProductsInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  category?: Types.ObjectId;

  @Field((_type) => FilterProductsByPriceInput, { nullable: true })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FilterProductsByPriceInput)
  priceRange?: ProductsFilterByPrice;

  @Field((_type) => [Condition], { nullable: true })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Condition, { each: true })
  condition?: Condition[];
}
