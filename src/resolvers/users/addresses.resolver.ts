import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";

import { User } from "@models/users.model";
import { AddressInput } from "@schemas/addresses.schema";
import { AddressService } from "@services/users/addresses.service";
import { Address } from "@typedefs/addresses.type";

@Service()
@Authorized()
@Resolver((_of) => Address)
export class AddressResolver {
  constructor(
    @Inject()
    private readonly addressService: AddressService
  ) {}

  @Mutation(() => User)
  public async addUserAddress(
    @Ctx("user") { _id }: User,
    @Arg("userAddressDetails") userAddressDetails: AddressInput
  ): Promise<User> {
    const updatedUser: User = await this.addressService.addUserAddress(
      _id,
      userAddressDetails
    );

    return updatedUser;
  }

  @Mutation(() => User)
  public async updateUserAddress(
    @Ctx("user") { _id }: User,
    @Arg("addressDetails") addressDetails: AddressInput,
    @Arg("addressIndex") addressIndex: number
  ): Promise<User> {
    const updatedUser: User = await this.addressService.updateUserAddress(
      _id,
      addressDetails,
      addressIndex
    );

    return updatedUser;
  }

  @Mutation(() => User)
  public async deleteUserAddress(
    @Ctx("user") { _id }: User,
    @Arg("addressIndex") addressIndex: number
  ): Promise<User> {
    const updatedUser: User = await this.addressService.deleteUserAddress(
      _id,
      addressIndex
    );

    return updatedUser;
  }
}
