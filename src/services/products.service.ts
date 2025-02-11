import { FilterQuery, Types } from "mongoose";
import { Service } from "typedi";

import {
  CreateProductInput,
  UpdateProductInput,
} from "@schemas/products.schema";
import { GetProductsArgs } from "@schemas/pagination.schema";
import { CategoryModel, ProductModel, UserModel } from "@models";
import { Product, Status } from "@models/products.model";
import { Category } from "@models/categories.model";
import { User } from "@models/users.model";
import { InfiniteScrollProducts } from "@typedefs/products.type";

@Service()
export class ProductService {
  private readonly DEFAULT_PRODUCT_FILTER: FilterQuery<Product> = {
    status: { $in: [Status.AVAILABLE, Status.ON_PROMOTION] },
  };

  private async findProducts(
    filters: FilterQuery<Product>,
    { take, sort, filter, skips, totalItemsToSkip }: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    if (filter) {
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
    }

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

  public async findAllProducts(
    options: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    const filters: FilterQuery<Product> = { ...this.DEFAULT_PRODUCT_FILTER };

    const { products, hasMore } = await this.findProducts(filters, options);

    return { products, hasMore };
  }

  public async findProductById(productId: Types.ObjectId): Promise<Product> {
    const product: Product = await ProductModel.findById(productId)
      .populate({
        path: "owner",
        model: "User",
      })
      .populate({
        path: "category",
        model: "Category",
      });

    if (!product) throw new Error("Product doesn't exist");

    return product;
  }

  public async findProductsByCategory(
    categoryId: Types.ObjectId,
    options: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    const findCategory: Category = await CategoryModel.findById(categoryId);

    if (!findCategory) throw new Error("Category does't exists");

    const filters: FilterQuery<Product> = {
      ...this.DEFAULT_PRODUCT_FILTER,
      category: categoryId,
    };

    const { products, hasMore } = await this.findProducts(filters, options);

    return { products, hasMore };
  }

  public async findRelatedProducts(
    categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const findCategory: Category = await CategoryModel.findById(categoryId);

    if (!findCategory) throw new Error("Category does't exists");

    const products: Product[] = await ProductModel.find({
      category: categoryId,
    })
      .sort({ createdAt: "desc" })
      .limit(5);

    return products;
  }

  public async findProductsByOwner(
    userId: Types.ObjectId,
    options: GetProductsArgs
  ): Promise<InfiniteScrollProducts> {
    const findUser: User = await UserModel.findById(userId);

    if (!findUser) throw new Error("User doesn't exists");

    const filters: FilterQuery<Product> = {
      ...this.DEFAULT_PRODUCT_FILTER,
      owner: userId,
    };

    const { products, hasMore } = await this.findProducts(filters, options);

    return { products, hasMore };
  }

  public async createNewProduct(
    productData: CreateProductInput
  ): Promise<Product> {
    const findUser: User = await UserModel.findById(productData.owner);

    if (!findUser) throw new Error("User doesn't exists");

    const findCategory: Category = await CategoryModel.findById(
      productData.category
    );

    if (!findCategory) throw new Error("Category doesn't exists");

    const newProduct: Product = await ProductModel.create(productData);

    return newProduct;
  }

  public async updateOneProduct(
    productId: Types.ObjectId,
    productData: UpdateProductInput
  ): Promise<Product> {
    const updatedProduct: Product = await ProductModel.findByIdAndUpdate(
      productId,
      { ...productData },
      { new: true }
    ).populate({
      path: "category",
      model: "Category",
    });

    if (!updatedProduct) throw new Error("Product doesn't exist");

    return updatedProduct;
  }

  public async deleteOneProduct(productId: Types.ObjectId): Promise<Product> {
    const deletedProduct: Product = await ProductModel.findByIdAndDelete(
      productId
    );

    if (!deletedProduct) throw new Error("Product doesn't exist");

    return deletedProduct;
  }
}
