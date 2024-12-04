import { Authorized, Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Types } from "mongoose";

import { AuthService } from "@services/auth.service";
import { User } from "@models/users.model";
import { SignUpInput, LogInInput } from "@schemas/auth.schema";
import { TokenWithUser } from "@typedefs/auth.type";

@Resolver()
export class AuthResolver extends AuthService {
  @Mutation(() => TokenWithUser)
  public async signUp(
    @Arg("userData") userData: SignUpInput
  ): Promise<TokenWithUser> {
    const { user, token } = await this.userSignUp(userData);

    return { user, token };
  }

  @Mutation(() => TokenWithUser)
  public async logIn(
    @Arg("userData") userData: LogInInput
  ): Promise<TokenWithUser> {
    const { user, token } = await this.userLogin(userData);

    return { user, token };
  }

  @Authorized()
  @Mutation(() => User)
  public async logout(@Ctx("user") userId: Types.ObjectId): Promise<User> {
    const user = await this.userLogOut(userId);

    return user;
  }
}
