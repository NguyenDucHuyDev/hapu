import { onlyAdmin } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const where = {};
	if(!req.ctx.admin) where.is_active = true;
	const result = await prisma.ingredient.findMany({
		where,
	});
	return res.responseSuccess(result);
};

const admin = {
	view,
	middleware: [
		onlyAdmin,
	]
};

const user = {
	view,
	middleware: []
};

export default {
	user,
	admin
};