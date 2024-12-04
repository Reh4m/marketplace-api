import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Types } from "mongoose";

import { CategoryService } from "@services/categories.service";
import { Category } from "@models/categories.model";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@schemas/categories.schema";

@Resolver()
export class CategoryResolver extends CategoryService {
  @Query(() => [Category])
  public async getCategories(): Promise<Category[]> {
    const categories: Category[] = await this.findAllCategories();

    return categories;
  }

  @Query(() => Category)
  public async getCategoryById(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Category> {
    const category: Category = await this.findCategoryById(categoryId);

    return category;
  }

  @Query(() => Category)
  public async getCategoryByName(
    @Arg("categoryName") categoryName: string
  ): Promise<Category> {
    const category: Category = await this.findCategoryByName(categoryName);

    return category;
  }

  @Authorized("admin")
  @Mutation(() => Category)
  public async createCategory(
    @Arg("categoryData") categoryData: CreateCategoryInput
  ): Promise<Category> {
    const category: Category = await this.createNewCategory(categoryData);

    return category;
  }

  @Authorized("admin")
  @Mutation(() => Category)
  public async updateCategory(
    @Arg("categoryId") categoryId: Types.ObjectId,
    @Arg("categoryData") categoryData: UpdateCategoryInput
  ): Promise<Category> {
    const category: Category = await this.updateOneCategory(
      categoryId,
      categoryData
    );

    return category;
  }

  @Authorized("admin")
  @Mutation(() => Category)
  public async deleteCategory(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Category> {
    const category: Category = await this.deleteOneCategory(categoryId);

    return category;
  }
}
