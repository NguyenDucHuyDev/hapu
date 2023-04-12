import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.IngredientScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const ingredient = await prisma.ingredient.findUnique({
		where: {
			id: params.id
		},
	});
	return res.responseSuccess(ingredient);
};

const serializer = (params) => {
	const { ingredient } = serialization;
	return serialization.do(params, ingredient);
};


export default {
	view,
	middleware: [
	]
};