import { IsNotEmpty, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";

import { Address } from "@typedefs/addresses.type";

@InputType()
export class AddressInput implements Partial<Address> {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  contactName: string;

  @Field()
  @IsNotEmpty()
  contactPhone: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsNotEmpty()
  region: string;

  @Field()
  @IsNotEmpty()
  country: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(6)
  postalCode: string;
}
