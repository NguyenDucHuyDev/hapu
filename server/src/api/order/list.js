import { onlyAdmin, onlyUser } from "#src/middleware/authentication.js";
import { PAGE_SIZES } from "#root/types.js";
import serialization from "#src/utils/serialization.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	/**
   * @type {(import("#root/types.js").OnlyParamDefault)[]}
   */
	const paramsOnly = [
		{ field: "page", default: 1 },
		{ field: "per_page", default: PAGE_SIZES.ORDER_PER_PAGE },
		"shipping_status",
	];
	const only = serializer(req.only(paramsOnly));
	const take = only.per_page;
	/**
   * @type {import("@prisma/client").Prisma.BillWhereInput}
   */
	const where = {
	};
	if(req.ctx.user) {
		where.user_id = req.ctx.user.id;
	}
	if(only.shipping_status) {
		where.shipping_status = only.shipping_status;
	}
	const result = await prisma.bill.findMany({
		skip: take * only.page - take,
		take,
		where,
		orderBy: {
			created_at: "desc"
		},
		include: {
			user: true,
		}
	});
	const count = await prisma.bill.count({
		where,
	});
	const meta = {
		total_object: count,
		current_page: only.page,
		per_page: take,
		end_page: Math.ceil(count/take)
	};
	return res.responseSuccess(result,meta);
};

const serializer = (params) => {
	const { defaultParams } = serialization;
	return serialization.do(params, defaultParams);
};

const admin = {
	view,
	middleware: [
		onlyAdmin
	]
};

const user = {
	view,
	middleware: [
		onlyUser
	]
};

export default {
	admin,
	user,
};