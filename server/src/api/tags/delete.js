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
	const [ ,tag ] = await prisma.$transaction([
		prisma.tagsOnProducts.deleteMany({
			where: {
				tag_id: id
			}
		}),
		prisma.tag.delete({
			where: {
				id,
			},
		})
	]);
	res.responseSuccess(tag);
};

const serializer = (params) => {
	const { tag } = serialization;
	return serialization.do(params, tag);
};

export default {
	view,
	middleware: [
		onlyAdmin
	]
};