import { onlyUser } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	const prisma = req.prisma;
	const result = await prisma.cart.findMany({
		where:{
			user_id: req.ctx.user.id
		},
		include: {
			product: {
				include: {
					category: true,
					tags: {
						include: {
							tag: true
						}
					},
				}
			},
		}
	});
	return res.responseSuccess(result);
};

export default {
	view,
	middleware: [
		onlyUser
	]
};