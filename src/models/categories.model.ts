import { modelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Types } from "mongoose";

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Category {
  @Field(() => Types.ObjectId)
  readonly _id?: Types.ObjectId;

  @Field()
  @Property({ required: true, unique: true })
  name: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field({ nullable: true })
  @Property()
  picture?: string;
}
