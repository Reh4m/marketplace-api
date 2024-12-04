import {
  Arg,
  Authorized,
  Ctx,
  MiddlewareFn,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Types } from "mongoose";

import { UserService } from "@services/users.service";
import { User } from "@models/users.model";
import { CreateUserInput, UpdateUserInput } from "@schemas/users.schema";
import { CartItemInput } from "@schemas/cart.schema";
import { AddressInput } from "@schemas/addresses.schema";
import { RequestWithUser } from "@typedefs/auth.type";
import { CartItem } from "@typedefs/cart-item.type";

const IsOwnerMiddleware: MiddlewareFn<RequestWithUser> = (
  { context, info },
  next
) => {
  const { _id: currentUserId } = context.user;
  const userId = info.variableValues.userId as Types.ObjectId;

  if (userId.toString() !== currentUserId.toString()) {
    throw new Error("Not authorized");
  }

  return next();
};

@Resolver()
export class UserResolver extends UserService {
  @Authorized()
  @Query(() => User, { nullable: true })
  public async getCurrentUser(@Ctx("user") currentUser: User): Promise<User> {
    if (!currentUser) return null;

    return currentUser;
  }

  @Authorized("admin")
  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    const users: User[] = await this.findAllUsers();

    return users;
  }

  @Query(() => User)
  public async getUserById(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<User> {
    const user: User = await this.findUserById(userId);

    return user;
  }

  @Mutation(() => User)
  public async createUser(
    @Arg("userData") userData: CreateUserInput
  ): Promise<User> {
    const user: User = await this.createNewUser(userData);

    return user;
  }

  @Authorized("user", "admin")
  @UseMiddleware(IsOwnerMiddleware)
  @Mutation(() => User)
  public async updateUser(
    @Arg("userId") userId: Types.ObjectId,
    @Arg("userData") userData: UpdateUserInput
  ): Promise<User> {
    const user: User = await this.updateOneUser(userId, userData);

    return user;
  }

  @Authorized("admin")
  @Mutation(() => User)
  public async deleteUser(
    @Arg("userId") userId: Types.ObjectId
  ): Promise<User> {
    const user: User = await this.deleteOneUser(userId);

    return user;
  }

  @Authorized()
  @Mutation(() => [CartItem])
  public async addProductToCart(
    @Arg("userId") userId: Types.ObjectId,
    @Arg("productCartDetails") productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const userCart: CartItem[] = await this.addProductToUserCart(
      userId,
      productCartDetails
    );

    return userCart;
  }

  @Authorized()
  @Mutation(() => [CartItem])
  public async decreaseProductQuantityFromCart(
    @Arg("userId") userId: Types.ObjectId,
    @Arg("productCartDetails") productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const userCart: CartItem[] =
      await this.decreaseProductQuantityFromUserCart(
        userId,
        productCartDetails
      );

    return userCart;
  }

  @Authorized()
  @Mutation(() => [CartItem])
  public async deleteProductFromCart(
    @Arg("userId") userId: Types.ObjectId,
    @Arg("productId") productId: Types.ObjectId
  ): Promise<CartItem[]> {
    const userCart: CartItem[] = await this.deleteProductFromUserCart(
      userId,
      productId
    );

    return userCart;
  }

  @Authorized()
  @Mutation(() => User)
  public async addUserAddress(
    @Arg("userId") userId: Types.ObjectId,
    @Arg("userAddressDetails") userAddressDetails: AddressInput
  ): Promise<User> {
    const updatedUser: User = await this.addNewUserAddress(
      userId,
      userAddressDetails
    );

    return updatedUser;
  }
}
