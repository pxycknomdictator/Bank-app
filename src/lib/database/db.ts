import mongoose from "mongoose";
import { logger } from "$lib/utils/logger";
import * as env from "$env/static/private";

export async function database() {
	if (mongoose.connection.readyState === 1) return mongoose.connection;

	try {
		const { connection } = await mongoose.connect(env.DATABASE);
		const { name, host, port } = connection;
		logger.info("db.ts -> Database is connected", { name, host, port });

		return connection;
	} catch (error) {
		logger.error("db.ts → Failed to connect with database", { error });
		throw new Error("db.ts → Failed to connect with database", { cause: error });
	}
}
