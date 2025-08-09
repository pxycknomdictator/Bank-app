import { Schema, model, models } from "mongoose";
import type { Document, ObjectId } from "mongoose";

enum CardType {
	credit = "credit",
	debit = "debit"
}

enum CardStatus {
	active = "active",
	disable = "disable"
}

enum CardIssuer {
	HBL = "HBL",
	UBL = "UBL",
	MeezanBank = "Meezan Bank",
	Standard = "Standard Chartered"
}

enum CurrencyType {
	PKR = "PKR",
	USD = "USD"
}

interface CardSchema extends Document {
	userId: ObjectId;
	accountId: ObjectId;
	cardNumber: string;
	cardExpiry: Date;
	cardCVV: string;
	cardType: CardType;
	cardStatus: CardStatus;
	cardIssuer: CardIssuer;
	currency: CurrencyType;
	issueDate: Date;
	pinCode: string;
}

const cardSchema = new Schema<CardSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User Id is required"]
		},
		accountId: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: [true, "Account Id is required"]
		},
		cardNumber: {
			type: String,
			required: [true, "Card Number is required"],
			unique: true,
			match: [/^\d{16}$/, "Card number must be exactly 16 digits"]
		},
		cardExpiry: {
			type: Date,
			required: [true, "Card Expiry is required"]
		},
		cardCVV: {
			type: String,
			required: [true, "Card CVV is required"],
			match: [/^\d{3,4}$/, "CVV must be 3 or 4 digits"]
		},
		cardType: {
			type: String,
			enum: {
				values: [CardType.credit, CardType.debit],
				message: "{VALUE} is not a valid card type"
			},
			default: CardType.debit
		},
		cardStatus: {
			type: String,
			enum: {
				values: [CardStatus.active, CardStatus.disable],
				message: "{VALUE} is not a valid card status"
			},
			default: CardStatus.active
		},
		cardIssuer: {
			type: String,
			enum: {
				values: [
					CardIssuer.HBL,
					CardIssuer.UBL,
					CardIssuer.MeezanBank,
					CardIssuer.Standard
				],
				message: "{VALUE} is not a valid card issuer"
			},
			required: [true, "Card issuer is required"]
		},
		currency: {
			type: String,
			enum: {
				values: [CurrencyType.PKR, CurrencyType.USD],
				message: "{VALUE} is not a valid currency"
			},
			default: CurrencyType.PKR
		},
		issueDate: {
			type: Date,
			default: Date.now
		},
		pinCode: {
			type: String,
			required: [true, "PIN code is required"]
		}
	},
	{ timestamps: true }
);

export const Card = models?.Card || model("Card", cardSchema);
