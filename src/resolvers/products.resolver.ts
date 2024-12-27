import {
  Arg,
  Args,
  Authorized,
  MiddlewareFn,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";

import { ProductService } from "@services/products.service";
import { ProductModel } from "@models";
import { Product } from "@models/products.model";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@schemas/products.schema";
import { GetProductsArgs } from "@schemas/pagination.schema";
import { RequestWithUser } from "@typedefs/auth.type";
import { InfiniteScrollProducts } from "@typedefs/products.type";
import { compareObjectIds } from "@utils";

/**
 * Checks if the current user is the owner of the product to be modified.
 */
const IsOwnerMiddleware: MiddlewareFn<RequestWithUser> = async (
  { context, info },
  next
) => {
  const { _id: userId } = context.user;
  const productId = info.variableValues.productId as Types.ObjectId;

  const product: Product = await ProductModel.findById(productId);

  if (!compareObjectIds(product.owner._id, userId)) {
    throw new Error("Not authorized");
  }

  return next();
};

@Service()
@Resolver((_of) => Product)
export class ProductResolver {
  constructor(
    @Inject()
    private readonly productService: ProductService
  ) {}

  @Query(() => InfiniteScrollProducts)
  public async getProducts(
    @Args() options: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    const { products, hasMore } = await this.productService.findAllProducts(
      options
    );

    return { products, hasMore };
  }

  @Query(() => Product)
  public async getProductById(
    @Arg("productId") productId: Types.ObjectId
  ): Promise<Product> {
    const product: Product = await this.productService.findProductById(
      productId
    );

    return product;
  }

  @Query(() => [Product])
  public async getProductsByCategory(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] =
      await this.productService.findProductsByCategory(categoryId);

    return products;
  }

  @Query(() => [Product])
  public async getRelatedProducts(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] = await this.productService.findRelatedProducts(
      categoryId
    );

    return products;
  }

  @Query(() => [Product])
  public async getProductsByUserId(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<Product[]> {
    const products: Product[] = await this.productService.findProductsByOwner(
      userId
    );

    return products;
  }

  @Authorized()
  @Mutation(() => Product)
  public async createProduct(
    @Arg("productData") productData: CreateProductInput
  ): Promise<Product> {
    const product: Product = await this.productService.createNewProduct(
      productData
    );

    return product;
  }

  @Authorized()
  @UseMiddleware(IsOwnerMiddleware)
  @Mutation(() => Product)
  public async updateProduct(
    @Arg("productId") productId: Types.ObjectId,
    @Arg("productData") productData: UpdateProductInput
  ): Promise<Product> {
    const product: Product = await this.productService.updateOneProduct(
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
    const product: Product = await this.productService.deleteOneProduct(
      productId
    );

    return product;
  }
}
