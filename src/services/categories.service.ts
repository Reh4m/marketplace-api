import { Types } from "mongoose";
import { Service } from "typedi";

import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@schemas/categories.schema";
import { CategoryModel } from "@models";
import { Category } from "@models/categories.model";

@Service()
export class CategoryService {
  public async findAllCategories(): Promise<Category[]> {
    const categories: Category[] = await CategoryModel.find();

    return categories;
  }

  public async findCategoryById(categoryId: Types.ObjectId): Promise<Category> {
    const category: Category = await CategoryModel.findById(categoryId);

    if (!category) throw new Error("Category doesn't exist");

    return category;
  }

  public async findCategoryByName(categoryName: string): Promise<Category> {
    const category: Category = await CategoryModel.findOne({
      name: categoryName,
    });

    if (!category) throw new Error("Category doesn't exist");

    return category;
  }

  public async createNewCategory(
    categoryData: CreateCategoryInput
  ): Promise<Category> {
    const findCategory: Category = await CategoryModel.findOne({
      name: categoryData.name,
    });

    if (findCategory)
      throw new Error(`This category ${categoryData.name} already exists`);

    const newCategory: Category = await CategoryModel.create(categoryData);

    return newCategory;
  }

  public async updateOneCategory(
    categoryId: Types.ObjectId,
    categoryData: UpdateCategoryInput
  ): Promise<Category> {
    const findCategory: Category = await CategoryModel.findOne({
      name: categoryData.name,
    });

    if (findCategory)
      throw new Error(`This category ${categoryData.name} already exists`);

    const updatedCategory: Category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { ...categoryData },
      { new: true }
    );

    if (!updatedCategory) throw new Error("Category doesn't exist");

    return updatedCategory;
  }

  public async deleteOneCategory(
    categoryId: Types.ObjectId
  ): Promise<Category> {
    const deletedCategory: Category = await CategoryModel.findByIdAndDelete(
      categoryId
    );

    if (!deletedCategory) throw new Error("Category doesn't exist");

    return deletedCategory;
  }
}
