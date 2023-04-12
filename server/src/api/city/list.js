
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
	const result = await prisma.city.findMany({
		where:{}
	});
	return res.responseSuccess(result);
};

export default {
	view,
	middleware: [
	]
};