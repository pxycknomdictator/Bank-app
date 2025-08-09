import argon2 from "argon2";
import { logger } from "./logger";
import { ARGON2_SECRET } from "$env/static/private";

const secretBuffer = Buffer.from(ARGON2_SECRET, "utf-8");

const argon2Options = {
	type: argon2.argon2id,
	hashLength: 50,
	parallelism: 2,
	timeCost: 3,
	memoryCost: 2 ** 16,
	secret: secretBuffer
};

export async function hashPassword(password: string): Promise<string> {
	try {
		return await argon2.hash(password, argon2Options);
	} catch (error) {
		logger.error("password.ts → Failed to hash password", { error });
		throw error;
	}
}

export async function verifyHash(hash: string, password: string): Promise<boolean> {
	try {
		return await argon2.verify(hash, password, { secret: secretBuffer });
	} catch (error) {
		logger.error("password.ts → Failed to verify password", { error });
		throw error;
	}
}
