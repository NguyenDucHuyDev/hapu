import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";


/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const { id } = serializer(req.required(["id"]));
	const [, product] = await prisma.$transaction([
		prisma.tagsOnProducts.deleteMany({
			where: {
				product_id: id
			}
		}),
		prisma.product.delete({
			where: {
				id,
			},
			include: {
				tags: {
					include: {
						tag: true
					}
				},
			}
		})
	]);
	res.responseSuccess(product);
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