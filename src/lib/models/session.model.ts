import { Schema, model, models } from "mongoose";
import type { Document, ObjectId } from "mongoose";

interface SessionSchema extends Document {
	userId: ObjectId;
	sessionToken: string;
	ipAddress: string;
	userAgent: string;
	expiresAt: Date;
}

const sessionSchema = new Schema<SessionSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "userId is required"]
		},
		sessionToken: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "session token is required"]
		},
		ipAddress: {
			type: String,
			required: [true, "ip address is required"]
		},
		userAgent: {
			type: String,
			required: [true, "user agent is required"]
		},
		expiresAt: {
			type: Date,
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			expires: 0
		}
	},
	{ timestamps: true }
);

export const Session = models?.Session || model("Session", sessionSchema);
