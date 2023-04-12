import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.ManufacturerScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const manufacturer = await prisma.manufacturer.findUnique({
		where: {
			id: params.id
		},
	});
	return res.responseSuccess(manufacturer);
};

const serializer = (params) => {
	const { manufacturer } = serialization;
	return serialization.do(params, manufacturer);
};


export default {
	view,
	middleware: [
	]
};