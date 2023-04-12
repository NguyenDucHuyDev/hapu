import { onlyAdmin, } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.ProductScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const product = await prisma.product.findUnique({
		where: {
			id: params.id
		},
		include: {
			tags: {
				include: {
					tag: true
				}
			},
			category: true
		},
	});
	return res.responseSuccess(product);
};

const serializer = (params) => {
	const { product } = serialization;
	return serialization.do(params, product);
};

const user = {
	view,
	middleware: [
	]
};

const admin = {
	view,
	middleware: [
		onlyAdmin,
	]
};

export default {
	admin,
	user,
};