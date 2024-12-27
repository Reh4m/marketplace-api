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

import { SaleService } from "@services/sales.service";
import { SaleModel } from "@models";
import { Sale } from "@models/sales.model";
import { User } from "@models/users.model";
import { CreateSaleInput, UpdateSaleStatusInput } from "@schemas/sales.schema";
import { RequestWithUser } from "@typedefs/auth.type";
import { compareObjectIds } from "@utils";

const isOwnerMiddleware: MiddlewareFn<RequestWithUser> = async (
  { context, info },
  next
) => {
  const { _id: userId } = context.user;
  const saleId = info.variableValues.saleId as Types.ObjectId;

  const sale: Sale = await SaleModel.findById(saleId);

  if (!compareObjectIds(sale.owner._id, userId)) {
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
  @Query(() => [Sale])
  public async getUserSales(
    @Ctx("user") { _id: userId }: User
  ): Promise<Sale[]> {
    const sales: Sale[] = await this.saleService.findUserSales(userId);

    return sales;
  }

  @Authorized()
  @UseMiddleware(isOwnerMiddleware)
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
