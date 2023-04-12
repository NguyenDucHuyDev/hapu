import { onlyAdmin } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	const prisma = req.prisma;
	/**
   * @type {import("#src/utils/request").ParamDefault}
   */
	const where = {};
	if(!req.ctx.admin) where.is_active = true;
	const result = await prisma.category.findMany({
		where,
	});
	return res.responseSuccess(result);
};

const admin = {
	view,
	middleware: [
		onlyAdmin
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