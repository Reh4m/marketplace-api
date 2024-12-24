import { IsNotEmpty } from "class-validator";
import { ArgsType, Field } from "type-graphql";

import { SortOrderScalar } from "@scalars/SortOrderScalar";

@ArgsType()
export class SortProductsArgs {
  @Field()
  @IsNotEmpty()
  by: string;

  @Field(() => SortOrderScalar)
  @IsNotEmpty()
  order: typeof SortOrderScalar;
}
