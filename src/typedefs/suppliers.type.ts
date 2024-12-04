import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

import { OrderDetails } from "@typedefs/order-details.type";

@ObjectType()
export class SupplierAndProducts {
  @Field(() => Types.ObjectId)
  supplierId: Types.ObjectId;

  @Field(() => [OrderDetails])
  details: OrderDetails[];
}
