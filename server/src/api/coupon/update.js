import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required(["id"]);
	const only = req.only([
		"coupon_name",
		"coupon_code",
		"discount_price",
		"is_active",
		"quantity",
	]);
	const params = serializer({
		...required,
		...only,
	});
	const coupon = await prisma.coupon.update({
		where: {
			id: params.id
		},
		data: params
	});
	return res.responseSuccess(coupon);
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