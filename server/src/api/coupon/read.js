import { onlyAdmin, onlyUser } from "#src/middleware/authentication.js";
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
		"coupon_code",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	/**
		* @type {import("@prisma/client").Prisma.CouponWhereInput}
		*/
	const where = {
		coupon_code: params.coupon_code
	};
	if(req.ctx.user) {
		where.is_active = true;
	}
	const coupon = await prisma.coupon.findFirst({
		where,
	});
	if(req.ctx.user && coupon && coupon.used >= coupon.quantity) {
		throw new Error(JSON.stringify({
			http_code: 406,
			message: "Coupon đã được sử dụng hết."
		}));
	}
	return res.responseSuccess(coupon);
};

const serializer = (params) => {
	const { coupon } = serialization;
	return serialization.do(params, coupon);
};

const admin = {
	view,
	middleware: [
		onlyAdmin
	]
};

const user = {
	view,
	middleware: [
		onlyUser
	]
};

export default {
	admin,
	user
};