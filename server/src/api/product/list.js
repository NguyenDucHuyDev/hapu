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
		{ field: "per_page", default: PAGE_SIZES.PRODUCT_PER_PAGE }
	];
	const only = serializer(req.only(paramsOnly));
	const take = only.per_page;
	/**
	 * @type {(import("@prisma/client").Prisma.ProductScalarFieldEnum)[]}
	 */
	const only_fields = [
		"q",
		"category_id",
		"ingredient_id",
		"manufacturer_id",
		"tag_id"
	];
	const paramsSearch = serializer(req.only(only_fields));
	/**
	 * @type {import("@prisma/client").Prisma.ProductWhereInput}
	 */
	const where = {
	};
	if(paramsSearch.q) {
		where.name = {
			contains: paramsSearch.q
		};
	}
	if(!req.ctx.admin){
		where.AND = [
			{
				OR: [
					{
						category: {
							is_active: true
						},
					},
					{
						category_id: null
					}
				]
			},
			{
				OR: [
					{
						ingredient: {
							is_active: true
						},
					},
					{
						ingredient_id: null
					}
				]
			},
			{
				OR: [
					{
						manufacturer: {
							is_active: true
						},
					},
					{
						manufacturer_id: null
					}
				]
			}
		];
		where.tags = {
			every: {
				tag: {
					is_active: true
				}
			}
		};
	}
	if(paramsSearch.category_id) {
		where.category_id = paramsSearch.category_id;
	}
	if(paramsSearch.ingredient_id) {
		where.ingredient_id = paramsSearch.ingredient_id;
	}
	if(paramsSearch.manufacturer_id) {
		where.manufacturer_id = paramsSearch.manufacturer_id;
	}
	if(paramsSearch.tag_id) {
		where.tags.some = {
			tag_id: paramsSearch.tag_id
		};
	}
	
	const result = await prisma.product.findMany({
		skip: take * only.page - take,
		take,
		where,
		include: {
			tags: {
				include: {
					tag: true
				}
			},
			category: true,
			ingredient: true,
			manufacturer: true,
		},
		orderBy: {
			created_at: "desc"
		}
	});
	const count = await prisma.product.count({
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
	const { product, defaultParams } = serialization;
	return serialization.do(params, {...product, ...defaultParams});
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
	]
};

export default {
	user,
	admin
};