import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";

import { CategoryService } from "@services/categories.service";
import { Category } from "@models/categories.model";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@schemas/categories.schema";

@Service()
@Resolver((_of) => Category)
export class CategoryResolver {
  constructor(
    @Inject()
    private readonly categoryService: CategoryService
  ) {}

  @Query(() => [Category])
  public async getCategories(): Promise<Category[]> {
    const categories: Category[] =
      await this.categoryService.findAllCategories();

    return categories;
  }

  @Query(() => Category)
  public async getCategoryById(
    @Arg("categoryId") categoryId: Types.ObjectId
  ): Promise<Category> {
    const category: Category = await this.categoryService.findCategoryById(
      categoryId
    );

    return category;
  }

  @Query(() => Category)
  public async getCategoryByName(
    @Arg("categoryName") categoryName: string
  ): Promise<Category> {
    const category: Category = await this.categoryService.findCategoryByName(
      categoryName
    );

    return category;
  }

  @Authorized("admin")
  @Mutation(() => Category)
  public async createCategory(
    @Arg("categoryData") categoryData: CreateCategoryInput
  ): Promise<Category> {
    const category: Category = await this.categoryService.createNewCategory(
      categoryData
    );

    return category;
  }

  @Authorized("admin")
  @Mutation(() => Category)
  public async updateCategory(
    @Arg("categoryId") categoryId: Types.ObjectId,
    @Arg("categoryData") categoryData: UpdateCategoryInput
  ): Promise<Category> {
    const category: Category = await this.categoryService.updateOneCategory(
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
    const category: Category = await this.categoryService.deleteOneCategory(
      categoryId
    );

    return category;
  }
}
