import JWT from "jsonwebtoken";
import { logger } from "$lib/utils/logger";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "$env/static/private";

interface TokenPayload {
	_id: string;
	username: string;
	email: string;
}

function generateRefreshToken(tokenPayload: TokenPayload) {
	try {
		return JWT.sign(tokenPayload, JWT_REFRESH_TOKEN_SECRET, {
			expiresIn: "7d",
			algorithm: "HS256"
		});
	} catch (error) {
		logger.error("token.ts → Failed to generate refresh token:", { error });
		throw error;
	}
}

function generateAccessToken(_id: string) {
	try {
		return JWT.sign({ _id }, JWT_ACCESS_TOKEN_SECRET, {
			expiresIn: "15m",
			algorithm: "HS256"
		});
	} catch (error) {
		logger.error("token.ts → Failed to generate access token:", { error });
		throw error;
	}
}

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export function generateTokens(tokenPayload: TokenPayload): Tokens {
	const refreshToken = generateRefreshToken(tokenPayload);
	const accessToken = generateAccessToken(tokenPayload._id);

	if (!refreshToken || !accessToken) {
		logger.error("token.ts → Tokens are not created");
		throw new Error("Tokens are not created");
	}

	return { accessToken, refreshToken };
}
