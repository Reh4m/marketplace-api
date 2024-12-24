import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class SortProductsInput {
  @Field()
  @IsNotEmpty()
  by: string;

  @Field()
  @IsNotEmpty()
  order: string;
}
