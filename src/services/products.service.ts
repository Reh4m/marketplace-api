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
  public async findAllProducts({
    take,
    skip,
    sort,
    filter,
    skips,
  }: GetProductsArgs): Promise<InfiniteScrollProducts> {
    let products: Product[];

    const query: FilterQuery<Product> = {};

    query.status = { $in: [Status.AVAILABLE, Status.ON_PROMOTION] };

    if (filter) {
      if (filter.priceRange) {
        query.price = {
          $gte: filter.priceRange.min,
          $lte: filter.priceRange.max,
        };
      }
      if (filter.category) {
        query.category = filter.category;
      }
      if (filter.condition) {
        query.condition = { $in: filter.condition };
      }
    }

    if (skip === 0) {
      products = await ProductModel.find(query)
        .populate({
          path: "owner",
          model: "User",
        })
        .populate({
          path: "category",
          model: "Category",
        })
        .sort({ [sort.by as string]: sort.order as any })
        .limit(take);
    } else {
      products = await ProductModel.find(query)
        .populate({
          path: "owner",
          model: "User",
        })
        .populate({
          path: "category",
          model: "Category",
        })
        .sort({ [sort.by as string]: sort.order as any })
        .skip(skips)
        .limit(take);
    }

    const totalDocs = await ProductModel.countDocuments();
    const hasMore = totalDocs > skips;

    return { products, hasMore };
  }

  public async findProductById(productId: Types.ObjectId): Promise<Product> {
    const product: Product = await ProductModel.findById(productId.toString())
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
    categoryId: Types.ObjectId
  ): Promise<Product[]> {
    const findCategory: Category = await CategoryModel.findById(categoryId);

    if (!findCategory) throw new Error("Category does't exists");

    const products: Product[] = await ProductModel.find({
      category: categoryId,
    }).populate({
      path: "category",
      model: "Category",
    });

    return products;
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

  public async findProductsByOwner(userId: Types.ObjectId): Promise<Product[]> {
    const findUser: User = await UserModel.findById(userId);

    if (!findUser) throw new Error("User doesn't exists");

    const products: Product[] = await ProductModel.find({ owner: userId })
      .populate({
        path: "category",
        model: "Category",
      })
      .sort({ createdAt: "desc" });

    return products;
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
