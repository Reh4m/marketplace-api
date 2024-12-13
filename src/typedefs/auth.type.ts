import { Field, Int, ObjectType } from "type-graphql";
import { Types } from "mongoose";

import { User } from "@models/users.model";

@ObjectType()
export class DataStoredInToken {
  @Field((_type) => Types.ObjectId)
  _id: Types.ObjectId;
}

@ObjectType()
export class TokenData {
  @Field()
  token: string;

  @Field((_type) => Int)
  expiresIn: number;
}

@ObjectType()
export class TokenWithUser {
  @Field((_type) => User)
  user: User;

  @Field()
  token: string;
}

@ObjectType()
export class RequestWithUser {
  @Field((_type) => User, { nullable: true })
  user?: User;
}
