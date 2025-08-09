import winston from "winston";
import * as env from "$env/static/private";

const { combine, timestamp, colorize, printf, uncolorize } = winston.format;

const formatter = printf(({ level, message, timestamp, ...meta }) => {
	let log = `${timestamp} [${level}]: ${message}`;
	if (Object.keys(meta).length > 0) log += ` ${JSON.stringify(meta)}`;

	return log;
});

export const logger = winston.createLogger({
	level: env.NODE_ENV === "production" ? "info" : "debug",
	format: combine(timestamp(), uncolorize(), formatter),
	transports: [
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: combine(timestamp(), uncolorize(), formatter)
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			format: combine(timestamp(), uncolorize(), formatter)
		})
	],
	exceptionHandlers: [
		new winston.transports.File({
			filename: "logs/exceptions.log",
			format: combine(timestamp(), uncolorize(), formatter)
		})
	]
});

if (env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({ format: combine(colorize(), timestamp(), formatter) })
	);
}
