import { NonEmptyArray } from "type-graphql";

import { AddressResolver } from "./users/addresses.resolver";
import { UserResolver } from "./users/users.resolver";
import { CartResolver } from "./users/cart.resolver";
import { AuthResolver } from "./auth.resolver";
import { ProductResolver } from "./products.resolver";
import { OrderResolver } from "./orders.resolver";
import { CategoryResolver } from "./categories.resolver";
import { SaleResolver } from "./sales.resolver";
import { CouponResolver } from "./coupons.resolver";

export const resolvers: NonEmptyArray<Function> = [
  // User Resolvers
  UserResolver,
  AddressResolver,
  CartResolver,
  AuthResolver,
  ProductResolver,
  OrderResolver,
  CategoryResolver,
  SaleResolver,
  CouponResolver,
];
