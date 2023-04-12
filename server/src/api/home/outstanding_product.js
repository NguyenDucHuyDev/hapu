

/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const outstanding = await prisma.product.findMany({
		orderBy: {
			sold: "desc",
		},
		where: {
			is_outstanding: true,
		},
		include: {
			category: true,
			tags: {
				include: {
					tag: true
				}
			},
		}
	});
	return res.responseSuccess(outstanding);
};

export default {
	view,
	middleware: []
};