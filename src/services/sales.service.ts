import { Types } from "mongoose";
import { Service } from "typedi";

import { SaleModel } from "@/models";
import { Sale } from "@models/sales.model";
import { CreateSaleInput, UpdateSaleStatusInput } from "@schemas/sales.schema";

@Service()
export class SaleService {
  public async findUserSales(userId: Types.ObjectId): Promise<Sale[]> {
    const sales: Sale[] = await SaleModel.find({ owner: userId })
      .populate({
        path: "customer",
        model: "User",
      })
      .populate({
        path: "order",
        model: "Order",
      });

    return sales;
  }

  public async findSaleById(saleId: Types.ObjectId): Promise<Sale> {
    const sale: Sale = await SaleModel.findById(saleId)
      .populate({
        path: "customer",
        model: "User",
      })
      .populate({
        path: "order",
        model: "Order",
      });

    if (!sale) throw new Error("Sale doesn't exists");

    return sale;
  }

  public async createNewSale(saleData: CreateSaleInput): Promise<Sale> {
    const newSale: Sale = await SaleModel.create(saleData);

    return newSale;
  }

  public async updateSaleStatus(
    saleId: Types.ObjectId,
    status: UpdateSaleStatusInput
  ): Promise<Sale> {
    const updatedSale: Sale = await SaleModel.findByIdAndUpdate(
      saleId,
      {
        status,
      },
      { new: true }
    );

    if (!updatedSale) throw new Error("Sale doesn't exists");

    return updatedSale;
  }

  public async deleteOneSale(saleId: Types.ObjectId): Promise<Sale> {
    const deletedSale: Sale = await SaleModel.findByIdAndDelete(saleId);

    if (!deletedSale) throw new Error("Sale doesn't exists");

    return deletedSale;
  }
}
