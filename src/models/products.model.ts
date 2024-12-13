import { modelOptions, prop as Property, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, Float, Int, ObjectType, registerEnumType } from "type-graphql";

import { Category } from "@models/categories.model";
import { User } from "@models/users.model";

export enum Status {
  AVAILABLE = "available",
  OUT_OF_STOCK = "out_of_stock",
  NOT_AVAILABLE = "not_available",
  DISCONTINUED = "discontinued",
  ON_PROMOTION = "on_promotion",
}

export enum Condition {
  NEW = "new",
  USED_LIKE_NEW = "used_like_new",
  USED_GOOD = "used_good",
  USED_FAIR = "used_fair",
}

registerEnumType(Status, {
  name: "ProductStatus",
  description: "Sets the current status of a product",
  valuesConfig: {
    AVAILABLE: {
      description: "Is in stock and ready for sale",
    },
    OUT_OF_STOCK: {
      description: "Is not available in inventory",
    },
    NOT_AVAILABLE: {
      description: "Is temporarily unavailable for sale",
    },
    DISCONTINUED: {
      description: "Product will no longer be sold once inventory is depleted.",
    },
    ON_PROMOTION: {
      description: "Product has a special price or discount.",
    },
  },
});

registerEnumType(Condition, {
  name: "ProductCondition",
  description: "Sets the product condition",
});

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Product {
  @Field()
  readonly _id?: Types.ObjectId;

  @Field()
  @Property({ required: true })
  name!: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field()
  @Property({ required: true })
  images!: string;

  @Field((_type) => Int)
  @Property({ required: true, default: 0 })
  stock!: number;

  @Field((_type) => Float)
  @Property({ required: true, default: 0.0 })
  price!: number;

  @Field((_type) => Int, { nullable: true })
  @Property({ default: 0 })
  discount?: number;

  @Field((_type) => Status, { nullable: true })
  @Property({ enum: Status, default: Status.AVAILABLE })
  status?: Status;

  @Field((_type) => Condition)
  @Property({ enum: Condition, required: true, default: Condition.NEW })
  condition!: Condition;

  @Field((_type) => Category)
  @Property({ ref: () => Category, required: true })
  category!: Ref<Category>;

  @Field((_type) => User)
  @Property({ ref: () => User, required: true })
  owner!: Ref<User>;

  @Field({ nullable: true })
  createdAt?: Date;
}
