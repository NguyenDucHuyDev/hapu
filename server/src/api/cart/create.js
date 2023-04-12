import { onlyUser } from "#src/middleware/authentication.js";
import { prisma } from "#root/types.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const required = serializer(req.required([
		"product_id",
		"quantity",
	]));
	const params = {
		...required,
		user_id: req.ctx.user.id
	};
	if(params.quantity < 1) throw new Error(JSON.stringify({
		message: "Số lượng sản phẩm không hợp lệ!", http_code: 406
	}));
	const isExist = await checkExist(params);
	if(isExist) {
		throw new Error(JSON.stringify({
			message: "Sản phẩm đã tồn tại trong giỏ hàng!", http_code: 406
		}));
	}
	const cart = await prisma.cart.create({
		data: params,
		include: {
			product: true
		}
	});
	return res.responseSuccess(cart);
};

/**
 * 
 * @param {import("@prisma/client").Cart} params
 * @return {Promise<Boolean>}
 */

const checkExist = async (params) => {
	const check = await prisma.cart.findFirst({
		where: {
			product_id: params.product_id,
			user_id: params.user_id,
		}
	});
	return check ? true : false;
};

const serializer = (params) => {
	const { cart } = serialization;
	return serialization.do(params, cart);
};

export default {
	view,
	middleware: [
		onlyUser,
	]
};