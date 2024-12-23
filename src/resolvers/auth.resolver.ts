import { Authorized, Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";

import { AuthService } from "@services/auth.service";
import { User } from "@models/users.model";
import { SignUpInput, LogInInput } from "@schemas/auth.schema";
import { TokenWithUser } from "@typedefs/auth.type";

@Service()
@Resolver((_of) => TokenWithUser)
export class AuthResolver {
  constructor(
    @Inject()
    private readonly authService: AuthService
  ) {}

  @Mutation(() => TokenWithUser)
  public async signUp(
    @Arg("userData") userData: SignUpInput
  ): Promise<TokenWithUser> {
    const { user, token } = await this.authService.userSignUp(userData);

    return { user, token };
  }

  @Mutation(() => TokenWithUser)
  public async logIn(
    @Arg("userData") userData: LogInInput
  ): Promise<TokenWithUser> {
    const { user, token } = await this.authService.userLogin(userData);

    return { user, token };
  }

  @Authorized()
  @Mutation(() => User)
  public async logout(@Ctx("user") { _id }: User): Promise<User> {
    const user = await this.authService.userLogOut(_id);

    return user;
  }
}
