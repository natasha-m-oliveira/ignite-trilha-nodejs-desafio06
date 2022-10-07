import * as dotenv from "dotenv";
import { Connection, createConnection, getConnectionOptions } from "typeorm";

dotenv.config();
export default async (
  host = process.env.DATABASE_HOST
): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return await createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database:
        process.env.NODE_ENV === "test"
          ? "fin_api_test"
          : defaultOptions.database,
    })
  );
};
