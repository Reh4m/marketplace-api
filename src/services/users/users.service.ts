import { Types } from "mongoose";
import { hash } from "bcrypt";
import { Service } from "typedi";

import {
  checkIfEmailExists,
  checkIfUsernameExists,
} from "@helpers/users.helper";
import { UserModel } from "@models";
import { User } from "@models/users.model";
import { CreateUserInput, UpdateUserInput } from "@schemas/users.schema";

/**
 * CRUD operations for user model.
 */
@Service()
export class UserService {
  public async getUsers(): Promise<User[]> {
    const users: User[] = await UserModel.find();

    return users;
  }

  public async getUserById(userId: Types.ObjectId): Promise<User> {
    const user: User = await UserModel.findById(userId);

    if (!user) throw new Error("User doesn't exist");

    return user;
  }

  public async createUser(userData: CreateUserInput): Promise<User> {
    if (await checkIfUsernameExists(userData.username)) {
      throw new Error(`This username ${userData.username} already exists`);
    }

    if (await checkIfEmailExists(userData.email)) {
      throw new Error(`This email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);

    const newUser: User = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  public async updateUser(
    userId: Types.ObjectId,
    userData: UpdateUserInput
  ): Promise<User> {
    if (userData.username) {
      if (await checkIfUsernameExists(userData.username, userId)) {
        throw new Error(`This username ${userData.username} already exists`);
      }
    }

    if (userData.email) {
      if (await checkIfEmailExists(userData.email, userId)) {
        throw new Error(`This email ${userData.email} already exists`);
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

  public async deleteUser(userId: Types.ObjectId): Promise<User> {
    const deletedUser: User = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) throw new Error("User doesn't exist");

    return deletedUser;
  }
}
