import { onlyAdmin } from "#src/middleware/authentication.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const { id } = req.required([
		"id"
	]);
	/**
   * @type {(import("@prisma/client").Prisma.BillScalarFieldEnum)[]}
   */
	const onlyField = [
		"note",
		"number_phone",
		"quantity",
		"shipping_address",
		"shipping_status",
	];
	const only = req.only(onlyField);
	const params = serializer({
		id,
		...only,
	});
	const bill = await prisma.bill.update({
		where: {
			id: params.id
		},
		data: params,
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

export default {
	view,
	middleware: [
		onlyAdmin,
	]
};