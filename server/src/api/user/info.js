import { onlyAdmin, onlyUser } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	return res.responseSuccess(req.ctx.user);
};

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const viewAdmin = async (req, res) => {
	const prisma = req.prisma;
	const { id } = req.required([
		"id"
	]);
	const params = serializer({
		id,
	});
	const user = await prisma.user.findUnique({
		where: {
			id: params.id,
		}
	});
	return res.responseSuccess(user);
};

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

const user = {
	view,
	middleware: [
		onlyUser
	]
};

const admin = {
	view: viewAdmin,
	middleware: [
		onlyAdmin
	]
};

export default {
	user,
	admin,
};