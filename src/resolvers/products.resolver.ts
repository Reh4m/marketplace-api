import {
  Arg,
  Authorized,
  Int,
  MiddlewareFn,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Types } from "mongoose";

import { ProductService } from "@services/products.service";
import { ProductModel } from "@models";
import { Product } from "@models/products.model";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@schemas/products.schema";
import { SortInput } from "@schemas/sort.schema";
import { FilterInput } from "@schemas/filter.schema";
import { RequestWithUser } from "@typedefs/auth.type";
import { InfiniteScrollProducts } from "@typedefs/products.type";

const IsOwnerMiddleware: MiddlewareFn<RequestWithUser> = async (
  { context, info },
  next
) => {
  const { _id: userId } = context.user;
  const productId = info.variableValues.productId as Types.ObjectId;

  const product: Product = await ProductModel.findById(productId);

  if (product.owner._id.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  return next();
};

@Resolver()
export class ProductResolver extends ProductService {
  @Query(() => InfiniteScrollProducts)
  public async getProducts(
    @Arg("pageNum", () => Int) pageNum: number,
    @Arg("pageSize", () => Int) pageSize: number,
    @Arg("sort") sort: SortInput,
    @Arg("filter", { nullable: true }) filter?: FilterInput
  ): Promise<InfiniteScrollProducts> {
    const { products, hasMore } = await this.findAllProducts(
      pageNum,
      pageSize,
      sort,
      filter
    );

    return { products, hasMore };
  }

  @Query(() => Product)
  public async getProductById(
    @Arg("productId") productId: Types.ObjectId
  ): Promise<Product> {
    const product: Product = await this.findProductById(productId);

    return product;
  }

  @Query(() => [Product])
  public async getProductsByCategory(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] = await this.findProductsByCategory(categoryId);

    return products;
  }

  @Query(() => [Product])
  public async getRelatedProducts(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] = await this.findRelatedProducts(categoryId);

    return products;
  }

  @Query(() => [Product])
  public async getProductsByUserId(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] = await this.findProductsByOwner(userId);

    return products;
  }

  @Authorized()
  @Mutation(() => Product)
  public async createProduct(
    @Arg("productData") productData: CreateProductInput
  ): Promise<Product> {
    const product: Product = await this.createNewProduct(productData);

    return product;
  }

  @Authorized()
  @UseMiddleware(IsOwnerMiddleware)
  @Mutation(() => Product)
  public async updateProduct(
    @Arg("productId") productId: Types.ObjectId,
    @Arg("productData") productData: UpdateProductInput
  ): Promise<Product> {
    const product: Product = await this.updateOneProduct(
      productId,
      productData
    );

    return product;
  }

  @Authorized()
  @UseMiddleware(IsOwnerMiddleware)
  @Mutation(() => Product)
  public async deleteProduct(
    @Arg("productId") productId: Types.ObjectId
  ): Promise<Product> {
    const product: Product = await this.deleteOneProduct(productId);

    return product;
  }
}
