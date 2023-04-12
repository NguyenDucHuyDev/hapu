import { onlyAdmin, onlyUser } from "#src/middleware/authentication.js";
import isOwner from "#src/middleware/bill/isOwner.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
		* @type {(import("@prisma/client").Prisma.BillScalarFieldEnum)[]}
		*/
	const required_field = [
		"id",
	];
	const required = req.required(required_field);
	const params = serializer({
		...required,
	});
	const bill = await prisma.bill.findUnique({
		where: {
			id: params.id
		},
		include: {
			order: {
				include: {
					product: true
				}
			},
			user: true,
		}
	});
	return res.responseSuccess(bill);
};

const serializer = (params) => {
	const { bill } = serialization;
	return serialization.do(params, bill);
};

const user = {
	view,
	middleware: [
		onlyUser,
		isOwner,
	]
};

const admin = {
	view,
	middleware: [
		onlyAdmin,
	]
};

export default {
	admin,
	user,
};