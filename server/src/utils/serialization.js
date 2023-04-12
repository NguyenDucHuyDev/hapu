import md5 from "md5";
import buildSlug from "slug";
const serialization = {
	user: {
		id (value) {
			return parseInt(value);
		},
		password (value) {
			return value ? md5(value) : value;
		},
		birthday (value) {
			return new Date(value);
		},
	},
	cart: {
		id (value) {
			return parseInt(value);
		},
		product_id (value) {
			return parseInt(value);
		},
		quantity (value) {
			return parseInt(value);
		},
		user_id (value) {
			return parseInt(value);
		}
	},
	product: {
		id (value) {
			return parseInt(value);
		},
		unit_price (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.name ? buildSlug(params.name) : value;
		},
		tags (value) {
			if(value && value.constructor === Array) {
				/**
				 * @type {import("@prisma/client").Prisma.TagsOnProductsUncheckedCreateNestedManyWithoutProductInput}
				 */
				const res = {
					create:  value.map((_) => ({ tag_id: _ }))
				};
				if(res.create.length) return res;
				else return {
					set: []
				};
			}
			return value;
		},
		category_id(value) {
			return value ? parseInt(value) : value;
		},
		ingredient_id(value) {
			return value ? parseInt(value) : value;
		},
		manufacturer_id(value) {
			return value ? parseInt(value) : value;
		},
		tag_id(value) {
			return parseInt(value);
		},
		import_prices(value) {
			return value ? parseInt(value) :  value;
		},
	},
	tag: {
		id (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.name ? buildSlug(params.name) : value;
		}
	},
	category: {
		id (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.name ? buildSlug(params.name) : value;
		}
	},
	ingredient: {
		id (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.name ? buildSlug(params.name) : value;
		}
	},
	manufacturer: {
		id (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.name ? buildSlug(params.name) : value;
		}
	},
	news: {
		id (value) {
			return parseInt(value);
		},
		slug (value, params) {
			return params.title ? buildSlug(params.title) : value;
		},
		new_type_id (value) {
			return parseInt(value);
		}
	},
	bill: {
		id (value) {
			return parseInt(value);
		},
		product_id(value) {
			return parseInt(value);
		}
	},
	banner: {
		id (value) {
			return parseInt(value);
		},
	},
	coupon: {
		id (value) {
			return parseInt(value);
		},
		discount_price (value) {
			return parseInt(value);
		},
		quantity (value) {
			return parseInt(value);
		},
	},
	defaultParams: {
		page (value) {
			return parseInt(value);
		},
		per_page (value) {
			return parseInt(value);
		}
	},
	do (params, sourceSerialization) {
		const result = {};
		for (const param in params) {
			if(Object.prototype.hasOwnProperty.call(sourceSerialization, param)) {
				const target = sourceSerialization[param];
				if(target.constructor === Function) {
					result[param] = target(params[param], params);
					continue;
				}
			}
			result[param] = params[param];
		}
		return result;
	}
};

export default serialization;