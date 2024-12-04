import {
  Arg,
  Authorized,
  MiddlewareFn,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Types } from "mongoose";

import { OrderService } from "@services/orders.service";
import { OrderModel } from "@models";
import { Order } from "@models/orders.model";
import { CreateOrderInput } from "@schemas/orders.schema";
import { RequestWithUser } from "@typedefs/auth.type";

const allowToReadMiddleware: MiddlewareFn<RequestWithUser> = (
  { context, info },
  next
) => {
  const { _id: currentUserId } = context.user;
  const userId = info.variableValues.userId as Types.ObjectId;

  if (userId.toString() !== currentUserId.toString()) {
    throw new Error("Not authorized");
  }

  return next();
};

const isOwnerMiddleware: MiddlewareFn<RequestWithUser> = async (
  { context, info },
  next
) => {
  const { _id: userId } = context.user;
  const orderId = info.variableValues.orderId as Types.ObjectId;

  const order: Order = await OrderModel.findById(orderId);

  if (order.owner._id.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  return next();
};

@Resolver()
export class OrderResolver extends OrderService {
  @Authorized()
  @UseMiddleware(allowToReadMiddleware)
  @Query(() => [Order])
  public async getUserOrders(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<Order[]> {
    const orders: Order[] = await this.findUserOrders(userId);

    return orders;
  }

  @Authorized()
  @UseMiddleware(allowToReadMiddleware)
  @Query(() => Order)
  public async getOrderById(
    @Arg("orderId") orderId: Types.ObjectId
  ): Promise<Order> {
    const order: Order = await this.findOrderById(orderId);

    return order;
  }

  @Authorized()
  @Mutation(() => Order)
  public async createOrder(
    @Arg("orderData") orderData: CreateOrderInput
  ): Promise<Order> {
    const order: Order = await this.createNewOrder(orderData);

    return order;
  }

  @Authorized("admin")
  @UseMiddleware(isOwnerMiddleware)
  @Mutation(() => Order)
  public async deleteOrder(
    @Arg("orderId") orderId: Types.ObjectId
  ): Promise<Order> {
    const order: Order = await this.deleteOneOrder(orderId);

    return order;
  }
}
