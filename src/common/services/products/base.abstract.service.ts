import { BaseServiceInterface } from "../base.interface.service";
import {
  FilterQuery,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { Product } from "@/models/products.model";
import { FilterProductsInput } from "@/schemas/filter.schema";
import { GetProductsArgs } from "@/schemas/pagination.schema";
import { InfiniteScrollProducts } from "@/typedefs/products.type";
import { ProductModel } from "@/models";

export abstract class ProductBaseService
  implements BaseServiceInterface<Product>
{
  protected buildFilters(filter: FilterProductsInput): FilterQuery<Product> {
    const filters: FilterQuery<Product> = {};

    if (filter.priceRange) {
      filters.price = {
        $gte: filter.priceRange.min,
        $lte: filter.priceRange.max,
      };
    }

    if (filter.category) {
      filters.category = filter.category;
    }

    if (filter.condition) {
      filters.condition = { $in: filter.condition };
    }

    return filters;
  }

  protected async findMany(
    condition: FilterQuery<Product>,
    { take, sort, filter, skips, totalItemsToSkip }: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    const filters: FilterQuery<Product> = {
      ...condition,
      ...this.buildFilters(filter),
    };

    const products: Product[] = await ProductModel.find(filters)
      .populate({
        path: "owner",
        model: "User",
      })
      .populate({
        path: "category",
        model: "Category",
      })
      .sort({ [sort.by]: sort.order })
      .skip(skips)
      .limit(take);

    const totalDocs = await ProductModel.find(filters).countDocuments();
    const hasMore = totalDocs > totalItemsToSkip;

    return { products, hasMore };
  }
}
