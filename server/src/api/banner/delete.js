import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";


/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const { id } = serializer(req.required(["id"]));
	const banner = await prisma.banner.delete({
		where: {
			id,
		},
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
		}
	});
	res.responseSuccess(banner);
};

const serializer = (params) => {
	const { banner } = serialization;
	return serialization.do(params, banner);
};

export default {
	view,
	middleware: [
		onlyAdmin
	]
};