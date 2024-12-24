import { ArgsType, Field, Int } from "type-graphql";
import { IsNumber, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SortProductsInput } from "./sort.schema";
import { FilterProductsInput } from "./filter.schema";

@ArgsType()
export class GetProductsArgs {
  @Field((_type) => Int)
  @IsNumber()
  @Min(0)
  skip: number;

  @Field((_type) => Int)
  @IsNumber()
  @Min(1)
  @Max(50)
  take: number;

  @Field((_type) => SortProductsInput)
  @ValidateNested()
  @Type(() => SortProductsInput)
  sort: SortProductsInput;

  @Field((_type) => FilterProductsInput, { nullable: true })
  @ValidateNested()
  @Type(() => FilterProductsInput)
  filter?: FilterProductsInput;

  // Helpers
  get skips(): number {
    return this.skip * this.take;
  }
}
