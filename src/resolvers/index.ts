import { NonEmptyArray } from "type-graphql";

import { AuthResolver } from "./auth.resolver";
import { ProductResolver } from "./products.resolver";
import { UserResolver } from "./users.resolver";
import { OrderResolver } from "./orders.resolver";
import { CategoryResolver } from "./categories.resolver";
import { SaleResolver } from "./sales.resolver";
import { CouponResolver } from "./coupons.resolver";

export const resolvers: NonEmptyArray<Function> = [
  AuthResolver,
  ProductResolver,
  UserResolver,
  OrderResolver,
  CategoryResolver,
  SaleResolver,
  CouponResolver,
];
