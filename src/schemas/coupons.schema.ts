import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { Type } from "class-transformer";
import { Types } from "mongoose";

import { Coupon, Status } from "@models/coupons.model";

@InputType()
export class CreateCouponInput implements Partial<Coupon> {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  expirationDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => [Types.ObjectId], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  validCategories?: Types.ObjectId[];

  @Field(() => [Types.ObjectId], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  invalidCategories?: Types.ObjectId[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  onlyForOwnerProducts?: boolean;

  @Field()
  @IsNotEmpty()
  owner: Types.ObjectId;
}

@InputType()
export class UpdateCouponInput implements Partial<Coupon> {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  expirationDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => [Types.ObjectId], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  validCategories?: Types.ObjectId[];

  @Field(() => [Types.ObjectId], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  invalidCategories?: Types.ObjectId[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  onlyForOwnerProducts?: boolean;

  // Cannot modify the Coupon Owner
}
