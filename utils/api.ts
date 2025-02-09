import { fetch } from "@tauri-apps/plugin-http";
import { rsaSign } from "./crypt";
import { getTimestamp } from "./helpers";

export const ACCESS_TOKEN_B2B_PATH = "/openapi/v1.0/access-token/b2b";

interface SnapErrorResponse {
	responseCode: string;
	responseMessage: string;
}

interface AccessTokenB2BResponse {
	responseCode: string;
	responseMessage: string;
	accessToken: string;
	tokenType: string;
	expiresIn: number;
}

export const fetchAccessTokenB2B = async (
	merchantId: string,
	privateKeyPem: string,
	baseUrl: string,
) => {
	try {
		const timestamp = getTimestamp();
		const signature = rsaSign(merchantId, timestamp, privateKeyPem);
		const response = await fetch(`${baseUrl}${ACCESS_TOKEN_B2B_PATH}`, {
			method: "POST",
			headers: {
				"X-CLIENT-KEY": merchantId,
				"X-TIMESTAMP": timestamp,
				"X-SIGNATURE": signature,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				grantType: "client_credentials",
				additionalInfo: {},
			}),
		});

		if (!response.ok) {
			const errorData: SnapErrorResponse = await response.json();
			throw new Error(
				`Failed to get access token B2B: ${errorData.responseMessage || "An unknown error occurred"}`,
			);
		}

		const data: AccessTokenB2BResponse = await response.json();
		return data.accessToken;
	} catch (error: unknown) {
		console.log(error);
		throw new Error(`Failed to get access token B2B: ${error}`);
	}
};
