
/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	const prisma = req.prisma;
	const result = await prisma.businessType.findMany({
		where:{}
	});
	return res.responseSuccess(result);
};

export default {
	view,
	middleware: [
	]
};