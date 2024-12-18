import { Types } from "mongoose";
import { Service } from "typedi";
import { DocumentType } from "@typegoose/typegoose";

import { UserModel } from "@models";
import { User } from "@models/users.model";
import { AddressInput } from "@schemas/addresses.schema";

const findUserById = async (
  userId: Types.ObjectId
): Promise<DocumentType<User>> => {
  const user: DocumentType<User> = await UserModel.findById(userId);

  if (!user) throw new Error("User doesn't exist");

  return user;
};

const validateAddressIndex = (user: User, addressIndex: number): void => {
  if (addressIndex < 0 || addressIndex >= user.addresses.length) {
    throw new Error("Address index out of bounds");
  }
};

/**
 * Operations to manage the user's address list.
 */
@Service()
export class AddressService {
  public async addUserAddress(
    userId: Types.ObjectId,
    addressDetails: AddressInput
  ): Promise<User> {
    const user: DocumentType<User> = await findUserById(userId);

    user.addresses.push(addressDetails);

    await user.save();

    const updatedUser: User = await UserModel.findById(user._id);

    return updatedUser;
  }

  public async updateUserAddress(
    userId: Types.ObjectId,
    addressDetails: AddressInput,
    addressIndex: number
  ): Promise<User> {
    const user: DocumentType<User> = await findUserById(userId);

    validateAddressIndex(user, addressIndex);

    user.addresses[addressIndex] = addressDetails;

    await user.save();

    const updatedUser: User = await UserModel.findById(userId);

    return updatedUser;
  }

  public async deleteUserAddress(
    userId: Types.ObjectId,
    addressIndex: number
  ): Promise<User> {
    const user: DocumentType<User> = await findUserById(userId);

    validateAddressIndex(user, addressIndex);

    user.addresses.splice(addressIndex, 1);

    await user.save();

    const updatedUser: User = await UserModel.findById(userId);

    return updatedUser;
  }
}
