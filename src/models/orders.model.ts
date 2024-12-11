import { modelOptions, prop as Property, Ref } from "@typegoose/typegoose";
import { Field, Int, ObjectType } from "type-graphql";
import { Types } from "mongoose";

import { User } from "@models/users.model";
import { OrderDetails } from "@typedefs/order-details.type";
import { Address } from "@typedefs/addresses.type";

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Order {
  @Field()
  readonly _id?: Types.ObjectId;

  @Field({ nullable: true })
  @Property({ default: new Date() })
  orderDate?: Date;

  @Field({ nullable: true })
  @Property()
  shippedDate?: Date;

  @Field((type) => User)
  @Property({ ref: () => User, required: true })
  owner!: Ref<User>;

  @Field((type) => Address)
  @Property({ required: true })
  shipAddress!: Address;

  @Field((type) => [OrderDetails])
  @Property({ required: true })
  details!: OrderDetails[];

  @Field({ nullable: true })
  @Property()
  coupon?: string;

  @Field((type) => Int, { nullable: true })
  @Property()
  couponDiscount?: number;
}
