import { GraphQLScalarType, Kind } from "graphql";
import { format, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "America/Mexico_City";

export const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value: any) {
    // value from the client
    const date = new Date(value);

    return toZonedTime(date, TIME_ZONE);
  },
  serialize(value: any) {
    // value sent to the client
    const date = new Date(value);

    const zonedDate = toZonedTime(date, TIME_ZONE);

    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
      timeZone: TIME_ZONE,
    });
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // ast value is always in string format
      const date = new Date(ast.value);

      return toZonedTime(date, TIME_ZONE);
    }
    return null;
  },
});
