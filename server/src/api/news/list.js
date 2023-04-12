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
		{ field: "per_page", default: PAGE_SIZES.NEWS_PER_PAGE },
		"title",
		"new_type_id"
	];
	const only = serializer(req.only(paramsOnly));
	const take = only.per_page;
	/**
	 * @type {import("@prisma/client").Prisma.NewWhereInput}
	 */
	const where = {
	};
	if(only.title) {
		where.title = {
			contains: only.title
		};
	}
	if(only.new_type_id) {
		where.new_type_id = only.new_type_id;
	}
	const result = await prisma.new.findMany({
		skip: take * only.page - take,
		take,
		where,
		orderBy: {
			created_at: "desc"
		},
		include: {
			newType: true
		}
	});
	const count = await prisma.new.count({
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
	const { defaultParams, news } = serialization;
	const data = serialization.do(params, news);
	return serialization.do(data, defaultParams);
};

const admin = {
	view,
	middleware: [
		onlyAdmin,
	]
};

const user = {
	view,
	middleware: []
};

export default {
	admin,
	user
};