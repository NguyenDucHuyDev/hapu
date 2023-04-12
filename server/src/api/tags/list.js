import { PAGE_SIZES } from "#root/types.js";
import { onlyAdmin } from "#src/middleware/authentication.js";
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
		{ field: "per_page", default: PAGE_SIZES.TAGS_PER_PAGE }
	];
	const only = serializer(req.only(paramsOnly));
	const take = only.per_page;
	const paramsSearch = req.only([
		"q"
	]);
	/**
	 * @type {import("@prisma/client").Prisma.TagWhereInput}
	 */
	const where = {
	};
	if(paramsSearch.q) {
		where.name = {
			contains: paramsSearch.q
		};
	}
	if(!req.ctx.admin) where.is_active = true;
	const result = await prisma.tag.findMany({
		skip: take * only.page - take,
		take,
		where,
		orderBy: {
			created_at: "desc"
		}
	});
	const count = await prisma.tag.count({
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
	middleware: []
};

export default {
	admin,
	user,
};