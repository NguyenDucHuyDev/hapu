import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.CategoryScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const category = await prisma.category.findUnique({
		where: {
			id: params.id
		},
	});
	return res.responseSuccess(category);
};

const serializer = (params) => {
	const { category } = serialization;
	return serialization.do(params, category);
};


export default {
	view,
	middleware: [
	]
};