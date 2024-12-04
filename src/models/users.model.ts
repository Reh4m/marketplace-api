import { modelOptions, pre, prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType, registerEnumType } from "type-graphql";
import { Types } from "mongoose";

import { Address } from "@typedefs/addresses.type";
import { CartItem } from "@typedefs/cart-item.type";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

registerEnumType(Roles, {
  name: "UserRoles",
});

@pre<User>("save", function (next) {
  if (this.cart) {
    const uniqueProducts = new Map<string, CartItem>();

    this.cart.forEach((item) => {
      if (uniqueProducts.has(item.product.toString())) {
        const existingItem = uniqueProducts.get(item.product.toString());

        existingItem.quantity += item.quantity;
      } else {
        uniqueProducts.set(item.product.toString(), item);
      }
    });

    this.cart = Array.from(uniqueProducts.values());
  }

  next();
})
@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @Field((type) => Types.ObjectId)
  readonly _id?: Types.ObjectId;

  @Field((type) => String)
  @Property({ required: true, unique: true })
  username: string;

  @Field((type) => String)
  @Property()
  fullName: string;

  @Field((type) => String)
  @Property({ required: true, unique: true })
  email: string;

  @Field((type) => String)
  @Property({ required: true })
  password: string;

  @Field((type) => String, { nullable: true })
  @Property()
  phone?: string;

  @Field((type) => [Address], { nullable: true })
  @Property({ type: () => Address })
  addresses?: Address[];

  @Field(() => [CartItem], { nullable: true })
  @Property({ type: () => CartItem, default: [] })
  cart?: CartItem[];

  @Field((type) => Roles, { nullable: true })
  @Property({ enum: Roles, default: Roles.USER })
  role?: Roles;
}
