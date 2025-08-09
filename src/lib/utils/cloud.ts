import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "$lib/utils/logger";
import * as env from "$env/static/private";

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
	secure: true
});

interface CloudResponse {
	publicId: string;
	secureUrl: string;
	fileType: string;
}

export async function uploadFileOnCloud(
	fileLocation: string,
	folder: string = "bank-app"
): Promise<CloudResponse> {
	try {
		const response = await cloudinary.uploader.upload(fileLocation, {
			folder,
			resource_type: "auto"
		});

		await fs.unlink(fileLocation);

		return {
			publicId: response.public_id,
			secureUrl: response.secure_url,
			fileType: response.resource_type
		};
	} catch (error) {
		logger.error("cloud.ts -> Error uploading file to Cloudinary:", { error });
		await fs.unlink(fileLocation);
		throw error;
	}
}

export async function deleteFileFromCloud(
	publicId: string,
	resource_type: string = "auto"
): Promise<boolean> {
	try {
		const response = await cloudinary.uploader.destroy(publicId, {
			resource_type
		});

		if (response.result !== "ok") {
			throw new Error(`cloud.ts -> Cloudinary deletion failed: ${response.result}`);
		}

		return true;
	} catch (error) {
		logger.error("cloud.ts -> Error deleting file from Cloudinary:", { error });
		throw error;
	}
}
