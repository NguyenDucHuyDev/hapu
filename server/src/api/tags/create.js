import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";


/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"name",
		"is_active",
	]);
	const params = serializer({
		...required,
		slug: "",
	});
	const tag = await prisma.tag.create({
		data: params
	});
	return res.responseSuccess(tag);
};

const serializer = (params) => {
	const { tag } = serialization;
	return serialization.do(params, tag);
};


export default {
	view,
	middleware: [
		onlyAdmin,
	]
};