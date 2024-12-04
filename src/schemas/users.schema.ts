import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Field, InputType } from "type-graphql";
import { Type } from "class-transformer";

import { User } from "@models/users.model";
import { CartItem } from "@typedefs/cart-item.type";
import { CartItemInput } from "@schemas/cart.schema";

@InputType()
export class CreateUserInput {
  @Field()
  @MaxLength(32)
  username: string;

  @Field()
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  @MaxLength(32)
  username?: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @Field(() => [CartItemInput], { nullable: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  cart?: CartItem[];
}
