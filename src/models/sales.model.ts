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
  @Field((type) => Types.ObjectId)
  readonly _id?: Types.ObjectId;

  @Field((type) => Order)
  @Property({ ref: () => Order, required: true })
  order!: Ref<Order>;

  @Field((type) => Date, { nullable: true })
  @Property({ default: new Date() })
  orderDate?: Date;

  @Field((type) => [OrderDetails])
  @Property({ required: true })
  details!: OrderDetails[];

  @Field((type) => User)
  @Property({ ref: () => User, required: true })
  customer!: Ref<User>;

  @Field((type) => Address)
  @Property({ required: true })
  shipAddress!: Address;

  @Field((type) => Status, { nullable: true })
  @Property({ enum: Status, default: Status.PENDING })
  status?: Status;

  @Field((type) => User)
  @Property({ ref: () => User, required: true })
  owner!: Ref<User>;
}
