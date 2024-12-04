import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from "class-validator";
import { Field, InputType } from "type-graphql";

import { Condition, Product, Status } from "@/models/products.model";
import { Types } from "mongoose";

@InputType()
export class CreateProductInput implements Partial<Product> {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @Field()
  @IsNotEmpty()
  images: string;

  @Field()
  @IsNumber()
  @Min(0)
  stock: number;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Condition)
  @IsNotEmpty()
  @IsEnum(Condition)
  condition: Condition;

  @Field()
  @IsNotEmpty()
  category: Types.ObjectId;

  @Field()
  @IsNotEmpty()
  owner: Types.ObjectId;
}

@InputType()
export class UpdateProductInput implements Partial<Product> {
  @Field({ nullable: true })
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  images?: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  price?: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @Field(() => Status, { nullable: true })
  @IsNotEmpty()
  @IsEnum(Status)
  status?: Status;

  @Field(() => Condition, { nullable: true })
  @IsNotEmpty()
  @IsEnum(Condition)
  condition?: Condition;

  @Field({ nullable: true })
  @IsNotEmpty()
  category?: Types.ObjectId;

  // Cannot modify the Product Owner
}

@InputType()
export class ProductDetailsInput implements Partial<Product> {
  @Field()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  images: string;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @Field()
  @IsNotEmpty()
  owner: Types.ObjectId;
}
