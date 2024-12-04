import { config } from "dotenv";
config({ path: ".env" });

// Server variables
export const { PORT, SECRET_KEY } = process.env;

// Database variables
export const { MONGO_URI } = process.env;
