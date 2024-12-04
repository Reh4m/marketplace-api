import { Field, ObjectType } from "type-graphql";
import { Types } from "mongoose";

import { User } from "@models/users.model";

@ObjectType()
export class DataStoredInToken {
  @Field((type) => Types.ObjectId)
  _id: Types.ObjectId;
}

@ObjectType()
export class TokenData {
  @Field((type) => String)
  token: string;

  @Field((type) => Number)
  expiresIn: number;
}

@ObjectType()
export class TokenWithUser {
  @Field((type) => User)
  user: User;

  @Field((type) => String)
  token: string;
}

@ObjectType()
export class RequestWithUser {
  @Field((type) => User, { nullable: true })
  user?: User;
}
