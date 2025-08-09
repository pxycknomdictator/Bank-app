import { Schema, model, models } from "mongoose";
import type { Document, ObjectId } from "mongoose";

interface LinkedAccount {
	accountId: ObjectId;
	accountNumber: string;
	IBAN: string;
}

interface UserSchema extends Document {
	fullName: string;
	username: string;
	email: string;
	password: string;
	DOB: Date;
	CNICNumber: string;
	CNICIssueDate: Date;
	CNICExpiry: Date;
	linkedAccounts?: LinkedAccount[];
}

const accountLinkedSchema = new Schema<LinkedAccount>({
	accountId: {
		type: Schema.Types.ObjectId,
		ref: "Account",
		required: [true, "Account id is required"]
	},
	accountNumber: {
		type: String,
		required: [true, "Account number is required"]
	},
	IBAN: {
		type: String,
		required: [true, "IBAN number is required"]
	}
});

const userSchema = new Schema<UserSchema>(
	{
		fullName: {
			type: String,
			required: [true, "fullname is required"],
			minlength: [3, "fullname contain at least 3 characters"]
		},
		username: {
			type: String,
			unique: true,
			lowercase: true,
			required: [true, "username is required"],
			minlength: [3, "username contain at least 3 characters long"]
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: [true, "email is required"],
			match: [/.+@.+\..+/, "please provide a valid email"]
		},
		password: {
			type: String,
			select: false,
			required: [true, "password is required"],
			minlength: [8, "password must be at least 8 characters long"],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				"password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
			]
		},
		DOB: {
			type: Date,
			required: [true, "DOB is required"]
		},
		CNICNumber: {
			type: String,
			select: false,
			required: [true, "CNIC number is required"],
			match: [/^\d{5}-\d{7}-\d$/, "invalid CNIC format"]
		},
		CNICIssueDate: {
			type: Date,
			select: false,
			required: [true, "CNIC issue date is required"]
		},
		CNICExpiry: {
			type: Date,
			select: false,
			required: [true, "CNIC expiry date is required"]
		},
		linkedAccounts: [accountLinkedSchema]
	},
	{ timestamps: true }
);

export const User = models?.User || model("User", userSchema);
