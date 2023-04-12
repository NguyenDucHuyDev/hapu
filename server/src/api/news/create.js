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
		"title",
		"content_post",
		"new_type_id",
		"image_url",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
		slug: "",
	});
	const news = await prisma.new.create({
		data: params
	});
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