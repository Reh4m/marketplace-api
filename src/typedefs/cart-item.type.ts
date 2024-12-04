import { Field, ObjectType, Int } from "type-graphql";
import { modelOptions, prop as Property, Ref } from "@typegoose/typegoose";

import { Product } from "@/models/products.model";

@ObjectType()
@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class CartItem {
  @Field(() => Product)
  @Property({ ref: Product, required: true })
  product: Ref<Product>;

  @Field(() => Int)
  @Property({ required: true })
  quantity: number;
}
