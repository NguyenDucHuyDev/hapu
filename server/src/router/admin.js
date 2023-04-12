
import login from "#src/api/admin/login.js";
import category from "#src/api/category/index.js";
import product from "#src/api/product/index.js";
import ingredients from "#src/api/ingredients/index.js";
import manufacturer from "#src/api/manufacturer/index.js";
import news from "#src/api/news/index.js";
import order from "#src/api/order/index.js";
import user from "#src/api/user/index.js";
import tags from "#src/api/tags/index.js";
import banner from "#src/api/banner/index.js";
import uploadImage from "#src/api/admin/upload/image.js";
import info from "#src/api/admin/info.js";
import coupon from "#src/api/coupon/index.js";

/**
 * @type {(import("#root/types.js").Router)[]}
 */

const routers = [
	{
		path: "/api/admin/login",
		method: "post",
		controller: login
	},
	{
		path: "/api/admin/category",
		controller: category.create,
		method: "post",
	},
	{
		path: "/api/admin/category",
		controller: category.read,
		method: "get",
	},
	{
		path: "/api/admin/category/list",
		controller: category.list.admin,
		method: "get",
	},
	{
		path: "/api/admin/category",
		controller: category.update,
		method: "patch",
	},
	{
		method: "post",
		path: "/api/admin/product",
		controller: product.create
	},
	{
		method: "patch",
		path: "/api/admin/product",
		controller: product.update
	},
	{
		method: "delete",
		path: "/api/admin/product",
		controller: product._delete
	},
	{
		method: "get",
		path: "/api/admin/product/list",
		controller: product.list.admin
	},
	{
		method: "get",
		path: "/api/admin/product/",
		controller: product.read.admin
	},
	{
		method: "post",
		path: "/api/admin/ingredients",
		controller: ingredients.create
	},
	{
		method: "get",
		path: "/api/admin/ingredients/list",
		controller: ingredients.list.admin
	},
	{
		method: "get",
		path: "/api/admin/ingredients/",
		controller: ingredients.read
	},
	{
		method: "patch",
		path: "/api/admin/ingredients/",
		controller: ingredients.update
	},
	{
		method: "post",
		path: "/api/admin/manufacturer",
		controller: manufacturer.create
	},
	{
		method: "get",
		path: "/api/admin/manufacturer/list",
		controller: manufacturer.list.admin
	},
	{
		method: "get",
		path: "/api/admin/manufacturer/",
		controller: manufacturer.read
	},
	{
		method: "patch",
		path: "/api/admin/manufacturer/",
		controller: manufacturer.update
	},
	{
		method: "post",
		path: "/api/admin/news",
		controller: news.create
	},
	{
		method: "patch",
		path: "/api/admin/news",
		controller: news.update
	},
	{
		method: "delete",
		path: "/api/admin/news",
		controller: news._delete
	},
	{
		method: "get",
		path: "/api/admin/news",
		controller: news.read.admin
	},
	{
		method: "get",
		path: "/api/admin/news/list",
		controller: news.list.admin
	},
	{
		method: "patch",
		path: "/api/admin/order/",
		controller: order.update
	},
	{
		method: "get",
		path: "/api/admin/order/",
		controller: order.read.admin
	},
	{
		method: "get",
		path: "/api/admin/order/list",
		controller: order.list.admin
	},
	{
		method: "get",
		path: "/api/admin/user/list",
		controller: user.list
	},
	{
		method: "get",
		path: "/api/admin/user/",
		controller: user.info.admin
	},
	{
		method: "patch",
		path: "/api/admin/user/",
		controller: user.update.admin
	},
	{
		method: "post",
		path: "/api/admin/tags/",
		controller: tags.create
	},
	{
		method: "patch",
		path: "/api/admin/tags/",
		controller: tags.update
	},
	{
		method: "get",
		path: "/api/admin/tags/list",
		controller: tags.list.admin
	},
	{
		method: "delete",
		path: "/api/admin/tags/",
		controller: tags._delete
	},
	{
		method: "get",
		path: "/api/admin/tags/",
		controller: tags.read
	},
	{
		method: "get",
		path: "/api/admin/banner/list",
		controller: banner.list.admin
	},
	{
		method: "post",
		path: "/api/admin/banner/",
		controller: banner.create
	},
	{
		method: "get",
		path: "/api/admin/banner/",
		controller: banner.read
	},
	{
		method: "patch",
		path: "/api/admin/banner/",
		controller: banner.update
	},
	{
		method: "delete",
		path: "/api/admin/banner/",
		controller: banner._delete
	},
	{
		method: "post",
		path: "/api/admin/upload/image",
		controller: uploadImage
	},
	{
		method: "get",
		path: "/api/admin/me",
		controller: info
	},
	{
		method: "post",
		path: "/api/admin/coupon",
		controller: coupon.create
	},
	{
		method: "get",
		path: "/api/admin/coupon/list",
		controller: coupon.list
	},
	{
		method: "patch",
		path: "/api/admin/coupon",
		controller: coupon.update
	},
	{
		method: "delete",
		path: "/api/admin/coupon",
		controller: coupon._delete
	},
	{
		method: "get",
		path: "/api/admin/coupon",
		controller: coupon.read.admin
	},
];

export default routers;