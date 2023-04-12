import { onlyAdmin, onlyUser } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types").Request} req 
 * @param {import("#root/types").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
   * @type {(import("@prisma/client").Prisma.UserScalarFieldEnum)[]}
   */
	const only_fields = [
		"email", 
		"password", 
		"full_name", 
		"number_phone",
		"birthday", 
		"business_type", 
		"city_id", 
		"address", 
		"business_name", 
		"user_referer"
	];
	const only = req.only(only_fields);
	let params = serializer(only);
	const where = {};
	let id; 
	if(req.ctx.user) {
		id = req.ctx.user.id;
	}
	else {
		id = req.required(["id"]).id;
	}
	params = serializer({
		...only,
		id
	});
	where.id = id;
	const user = await prisma.user.update({
		where,
		data: params
	});
	return res.responseSuccess(user);
};

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

const admin = {
	view,
	middleware: [
		onlyAdmin,
	]
};

const user = {
	view,
	middleware: [
		onlyUser,
	]
};

export default {
	admin,
	user
};