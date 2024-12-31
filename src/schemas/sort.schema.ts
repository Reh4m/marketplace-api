import { IsEnum, IsNotEmpty } from "class-validator";
import { Field, InputType, registerEnumType } from "type-graphql";

export enum SortBy {
  CREATED_AT = "createdAt",
  PRICE = "price",
}

registerEnumType(SortBy, {
  name: "SortProductsBy",
  description: "Fields by which products can be sorted",
});

export enum SortOrder {
  DESC = "desc",
  ASC = "asc",
}

registerEnumType(SortOrder, {
  name: "SortProductsOrder",
  description: "Order in which products can be sorted",
});

@InputType()
export class SortProductsInput {
  @Field((_type) => SortBy)
  @IsNotEmpty()
  @IsEnum(SortBy)
  by: SortBy;

  @Field((_type) => SortOrder)
  @IsNotEmpty()
  @IsEnum(SortOrder)
  order: SortOrder;
}
