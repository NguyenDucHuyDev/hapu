import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret_key = process.env.JWT_SECRET_KEY;
const encryptToken = (data, options) => {
	const token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 3), // 3 months
		...options,
		data,
	}, secret_key);
	return token;
};

const decryptToken = (token) => {
	try {
		return jwt.verify(token, secret_key);
	}
	catch(e) {
		return null;
	}
};

export {
	encryptToken,
	decryptToken,
};