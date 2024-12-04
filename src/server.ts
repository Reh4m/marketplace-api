import { Server } from "@/app";

const server = new Server();

server.bootstrap().catch((error) => console.error(error));
