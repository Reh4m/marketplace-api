import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import path from "node:path";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import mongoose, { Types } from "mongoose";

import { PORT } from "@config";
import { dbConfig } from "@database";
import {
  AuthCheckerMiddleware,
  AuthMiddleware,
} from "@middlewares/authentication.middleware";
import { DateScalar } from "@scalars/DateScalar";
import { ObjectIdScalar } from "@scalars/ObjectIdScalar";
import { resolvers } from "@resolvers";
import { User } from "@models/users.model";
import Container from "typedi";

export class Server {
  private server: ApolloServer;

  constructor() {
    this.mongoConnection();
  }

  private mongoConnection(): void {
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Mongo Connection Established");
    });

    connection.on("reconnected", () => {
      console.log("Mongo Connection Reestablished");
    });

    connection.on("disconnected", () => {
      console.log("Mongo Connection Disconnected");
      console.log("Trying to reconnect to Mongo ...");
      setTimeout(() => {
        mongoose.connect(dbConfig.url, dbConfig.options);
      }, 3000);
    });

    connection.on("close", () => {
      console.log("Mongo Connection Closed");
    });

    connection.on("error", (error: Error) => {
      console.log("Mongo Connection ERROR: " + error);
    });

    const run = async () => {
      await mongoose.connect(dbConfig.url, dbConfig.options);
    };

    run().catch((error) => console.error(error));
  }

  private async schema(): Promise<GraphQLSchema> {
    return await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, "graphql/schema.graphql"),
      authChecker: AuthCheckerMiddleware,
      scalarsMap: [
        { type: Types.ObjectId, scalar: ObjectIdScalar },
        { type: Date, scalar: DateScalar },
      ],
      // Enable 'class-validation' integration
      validate: true,
      // Registry 3rd party IOC container
      container: Container,
    });
  }

  public async bootstrap(): Promise<void> {
    const schema = await this.schema();

    this.server = new ApolloServer({ schema });

    const { url } = await startStandaloneServer(this.server, {
      listen: { port: Number(PORT) },
      context: async ({ req }: any) => {
        try {
          const user: User = await AuthMiddleware(req);

          return { user };
        } catch (error: any) {
          throw new Error(error);
        }
      },
    });

    console.log(`GraphQL server ready at ${url}`);
  }
}
