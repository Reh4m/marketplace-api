import { getModelForClass } from "@typegoose/typegoose";

import { Category } from "./categories.model";
import { Coupon } from "./coupons.model";
import { Order } from "./orders.model";
import { Product } from "./products.model";
import { Sale } from "./sales.model";
import { User } from "./users.model";

export const CategoryModel = getModelForClass<typeof Category>(Category);
export const CouponModel = getModelForClass<typeof Coupon>(Coupon);
export const OrderModel = getModelForClass<typeof Order>(Order);
export const ProductModel = getModelForClass<typeof Product>(Product);
export const SaleModel = getModelForClass<typeof Sale>(Sale);
export const UserModel = getModelForClass<typeof User>(User);
