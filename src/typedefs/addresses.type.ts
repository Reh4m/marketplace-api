import { modelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class Address {
  @Field()
  @Property({ required: true })
  name: string;

  @Field()
  @Property({ required: true })
  contactName: string;

  @Field()
  @Property({ required: true })
  contactPhone: string;

  @Field()
  @Property({ required: true })
  address: string;

  @Field()
  @Property({ required: true })
  city: string;

  @Field()
  @Property({ required: true })
  region: string;

  @Field()
  @Property({ required: true })
  country: string;

  @Field()
  @Property({ required: true })
  postalCode: string;
}
