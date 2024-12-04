import { modelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class Address {
  @Field((type) => String)
  @Property({ required: true })
  name: string;

  @Field((type) => String)
  @Property({ required: true })
  contactName: string;

  @Field((type) => String)
  @Property({ required: true })
  contactPhone: string;

  @Field((type) => String)
  @Property({ required: true })
  address: string;

  @Field((type) => String)
  @Property({ required: true })
  city: string;

  @Field((type) => String)
  @Property({ required: true })
  region: string;

  @Field((type) => String)
  @Property({ required: true })
  country: string;

  @Field((type) => String)
  @Property({ required: true })
  postalCode: string;
}
