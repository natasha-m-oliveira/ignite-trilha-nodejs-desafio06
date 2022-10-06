import { createConnection } from "typeorm";

void (async () => await createConnection())();
