import dotenv from 'dotenv';
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

dotenv.config()

// Create a Logtail client
export const logtail = new Logtail(process.env.BETTER_STACK_SOURCE_TOKEN!, {
  endpoint: process.env.BETTER_STACK_INGESTING_URL!,
});

// Create a Winston logger - passing in the Logtail transport
export const logger = winston.createLogger({
  transports: [new LogtailTransport(logtail)],
});
