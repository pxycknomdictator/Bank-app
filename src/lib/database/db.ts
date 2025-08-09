import mongoose from "mongoose";
import { logger } from "$lib/utils/logger";
import { DATABASE } from "$env/static/private";

export async function database() {
	if (mongoose.connection.readyState === 1) return mongoose.connection;

	try {
		const { connection } = await mongoose.connect(DATABASE);
		const { name, host, port } = connection;
		logger.info("Database is connected", { name, host, port });

		return connection;
	} catch (error) {
		logger.error("Failed to connect with database", { error });
		throw new Error("Failed to connect with database", { cause: error });
	}
}
