import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"name",
		"category_id",
		"ingredient_id",
		"manufacturer_id",
		"image_url",
		"unit_price",
	]);
	const only = req.only([
		"description",
		"tags",
		"note",
		"full_description",
		"category_id",
		"ingredient_id",
		"manufacturer_id"
	]);
	const params = serializer({
		...required,
		...only,
		slug: "",
	});
	const product = await prisma.product.create({
		data: params,
		include: {
			tags: {
				include: {
					tag: true
				}
			},
		}
	});
	return res.responseSuccess(product);
};

const serializer = (params) => {
	const { product } = serialization;
	return serialization.do(params, product);
};


export default {
	view,
	middleware: [
		onlyAdmin
	]
};