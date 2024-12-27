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

import { SaleService } from "@services/sales.service";
import { SaleModel } from "@models";
import { Sale } from "@models/sales.model";
import { CreateSaleInput, UpdateSaleStatusInput } from "@schemas/sales.schema";
import { RequestWithUser } from "@typedefs/auth.type";
import { Inject, Service } from "typedi";

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
  const saleId = info.variableValues.saleId as Types.ObjectId;

  const sale: Sale = await SaleModel.findById(saleId);

  if (sale.owner._id.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  return next();
};

@Service()
@Resolver((_of) => Sale)
export class SaleResolver {
  constructor(
    @Inject()
    private readonly saleService: SaleService
  ) {}

  @Authorized()
  @UseMiddleware(allowToReadMiddleware)
  @Query(() => [Sale])
  public async getUserSales(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<Sale[]> {
    const sales: Sale[] = await this.saleService.findUserSales(userId);

    return sales;
  }

  @Authorized()
  // @UseMiddleware(allowToReadMiddleware)
  @Query(() => Sale)
  public async getSaleById(
    @Arg("saleId") saleId: Types.ObjectId
  ): Promise<Sale> {
    const sale: Sale = await this.saleService.findSaleById(saleId);

    return sale;
  }

  @Authorized()
  @Mutation(() => Sale)
  public async createSale(
    @Arg("saleData") saleData: CreateSaleInput
  ): Promise<Sale> {
    const sale: Sale = await this.saleService.createNewSale(saleData);

    return sale;
  }

  @Authorized()
  @UseMiddleware(isOwnerMiddleware)
  @Mutation(() => Sale)
  public async updateSaleStatus(
    @Arg("saleId") saleId: Types.ObjectId,
    @Arg("status") status: UpdateSaleStatusInput
  ): Promise<Sale> {
    const sale: Sale = await this.saleService.updateSaleStatus(saleId, status);

    return sale;
  }

  @Authorized("admin")
  @UseMiddleware(isOwnerMiddleware)
  @Mutation(() => Sale)
  public async deleteSale(
    @Arg("saleId") saleId: Types.ObjectId
  ): Promise<Sale> {
    const sale: Sale = await this.saleService.deleteOneSale(saleId);

    return sale;
  }
}
