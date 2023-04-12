import { onlyGuest } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";
import { encryptToken } from "#src/utils/jwt.js";
/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const input = serializer(req.required(["number_phone", "password"]));
	const user = await prisma.user.findUnique({
		where: {
			number_phone_password: {
				number_phone: input.number_phone,
				password: input.password,
			}
		}
	});
	if(user) {
		return res.responseSuccess({
			user,
			token: encryptToken(user)
		});
	}
	return res.responseFailed(403, "Sai tên đăng nhập hoặc mật khẩu!");
};

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

export default {
	middleware: [
		onlyGuest,
	],
	view
};