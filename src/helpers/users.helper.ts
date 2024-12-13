import { UserModel } from "@/models";
import { User } from "@/models/users.model";
import { compareObjectIds } from "@/utils";
import { Types } from "mongoose";

/**
 * Checks if a username already exists in the database.
 *
 * @param username - The username to check.
 * @param userId - The user ID to exclude from the check (optional).
 * @returns - True if the username exists and doesn't belong to the provided user ID, otherwise false.
 */
export const checkIfUsernameExists = async (
  username: string,
  userId?: Types.ObjectId
): Promise<boolean> => {
  const findUser: User = await UserModel.findOne({ username });

  if (!findUser) return false;

  if (userId && compareObjectIds(findUser._id, userId)) return false;

  return true;
};

/**
 * Checks if a user email already exists in the database.
 *
 * @param username - The email to check.
 * @param userId - The user ID to exclude from the check (optional).
 * @returns - True if the email exists and doesn't belong to the provided user ID, otherwise false.
 */
export const checkIfEmailExists = async (
  email: string,
  userId?: Types.ObjectId
): Promise<boolean> => {
  const findUser: User = await UserModel.findOne({ email });

  if (!findUser) return false;

  if (userId && compareObjectIds(findUser._id, userId)) return false;

  return true;
};
