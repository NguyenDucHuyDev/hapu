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
		* @type {(import("@prisma/client").Prisma.NewScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const [, news] = await prisma.$transaction([
		prisma.banner.deleteMany({
			where: {
				new_id: params.id
			},
		}),
		prisma.new.delete({
			where: {
				id: params.id
			}
		}),
	]);
	return res.responseSuccess(news);
};

const serializer = (params) => {
	const { news } = serialization;
	return serialization.do(params, news);
};

export default {
	view,
	middleware: [
		onlyAdmin,
	]
};