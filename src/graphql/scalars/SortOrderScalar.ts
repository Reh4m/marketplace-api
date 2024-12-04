import { GraphQLScalarType, Kind } from "graphql";

export const SortOrderScalar = new GraphQLScalarType({
  name: "SortOrder",
  description:
    "Sort order scalar type that can be either a string ('ASC', 'DESC') or a number (1, -1)",
  serialize(value: any) {
    // Convert outgoing value to string or number
    if (typeof value === "string" || typeof value === "number") return value;

    throw new Error(
      "SortOrderScalar can only serialize string or number values"
    );
  },
  parseValue(value: any) {
    // Convert incoming value to string or number
    if (typeof value === "string" || typeof value === "number") return value;

    throw new Error("SortOrderScalar can only parse string or number values");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) return ast.value;

    throw new Error("SortOrderScalar can only parse string or number literals");
  },
});
