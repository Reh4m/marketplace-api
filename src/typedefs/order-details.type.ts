import { Field, ObjectType } from "type-graphql";
import { modelOptions, prop as Property } from "@typegoose/typegoose";

import { Product } from "@models/products.model";

@ObjectType()
@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class OrderDetails {
  @Field((type) => Product)
  @Property({ required: true })
  product: Product;

  @Field((type) => Number)
  @Property({ required: true })
  unitPrice: number;

  @Field((type) => Number)
  @Property({ required: true })
  quantity: number;

  @Field((type) => Number, { nullable: true })
  @Property()
  discount?: number;
}
