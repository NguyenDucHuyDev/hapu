import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.TagScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const product = await prisma.tag.findUnique({
		where: {
			id: params.id
		},
	});
	return res.responseSuccess(product);
};

const serializer = (params) => {
	const { tag } = serialization;
	return serialization.do(params, tag);
};


export default {
	view,
	middleware: [
	]
};