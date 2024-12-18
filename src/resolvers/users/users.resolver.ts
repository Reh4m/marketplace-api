import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";

import { UserService } from "@services/users/users.service";
import { User } from "@models/users.model";
import { CreateUserInput, UpdateUserInput } from "@schemas/users.schema";

@Service()
@Resolver((_of) => User)
export class UserResolver {
  constructor(
    @Inject()
    private readonly userService: UserService
  ) {}

  @Authorized()
  @Query(() => User)
  public async getCurrentUser(@Ctx("user") currentUser: User): Promise<User> {
    if (!currentUser) return null;

    return currentUser;
  }

  @Authorized("admin")
  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    const users: User[] = await this.userService.getUsers();

    return users;
  }

  @Query(() => User)
  public async getUserById(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<User> {
    const user: User = await this.userService.getUserById(userId);

    return user;
  }

  @Mutation(() => User)
  public async createUser(
    @Arg("userData") userData: CreateUserInput
  ): Promise<User> {
    const user: User = await this.userService.createUser(userData);

    return user;
  }

  @Authorized()
  @Mutation(() => User)
  public async updateUser(
    @Ctx("user") { _id }: User,
    @Arg("userData") userData: UpdateUserInput
  ): Promise<User> {
    const user: User = await this.userService.updateUser(_id, userData);

    return user;
  }

  @Authorized("admin")
  @Mutation(() => User)
  public async deleteUser(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<User> {
    const user: User = await this.userService.deleteUser(userId);

    return user;
  }
}
