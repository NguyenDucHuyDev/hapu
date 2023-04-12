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
		* @type {(import("@prisma/client").Prisma.NewScalarFieldEnum)[]}
		*/
	const required_field = [
		"slug",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const news = await prisma.new.findFirst({
		where: {
			slug: params.slug
		},
		include: {
			newType: true
		}
	});
	return res.responseSuccess(news);
};

const serializer = (params) => {
	const { news } = serialization;
	return serialization.do(params, news);
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