import { onlyUser } from "#src/middleware/authentication.js";
import isOwner from "#src/middleware/cart/isOwner.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = serializer(req.required([
		"id",
		"quantity",
	]));
	if(required.quantity < 1) throw new Error(JSON.stringify({
		message: "Số lượng sản phẩm không hợp lệ!", http_code: 406
	}));
	const cart = await prisma.cart.update({
		data: {
			quantity: required.quantity,
		},
		where: {
			id: required.id,
		},
		include: {
			product: true,
		}
	});
	return res.responseSuccess(cart);
};

const serializer = (params) => {
	const { cart } = serialization;
	return serialization.do(params, cart);
};

export default {
	view,
	middleware: [
		onlyUser,
		isOwner,
	]
};