import { onlyGuest } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";
import { prisma } from "#root/types.js";
/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */

const view = async (req, res) => {
	const required = req.required([
		"email",
		"password",
		"full_name",
		"number_phone",
		"birthday",
		"business_type",
		"city_id",
		"address",
		"business_name",
	]);
	const only = req.only(["user_referer"]);
	const params = serializer({
		...required,
		...only,
	});
	const exist = await isExist(params);
	if(exist) {
		return res.responseFailed(406, exist.message);
	}
	const user = await prisma.user.create({
		data: params
	});
	if(user) {
		return res.responseSuccess(user);
	}
	return res.responseFailed(403, "");
};

const isExist = async (params) => {
	const findByEmail = await prisma.user.findUnique({
		where: {
			email: params.email,
		}
	});
	if(findByEmail) {
		return {
			status: false,
			message: "Email đã tồn tại!"
		};
	}
	const findByNumberPhone = await prisma.user.findUnique({
		where: {
			number_phone: params.number_phone,
		}
	});
	if(findByNumberPhone) {
		return {
			status: false,
			message: "Số điện thoại đã tồn tại"
		};
	}
	return null;
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