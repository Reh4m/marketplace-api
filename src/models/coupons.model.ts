import { ModelOptions, prop as Property, Ref } from "@typegoose/typegoose";
import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { Types } from "mongoose";

import { Category } from "@models/categories.model";
import { User } from "@models/users.model";

export enum Status {
  ACTIVE = "active",
  EXPIRED = "expired",
  REDEEMED_OUT = "redeemed_out",
  SUSPEND = "suspend",
}

registerEnumType(Status, {
  name: "CouponStatus",
  description: "Sets the current status of a coupon",
});

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@ObjectType()
export class Coupon {
  @Field()
  readonly _id?: Types.ObjectId;

  @Field()
  @Property({ required: true, unique: true })
  code!: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field({ nullable: true })
  @Property()
  expirationDate?: Date;

  @Field((_type) => Int, { nullable: true })
  @Property({ default: 0 })
  limit?: number;

  @Field((_type) => Int)
  @Property({ required: true })
  discount!: number;

  @Field((_type) => Status, { nullable: true })
  @Property({ enum: Status, default: Status.ACTIVE })
  status?: Status;

  @Field((_type) => [Category], { nullable: true })
  @Property({ ref: Category, default: null })
  validCategories?: Ref<Category>[];

  @Field((_type) => [Category], { nullable: true })
  @Property({ ref: Category, default: null })
  invalidCategories?: Ref<Category>[];

  @Field({ nullable: true })
  @Property({ default: false })
  isPublic?: boolean;

  @Field({ nullable: true })
  @Property({ default: false })
  onlyForOwnerProducts?: boolean;

  @Field((_type) => User)
  @Property({ ref: () => User, required: true })
  owner!: Ref<User>;
}
