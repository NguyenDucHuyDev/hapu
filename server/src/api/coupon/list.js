import { onlyAdmin } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const result = await prisma.coupon.findMany({
		where: {}
	});
	return res.responseSuccess(result);
};

export default {
	view,
	middleware: [
		onlyAdmin,
	]
};