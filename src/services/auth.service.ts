import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Types } from "mongoose";

import { SECRET_KEY } from "@config";
import {
  DataStoredInToken,
  TokenData,
  TokenWithUser,
} from "@typedefs/auth.type";
import { UserModel } from "@models";
import { User } from "@models/users.model";
import { LogInInput, SignUpInput } from "@schemas/auth.schema";

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60;

  return {
    expiresIn,
    token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }),
  };
};

export class AuthService {
  public async userSignUp(userData: SignUpInput): Promise<TokenWithUser> {
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

    const tokenData = createToken(newUser);

    return { token: tokenData.token, user: newUser };
  }

  public async userLogin(userData: LogInInput): Promise<TokenWithUser> {
    const findUser: User = await UserModel.findOne({
      username: userData.username,
    });

    if (!findUser) throw new Error("This username was not found");

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password
    );

    if (!isPasswordMatching)
      throw new Error("Your email or password do not match");

    const tokenData = createToken(findUser);

    return { token: tokenData.token, user: findUser };
  }

  public async userLogOut(userId: Types.ObjectId): Promise<User> {
    const findUser: User = await UserModel.findById(userId);

    if (!findUser) throw new Error("User doesn't exists");

    return findUser;
  }
}
