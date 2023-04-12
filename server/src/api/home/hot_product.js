

/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const hotProduct = await prisma.product.findMany({
		orderBy: {
			sold: "desc",
		},
		where: {
			is_hot: true,
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
	return res.responseSuccess(hotProduct);
};

export default {
	view,
	middleware: []
};