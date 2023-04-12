import { onlyAdmin } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	const prisma = req.prisma;
	const result = await prisma.banner.findMany({
		where:{},
		include: {
			news: {
				select: {
					id: true,
					slug: true,
					title: true,
					new_type_id: true,
					created_at: true,
					updated_at: true,
				}
			}
		},
		orderBy: {
			created_at: "desc"
		}
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