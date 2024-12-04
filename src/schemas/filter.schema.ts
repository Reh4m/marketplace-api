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
class PriceFilter {
  @Field(() => Int)
  min: number;

  @Field(() => Int)
  max: number;
}

@InputType()
class PriceFilterInput {
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
export class FilterInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  category?: Types.ObjectId;

  @Field(() => PriceFilterInput, { nullable: true })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @Type(() => PriceFilterInput)
  priceRange?: PriceFilter;

  @Field(() => [Condition], { nullable: true })
  @IsNotEmpty()
  @IsArray()
  condition?: Condition[];
}
