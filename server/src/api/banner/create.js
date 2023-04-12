import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"image_url",
		"new_id"
	]);
	const params = serializer({
		...required,
	});
	const banner = await prisma.banner.create({
		data: params,
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
	return res.responseSuccess(banner);
};

const serializer = (params) => {
	const { banner } = serialization;
	return serialization.do(params, banner);
};


export default {
	view,
	middleware: [
		onlyAdmin,
	]
};