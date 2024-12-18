import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

import { SortOrderScalar } from "@scalars/SortOrderScalar";

@InputType()
export class SortInput {
  @Field(() => String)
  @IsNotEmpty()
  by: string;

  @Field(() => SortOrderScalar)
  @IsNotEmpty()
  order: typeof SortOrderScalar;
}
