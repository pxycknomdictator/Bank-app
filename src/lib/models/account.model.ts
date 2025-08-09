import { Schema, model, models } from "mongoose";
import type { Document, ObjectId } from "mongoose";

enum AccountType {
	savings = "savings",
	current = "current",
	business = "business"
}

enum AccountStatus {
	active = "active",
	frozen = "frozen",
	closed = "closed"
}

interface AccountSchema extends Document {
	userId: ObjectId;
	IBAN: string;
	accountNumber: string;
	branchCode: string;
	balance: number;
	accountType: AccountType;
	status: AccountStatus;
}

const accountSchema = new Schema<AccountSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "user id is required"]
		},
		IBAN: {
			type: String,
			unique: true,
			required: [true, "IBAN is required"]
		},
		accountNumber: {
			type: String,
			unique: true,
			required: [true, "Account number is required"]
		},
		branchCode: {
			type: String,
			required: [true, "Branch code is required"]
		},
		balance: {
			type: Number,
			default: 0,
			min: [0, "Balance can't be negative"]
		},
		accountType: {
			type: String,
			enum: {
				values: [AccountType.savings, AccountType.current, AccountType.business],
				message: "{VALUE} is not defined"
			},
			default: AccountType.savings
		},
		status: {
			type: String,
			enum: {
				values: [AccountStatus.active, AccountStatus.frozen, AccountStatus.closed],
				message: "{VALUE} is not a valid status"
			},
			default: AccountStatus.active
		}
	},
	{ timestamps: true }
);

export const Account = models?.Account || model<AccountSchema>("Account", accountSchema);
