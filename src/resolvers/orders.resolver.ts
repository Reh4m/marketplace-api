import {
  Arg,
  Authorized,
  Ctx,
  MiddlewareFn,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";

import { OrderService } from "@services/orders.service";
import { OrderModel } from "@models";
import { Order } from "@models/orders.model";
import { User } from "@models/users.model";
import { CreateOrderInput } from "@schemas/orders.schema";
import { RequestWithUser } from "@typedefs/auth.type";

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

@Service()
@Resolver((_of) => Order)
export class OrderResolver {
  constructor(
    @Inject()
    private readonly orderService: OrderService
  ) {}

  @Authorized()
  @Query(() => [Order])
  public async getUserOrders(
    @Ctx("user") { _id: userId }: User
  ): Promise<Order[]> {
    const orders: Order[] = await this.orderService.findUserOrders(userId);

    return orders;
  }

  @Authorized()
  @Query(() => Order)
  public async getOrderById(
    @Arg("orderId") orderId: Types.ObjectId
  ): Promise<Order> {
    const order: Order = await this.orderService.findOrderById(orderId);

    return order;
  }

  @Authorized()
  @Mutation(() => Order)
  public async createOrder(
    @Arg("orderData") orderData: CreateOrderInput
  ): Promise<Order> {
    const order: Order = await this.orderService.createNewOrder(orderData);

    return order;
  }

  @Authorized("admin")
  @UseMiddleware(isOwnerMiddleware)
  @Mutation(() => Order)
  public async deleteOrder(
    @Arg("orderId") orderId: Types.ObjectId
  ): Promise<Order> {
    const order: Order = await this.orderService.deleteOneOrder(orderId);

    return order;
  }
}
