import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.CouponScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const coupon = await prisma.coupon.delete({
		where: {
			id: params.id
		}
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