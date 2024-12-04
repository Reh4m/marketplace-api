import { Types } from "mongoose";
import { Service } from "typedi";

import { CreateOrderInput } from "@schemas/orders.schema";
import {
  CouponModel,
  OrderModel,
  ProductModel,
  SaleModel,
  UserModel,
} from "@models";
import { Order } from "@models/orders.model";
import { Product } from "@models/products.model";
import { User } from "@models/users.model";
import { Coupon, Status } from "@models/coupons.model";
import { SupplierAndProducts } from "@/typedefs/suppliers.type";
import { DocumentType } from "@typegoose/typegoose";

@Service()
export class OrderService {
  public async findUserOrders(userId: Types.ObjectId): Promise<Order[]> {
    const orders: Order[] = await OrderModel.find({ owner: userId })
    .sort({ orderDate: "desc" });

    return orders;
  }

  public async findOrderById(orderId: Types.ObjectId): Promise<Order> {
    const order: Order = await OrderModel.findById(orderId);

    if (!order) throw new Error("Order doesn't exist");

    return order;
  }

  public async createNewOrder(orderData: CreateOrderInput): Promise<Order> {
    let findProduct: Product;

    for (const { product, quantity } of orderData.details) {
      findProduct = await ProductModel.findById(product._id);

      if (!findProduct) throw new Error("Product doesn't exists");

      if (findProduct.stock == 0 || findProduct.stock < quantity)
        throw new Error(`Product ${product.name} is out of stock`);
    }

    const findUser: User = await UserModel.findById(orderData.owner._id);

    if (!findUser) throw new Error("User doesn't exists");

    // Validate coupon if provided
    if (orderData.coupon) {
      const findCoupon: DocumentType<Coupon> = await CouponModel.findOne({
        code: orderData.coupon,
      });

      if (!findCoupon) throw new Error("Coupon doesn't exist");

      if (findCoupon.status !== Status.ACTIVE)
        throw new Error("Coupon is not active");

      if (findCoupon.expirationDate && findCoupon.expirationDate < new Date()) {
        findCoupon.status = Status.EXPIRED;

        await findCoupon.save();

        throw new Error("Coupon has expired");
      }

      if (findCoupon.limit && findCoupon.limit <= 0) {
        findCoupon.status = Status.REDEEMED_OUT;

        await findCoupon.save();

        throw new Error("Coupon has been redeemed out");
      }

      // Apply coupon discount to order
      orderData.details.forEach((detail) => {
        detail.unitPrice = detail.unitPrice * (1 - findCoupon.discount / 100);
      });

      // Decrease the coupon limit by 1
      findCoupon.limit -= 1;

      if (findCoupon.limit <= 0) {
        findCoupon.status = Status.REDEEMED_OUT;
      }

      await findCoupon.save();
    }

    const newOrder: Order = await OrderModel.create(orderData);

    const newOrderFullData: Order = await OrderModel.findById(
      newOrder._id
    ).populate({ path: "owner", model: "User" });

    const suppliersOrders = this.findSupplierProducts(newOrderFullData);

    let saleData;

    for (const item of suppliersOrders) {
      saleData = new SaleModel({
        order: newOrder._id,
        details: item.details,
        customer: newOrderFullData.owner._id,
        shipAddress: newOrderFullData.shipAddress,
        owner: item.supplierId,
      });

      await saleData.save();
    }

    for (const { product, quantity } of orderData.details) {
      await ProductModel.findByIdAndUpdate(product._id, {
        $inc: { stock: -quantity },
      });
    }

    // Clear User Cart
    const updatedUser: DocumentType<User> = await UserModel.findById(
      orderData.owner._id
    );

    updatedUser.cart = [];

    await updatedUser.save();

    return newOrder;
  }

  private findSupplierProducts(orderData: Order): SupplierAndProducts[] {
    let suppliersAndProducts: SupplierAndProducts[] = [];

    const suppliersFromOrder: Types.ObjectId[] = orderData.details.map(
      (detail) => detail.product.owner
    ) as Types.ObjectId[];

    const suppliersObjectIdToString = suppliersFromOrder.map((item) =>
      item.toString()
    );

    const uniqueSuppliers = suppliersObjectIdToString.filter(
      (supplier, index, array) => array.indexOf(supplier) == index
    );

    for (const supplier of uniqueSuppliers) {
      let orderDetails = [];

      for (const {
        product,
        quantity,
        unitPrice,
        discount,
      } of orderData.details) {
        if (product.owner._id.toString() === supplier) {
          orderDetails.push({
            product: product,
            quantity: quantity,
            unitPrice: unitPrice,
            discount: discount,
          });
        }
      }

      suppliersAndProducts.push({
        supplierId: new Types.ObjectId(supplier),
        details: orderDetails,
      });
    }

    return suppliersAndProducts;
  }

  public async deleteOneOrder(orderId: Types.ObjectId): Promise<Order> {
    const deletedOrder: Order = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) throw new Error("Order doesn't exist");

    return deletedOrder;
  }
}
