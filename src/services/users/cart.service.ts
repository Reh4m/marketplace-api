import { Types } from "mongoose";
import { Service } from "typedi";
import { DocumentType } from "@typegoose/typegoose";

import { UserModel, ProductModel } from "@models";
import { User } from "@models/users.model";
import { Product } from "@models/products.model";
import { CartItemInput } from "@schemas/cart.schema";
import { CartItem } from "@typedefs/cart-item.type";
import { compareObjectIds } from "@utils";

const getUserWithCartData = async (
  userId: Types.ObjectId
): Promise<DocumentType<User>> => {
  const user: DocumentType<User> = await UserModel.findById(userId).populate({
    path: "cart.product",
    model: "Product",
  });

  if (!user) throw new Error("User not found");

  return user;
};

/**
 * Operations to manage the user's cart.
 */
@Service()
export class CartService {
  public async addItemToUserCart(
    userId: Types.ObjectId,
    cartItemData: CartItemInput
  ): Promise<CartItem[]> {
    const findProduct: Product = await ProductModel.findById(
      cartItemData.product._id
    );

    if (!findProduct) {
      throw new Error("Product doesn't exist");
    }

    // Prevent user buying his own product
    if (compareObjectIds(findProduct.owner._id, userId)) {
      throw new Error("User cannot buy their own product");
    }

    const user: DocumentType<User> = await getUserWithCartData(userId);

    if (!user.cart || user.cart.length === 0) {
      // First product added to cart
      user.cart.push(cartItemData);
    } else {
      // If has products in cart, prevent duplicates
      const existingItem = user.cart.find((item) =>
        compareObjectIds(item.product._id, cartItemData.product._id)
      );

      if (existingItem) {
        existingItem.quantity += cartItemData.quantity;
      } else {
        user.cart.push(cartItemData);
      }
    }

    await user.save();

    const updatedUser: User = await getUserWithCartData(userId);

    return updatedUser.cart;
  }

  public async deleteItemFromUserCart(
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ): Promise<CartItem[]> {
    const user: DocumentType<User> = await getUserWithCartData(userId);

    const productIndex = user.cart.findIndex((item) =>
      compareObjectIds(item.product._id, productId)
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    user.cart.splice(productIndex, 1);

    await user.save();

    const updatedUser: User = await getUserWithCartData(userId);

    return updatedUser.cart;
  }

  public async decreaseItemQuantityFromUserCart(
    userId: Types.ObjectId,
    cartItemData: CartItemInput
  ): Promise<CartItem[]> {
    const user: DocumentType<User> = await getUserWithCartData(userId);

    const productFromCart = user.cart.find((item) =>
      compareObjectIds(item.product._id, cartItemData.product._id)
    );

    if (!productFromCart) {
      throw new Error("Product not found in cart");
    }

    const itemQuantityAfterDecrease: number =
      productFromCart.quantity - cartItemData.quantity;

    if (itemQuantityAfterDecrease <= 0) {
      return await this.deleteItemFromUserCart(
        userId,
        cartItemData.product._id
      );
    }

    productFromCart.quantity -= cartItemData.quantity;

    await user.save();

    const updatedUser: User = await getUserWithCartData(userId);

    return updatedUser.cart;
  }
}
