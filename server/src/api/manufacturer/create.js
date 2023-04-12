import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"name",
		"is_active"
	]);
	const params = serializer({
		...required,
		slug: ""
	});
	const manufacturer = await prisma.manufacturer.create({
		data: params,
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
		onlyAdmin,
	]
};