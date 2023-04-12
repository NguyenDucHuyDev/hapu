import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";
import { prisma } from "#root/types.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"coupon_name",
		"coupon_code",
		"discount_price",
		"is_active",
		"quantity",
	]);
	const params = serializer(required);
	const isExist = await checkExist(params);
	if(isExist) {
		throw new Error(JSON.stringify({
			message: "Mã coupon đã tồn tại!", http_code: 406
		}));
	}
	const coupon = await prisma.coupon.create({
		data: params
	});
	return res.responseSuccess(coupon);
};

const checkExist = async (params) => {
	const check = await prisma.coupon.findUnique({
		where: {
			coupon_code: params.coupon_code,
		}
	});
	return check ? true : false;
};

const serializer = (params) => {
	const { coupon } = serialization;
	return serialization.do(params, coupon);
};



export default {
	view,
	middleware: [
		onlyAdmin,
	]
};