import { hash } from "bcrypt";
import { Types } from "mongoose";
import { Service } from "typedi";

import { UserModel, ProductModel } from "@/models";
import { User } from "@models/users.model";
import { Product } from "@models/products.model";
import { CreateUserInput, UpdateUserInput } from "@schemas/users.schema";
import { CartItemInput } from "@schemas/cart.schema";
import { AddressInput } from "@schemas/addresses.schema";
import { DocumentType } from "@typegoose/typegoose";
import { CartItem } from "@typedefs/cart-item.type";

@Service()
export class UserService {
  public async findAllUsers(): Promise<User[]> {
    const users: User[] = await UserModel.find();

    return users;
  }

  public async findUserById(userId: Types.ObjectId): Promise<User> {
    const user: User = await UserModel.findById(userId);

    if (!user) throw new Error("User doesn't exist");

    return user;
  }

  public async createNewUser(userData: CreateUserInput): Promise<User> {
    const findUser: User = await UserModel.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (findUser) {
      if (findUser.username === userData.username)
        throw new Error(`This username ${userData.username} already exists`);

      if (findUser.email === userData.email)
        throw new Error(`This email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);

    const newUser: User = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  public async updateOneUser(
    userId: Types.ObjectId,
    userData: UpdateUserInput
  ): Promise<User> {
    if (userData.username || userData.email) {
      const findUser: User = await UserModel.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });

      if (findUser && findUser._id !== userId) {
        if (findUser.username === userData.username) {
          throw new Error(`This username ${userData.username} already exists`);
        }
        if (findUser.email === userData.email) {
          throw new Error(`This email ${userData.email} already exists`);
        }
      }
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);

      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser: User = await UserModel.findByIdAndUpdate(
      userId,
      { ...userData },
      { new: true }
    );

    if (!updatedUser) throw new Error("User doesn't exist");

    return updatedUser;
  }

  public async deleteOneUser(userId: Types.ObjectId): Promise<User> {
    const deletedUser: User = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) throw new Error("User doesn't exist");

    return deletedUser;
  }

  public async addProductToUserCart(
    userId: Types.ObjectId,
    productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const findProduct: Product = await ProductModel.findById(
      productCartDetails.product._id
    );

    if (!findProduct) {
      throw new Error("Product not found");
    }

    // Prevent user buying his own product
    if (findProduct.owner._id.toString() === userId.toString()) {
      throw new Error("User buying his own product");
    }

    const findUser: DocumentType<User> = await UserModel.findById(
      userId
    ).populate({
      path: "cart.product",
      model: "Product",
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    if (!findUser.cart) {
      findUser.cart = [];
      // First product added to cart
      findUser.cart.push(productCartDetails);
    } else {
      // Has products in cart, prevent duplicates
      const existingItem = findUser.cart.find(
        (item) =>
          item.product._id.toString() ===
          productCartDetails.product._id.toString()
      );

      if (existingItem) {
        existingItem.quantity += productCartDetails.quantity;
      } else {
        findUser.cart.push(productCartDetails);
      }
    }

    await findUser.save();

    const updatedUser: User = await UserModel.findById(findUser._id).populate({
      path: "cart.product",
      model: "Product",
    });

    return updatedUser.cart;
  }

  public async deleteProductFromUserCart(
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ): Promise<CartItem[]> {
    const findUser: DocumentType<User> = await UserModel.findById(
      userId
    ).populate({
      path: "cart.product",
      model: "Product",
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    const productIndex = findUser.cart.findIndex(
      (item) => item.product._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    findUser.cart.splice(productIndex, 1);

    await findUser.save();

    const updatedUser: User = await UserModel.findById(findUser._id).populate({
      path: "cart.product",
      model: "Product",
    });

    return updatedUser.cart;
  }

  public async decreaseProductQuantityFromUserCart(
    userId: Types.ObjectId,
    productCartDetails: CartItemInput
  ): Promise<CartItem[]> {
    const findUser: DocumentType<User> = await UserModel.findById(
      userId
    ).populate({
      path: "cart.product",
      model: "Product",
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    const productFromCart = findUser.cart.find(
      (item) =>
        item.product._id.toString() ===
        productCartDetails.product._id.toString()
    );

    const productQuantityAfterDecrease: number =
      productFromCart.quantity - productCartDetails.quantity;

    if (productQuantityAfterDecrease <= 0) {
      const deletedProductDetails = await this.deleteProductFromUserCart(
        userId,
        productCartDetails.product._id
      );

      return deletedProductDetails;
    }

    productFromCart.quantity -= productCartDetails.quantity;

    await findUser.save();

    const updatedUser: User = await UserModel.findById(findUser._id).populate({
      path: "cart.product",
      model: "Product",
    });

    return updatedUser.cart;
  }

  public async addNewUserAddress(
    userId: Types.ObjectId,
    userAddressDetails: AddressInput
  ): Promise<User> {
    const findUser: DocumentType<User> = await UserModel.findById(userId);

    if (!findUser) {
      throw new Error("User not found");
    }

    if (!findUser.addresses) {
      findUser.addresses = [];

      findUser.addresses.push(userAddressDetails);
    } else {
      findUser.addresses.push(userAddressDetails);
    }

    await findUser.save();

    const updatedUser: User = await UserModel.findById(findUser._id);

    return updatedUser;
  }
}
