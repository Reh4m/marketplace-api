import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

import { OrderDetails } from "@typedefs/order-details.type";

@ObjectType()
export class SupplierAndProducts {
  @Field()
  supplierId: Types.ObjectId;

  @Field((_type) => [OrderDetails])
  details: OrderDetails[];
}
