import { Types } from "mongoose";

/**
 * Compares two MongoDB ObjectIds for equality.
 *
 * @param objectId1 - The first ObjectId to compare.
 * @param objectId2 - The second ObjectId to compare.
 * @returns - True if the ObjectIds are equal, otherwise false.
 */
export const compareObjectIds = (
  objectId1: Types.ObjectId,
  objectId2: Types.ObjectId
): boolean => {
  return objectId1.toString() === objectId2.toString();
};
