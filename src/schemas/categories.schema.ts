import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

import { Category } from "@models/categories.model";

@InputType()
export class CreateCategoryInput implements Partial<Category> {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  picture?: string;
}

@InputType()
export class UpdateCategoryInput implements Partial<Category> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  picture?: string;
}
