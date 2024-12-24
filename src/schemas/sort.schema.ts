import { IsNotEmpty } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class SortProductsArgs {
  @Field()
  @IsNotEmpty()
  by: string;

  @Field()
  @IsNotEmpty()
  order: string;
}
