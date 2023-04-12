import login from "#src/api/home/login.js";
import register from "#src/api/home/register.js";
import category from "#src/api/category/index.js";
import product from "#src/api/product/index.js";
import ingredients from "#src/api/ingredients/index.js";
import manufacturer from "#src/api/manufacturer/index.js";
import city from "#src/api/city/list.js";
import businessType from "#src/api/business_type/list.js";
import cart from "#src/api/cart/index.js";
import user from "#src/api/user/index.js";
import order from "#src/api/order/index.js";
import news from "#src/api/news/index.js";
import news_type from "#src/api/news_type/index.js";
import hot_product from "#src/api/home/hot_product.js";
import outstanding_product from "#src/api/home/outstanding_product.js";
import banner from "#src/api/banner/index.js";
import coupon from "#src/api/coupon/index.js";
import tags from "#src/api/tags/index.js";


/**
 * @type {(import("#root/types.js").Router)[]}
 */
const routers = [
	{
		method: "post",
		path: "/api/login",
		controller: login
	},
	{
		method: "post",
		path: "/api/register",
		controller: register
	},
	{
		method: "get",
		path: "/api/category/list",
		controller: category.list.user
	},
	{
		method: "get",
		path: "/api/category",
		controller: category.read
	},
	{
		method: "get",
		path: "/api/ingredients/list",
		controller: ingredients.list.user
	},
	{
		method: "get",
		path: "/api/ingredients",
		controller: ingredients.read
	},
	{
		method: "get",
		path: "/api/manufacturer/list",
		controller: manufacturer.list.user
	},
	{
		method: "get",
		path: "/api/manufacturer",
		controller: manufacturer.read
	},
	{
		method: "get",
		path: "/api/product/list",
		controller: product.list.user
	},
	{
		method: "get",
		path: "/api/product",
		controller: product.read.user
	},
	{
		method: "get",
		path: "/api/product/hot",
		controller: hot_product
	},
	{
		method: "get",
		path: "/api/product/outstanding",
		controller: outstanding_product
	},
	{
		method: "get",
		path: "/api/city/list",
		controller: city
	},
	{
		method: "get",
		path: "/api/business_type/list",
		controller: businessType
	},
	{
		method: "post",
		path: "/api/cart",
		controller: cart.create
	},
	{
		method: "get",
		path: "/api/cart/list",
		controller: cart.list
	},
	{
		method: "patch",
		path: "/api/cart/",
		controller: cart.update
	},
	{
		method: "delete",
		path: "/api/cart/",
		controller: cart._delete
	},
	{
		method: "get",
		path: "/api/user/",
		controller: user.info.user
	},
	{
		method: "post",
		path: "/api/order/",
		controller: order.create
	},
	{
		method: "get",
		path: "/api/order/list",
		controller: order.list.user
	},
	{
		method: "get",
		path: "/api/order/",
		controller: order.read.user
	},
	{
		method: "get",
		path: "/api/news/list",
		controller: news.list.user
	},
	{
		method: "get",
		path: "/api/news/",
		controller: news.read.user
	},
	{
		method: "get",
		path: "/api/news_type/list",
		controller: news_type.list,
	},
	{
		method: "get",
		path: "/api/banner/list",
		controller: banner.list.user,
	},
	{
		method: "get",
		path: "/api/coupon",
		controller: coupon.read.user
	},
	{
		method: "get",
		path: "/api/tag/list",
		controller: tags.list.user
	},
	{
		method: "get",
		path: "/api/tag/",
		controller: tags.read
	},
];

export default routers;