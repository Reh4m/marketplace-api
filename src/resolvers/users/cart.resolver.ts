import { Types } from "mongoose";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";

import { User } from "@models/users.model";
import { CartItemInput } from "@schemas/cart.schema";
import { CartService } from "@services/users/cart.service";
import { CartItem } from "@typedefs/cart-item.type";

@Service()
@Authorized()
@Resolver((_of) => CartItem)
export class CartResolver {
  constructor(
    @Inject()
    private readonly cartService: CartService
  ) {}

  @Mutation(() => [CartItem])
  public async addItemToUserCart(
    @Ctx("user") { _id }: User,
    @Arg("productCartDetails") productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const userCart: CartItem[] = await this.cartService.addItemToUserCart(
      _id,
      productCartDetails
    );

    return userCart;
  }

  @Mutation(() => [CartItem])
  public async deleteItemFromUserCart(
    @Ctx("user") { _id }: User,
    @Arg("productId") productId: Types.ObjectId
  ): Promise<CartItem[]> {
    const userCart: CartItem[] = await this.cartService.deleteItemFromUserCart(
      _id,
      productId
    );

    return userCart;
  }

  @Mutation(() => [CartItem])
  public async decreaseProductQuantityFromCart(
    @Ctx("user") { _id }: User,
    @Arg("productCartDetails") productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const userCart: CartItem[] =
      await this.cartService.decreaseItemQuantityFromUserCart(
        _id,
        productCartDetails
      );

    return userCart;
  }
}
