import { onlyAdmin } from "#src/middleware/authentication.js";
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
		{ field: "per_page", default: PAGE_SIZES.USER_PER_PAGE }
	];
	const only = serializer(req.only(paramsOnly));
	const take = only.per_page;
	/**
	 * @type {import("@prisma/client").Prisma.UserWhereInput}
	 */
	const where = {
	};
	const result = await prisma.user.findMany({
		skip: take * only.page - take,
		take,
		where,
		orderBy: {
			created_at: "desc"
		}
	});
	const count = await prisma.user.count({
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

export default {
	view,
	middleware: [
		onlyAdmin,
	]
};