import { encryptToken } from "#src/utils/jwt.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = serializer(req.required([
		"email",
		"password",
	]));
	const admin = await prisma.admin.findUnique({
		where: {
			email_password: {
				email: required.email,
				password: required.password
			}
		}
	});
	if(admin) {
		return res.responseSuccess({
			admin,
			token: encryptToken(admin, {
				isAdmin: true,
			})
		});
	}
	return res.responseFailed(403, "Sai tên đăng nhập hoặc mật khẩu!");
};

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

export default {
	view,
	middleware: []
};