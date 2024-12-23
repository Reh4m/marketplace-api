import { User } from "@/models/users.model";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class SignUpInput implements Partial<User> {
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
  @MaxLength(128)
  password: string;
}

@InputType()
export class LogInInput implements Partial<User> {
  @Field()
  @MaxLength(32)
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
