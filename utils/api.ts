import { fetch } from "@tauri-apps/plugin-http";
import { SHA256 } from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { rsaSign, symmetricSign } from "./crypt";
import { getTimestamp } from "./helpers";

export const ACCESS_TOKEN_B2B_PATH = "/openapi/v1.0/access-token/b2b";
export const ACCESS_TOKEN_B2B2C_PATH = "/openapi/v1.0/access-token/b2b2c";
export const QR_MPM_GENERATE_PATH = "/openapi/v1.0/qr/qr-mpm-generate";

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

interface AccessTokenB2B2CRequest {
	grantType: string;
	authCode?: string;
	refreshToken?: string;
	additionalInfo: object;
}

interface AccessTokenB2B2CResponse {
	responseCode: string;
	responseMessage: string;
	accessToken: string;
	tokenType: string;
	expiresIn: number;
	refreshToken: string;
}

interface QrMpmAmount {
	currency: string;
	value: string;
}

interface QrMpmUrlParam {
	url: string;
	type: string;
	isDeeplink: string;
}

interface QrMpmAdditional {
	additionalLabel: string;
	requestQrUrl: string;
	requestQrImage: string;
	urlParam: QrMpmUrlParam[];
}

interface QrMPMGenerateRequest {
	partnerReferenceNo: string;
	terminalId: string;
	validityPeriod?: string;
	amount?: QrMpmAmount;
	additionalInfo: QrMpmAdditional;
}

interface QrMPMGenerateResponse {
	responseCode: string;
	responseMessage: string;
	partnerReferenceNo: string;
	qrContent: string;
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

export const fetchAccessTokenB2B2C = async (
	merchantId: string,
	privateKeyPem: string,
	authCheckData: string,
	baseUrl: string,
	isAuthCode = false,
) => {
	try {
		const timestamp = getTimestamp();
		const signature = rsaSign(merchantId, timestamp, privateKeyPem);

		const payload: AccessTokenB2B2CRequest = {
			grantType: isAuthCode ? "AUTHORIZATION_CODE" : "REFRESH_TOKEN",
			additionalInfo: {},
		};

		if (isAuthCode) {
			payload.authCode = authCheckData;
		} else {
			payload.refreshToken = authCheckData;
		}

		const response = await fetch(`${baseUrl}${ACCESS_TOKEN_B2B2C_PATH}`, {
			method: "POST",
			headers: {
				"X-CLIENT-KEY": merchantId,
				"X-TIMESTAMP": timestamp,
				"X-SIGNATURE": signature,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData: SnapErrorResponse = await response.json();
			throw new Error(
				`Failed to get access token B2B2C: ${errorData.responseMessage || "An unknown error occurred"}`,
			);
		}

		const data: AccessTokenB2B2CResponse = await response.json();
		return data;
	} catch (error: unknown) {
		console.log(error);
		throw new Error(`Failed to get access token B2B2C: ${error}`);
	}
};

export const fetchQrMPMGenerate = async (
	merchantId: string,
	accessToken: string,
	referenceNo: string,
	callbackUrl: string,
	baseUrl: string,
	secretKey: string,
	amount: number | null = null,
) => {
	try {
		const timestamp = getTimestamp();
		const payload: QrMPMGenerateRequest = {
			partnerReferenceNo: referenceNo,
			terminalId: "Info Terminal",
			additionalInfo: {
				additionalLabel: "Additional Label",
				requestQrUrl: "N",
				requestQrImage: "N",
				urlParam: [
					{
						url: callbackUrl,
						type: "PAY_NOTIFY",
						isDeeplink: "N",
					},
				],
			},
		};

		if (amount && amount > 0) {
			payload.amount = {
				currency: "IDR",
				value: amount.toFixed(2),
			};

			const validity = new Date();
			validity.setDate(validity.getDate() + 2);
			payload.validityPeriod = toIsoString(validity);
		}

		const payloadHash = SHA256(JSON.stringify(payload)).toString();
		const stringToSign = `POST:${QR_MPM_GENERATE_PATH}:${accessToken}:${payloadHash}:${timestamp}`;
		const signature = symmetricSign(stringToSign, secretKey);

		const response = await fetch(`${baseUrl}${QR_MPM_GENERATE_PATH}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"X-PARTNER-ID": merchantId,
				"X-TIMESTAMP": timestamp,
				"X-SIGNATURE": signature,
				"X-EXTERNAL-ID": uuidv4(),
				"CHANNEL-ID": "QRIS",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData: SnapErrorResponse = await response.json();
			throw new Error(
				`Failed to generate QR MPM: ${errorData.responseMessage || "An unknown error occurred"}`,
			);
		}

		const data: QrMPMGenerateResponse = await response.json();
		return data.qrContent;
	} catch (error: unknown) {
		console.log(error);
		throw new Error(`Failed to generate QR MPM: ${error}`);
	}
};
