import { verify } from "jsonwebtoken";
import { AuthChecker, AuthenticationError } from "type-graphql";

import { SECRET_KEY } from "@config";
import { UserModel } from "@models";
import { User } from "@models/users.model";
import { RequestWithUser, DataStoredInToken } from "@typedefs/auth.type";

const getAuthorization = (req: any): string | null => {
  const header = req.header("Authorization");

  return header;
};

export const AuthMiddleware = async (req: any) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;

      const findUser: User = await UserModel.findById(_id)
        .populate({
          path: "cart.product",
          model: "Product"
        });

      if (!findUser) throw new Error("User not found");

      return findUser;
    }

    return null;
  } catch (error) {
    throw new AuthenticationError("Wrong authentication token");
  }
};

export const AuthCheckerMiddleware: AuthChecker<RequestWithUser> = async (
  { context: { user } },
  allowedRoles
) => {
  if (!user) throw new AuthenticationError("Authentication token missing");

  if (allowedRoles.length === 0) return true;

  return allowedRoles.includes(user.role);
};
