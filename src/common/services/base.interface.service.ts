import {
  FilterQuery,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Types,
} from "mongoose";

export interface Read<T> {
  findMany(filter?: FilterQuery<T>, options?: object): Promise<object>;

  findManyByCondition(_id: Types.ObjectId, options?: object): Promise<object>;

  findOneById(_id: Types.ObjectId): Promise<T>;

  findOneByCondition(
    filter: FilterQuery<T>,
    options: QueryOptions<T>,
    populate?: PopulateOptions | PopulateOptions[]
  ): Promise<T>;
}

export interface Write<T> {
  create(item: object): Promise<T>;
  update(_id: Types.ObjectId, item: object): Promise<T>;
  delete(_id: Types.ObjectId): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
