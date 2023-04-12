import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
   * @type {(import("@prisma/client").Prisma.ProductScalarFieldEnum)[]}
   */
	const only_fields = [
		"name", 
		"unit_price", 
		"category_id", 
		"description",
		"full_description",
		"ingredient_id", 
		"manufacturer_id", 
		"image_url", 
		"address", 
		"business_name", 
		"user_referer",
		"status",
		"tags",
		"note",
		"expiry",
		"import_prices",
		"promotion_price",
		"is_hot",
		"is_outstanding",
	];
	const only = req.only(only_fields);
	const { id } = req.required(["id"]);
	const params = serializer({
		...only,
		id
	});
	if(!params.tags?.length) await prisma.tagsOnProducts.deleteMany({
		where: {
			product_id: params.id
		}
	});
	const product = await prisma.product.update({
		where: {
			id: params.id,
		},
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
		onlyAdmin,
	]
};