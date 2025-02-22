import { HmacSHA512 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import { KJUR } from "jsrsasign";

export function rsaSign(
	merchantID: string,
	timestamp: string,
	privateKeyPem: string,
) {
	const stringToSign = `${merchantID}|${timestamp}`;

	const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
	sig.init(privateKeyPem);
	sig.updateString(stringToSign);

	const signature = sig.sign();
	return hexToBase64(signature);
}

export const hexToBase64 = (hex: string) => {
	let binary = "";
	for (let i = 0; i < hex.length; i += 2) {
		binary += String.fromCharCode(Number.parseInt(hex.slice(i, i + 2), 16));
	}

	return btoa(binary);
};

export const symmetricSign = (data: string, key: string) => {
	const hash = HmacSHA512(data, key);
	return Base64.stringify(hash);
};
