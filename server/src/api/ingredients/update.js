import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required(["id"]);
	const only = req.only(["name", "is_active"]);
	const params = serializer({
		...required,
		...only,
	});
	const ingredient = await prisma.ingredient.update({
		where: {
			id: params.id
		},
		data: params
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
		onlyAdmin,
	]
};