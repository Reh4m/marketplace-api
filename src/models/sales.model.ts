import { modelOptions, prop as Property, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import { OrderDetails } from "@typedefs/order-details.type";
import { Address } from "@typedefs/addresses.type";
import { User } from "@models/users.model";
import { Order } from "@models/orders.model";

export enum Status {
  PENDING = "pending",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

registerEnumType(Status, {
  name: "OrderStatus",
  description: "Sets the current status of a order/sale",
});

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Sale {
  @Field()
  readonly _id?: Types.ObjectId;

  @Field((_type) => Order)
  @Property({ ref: () => Order, required: true })
  order!: Ref<Order>;

  @Field({ nullable: true })
  @Property({ default: new Date() })
  orderDate?: Date;

  @Field((_type) => [OrderDetails])
  @Property({ required: true })
  details!: OrderDetails[];

  @Field((_type) => User)
  @Property({ ref: () => User, required: true })
  customer!: Ref<User>;

  @Field((_type) => Address)
  @Property({ required: true })
  shipAddress!: Address;

  @Field((_type) => Status, { nullable: true })
  @Property({ enum: Status, default: Status.PENDING })
  status?: Status;

  @Field((_type) => User)
  @Property({ ref: () => User, required: true })
  owner!: Ref<User>;
}
