import { MONGO_URI } from "@config";

export const dbConfig = {
  url: MONGO_URI,
  options: {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  },
};
