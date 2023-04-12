
import { responseFailed,responseSuccess } from "#src/utils/response.js";
import { required, only } from "#src/utils/request.js";
import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
/**
 * @typedef {"get" | "post" | "put" | "patch" | "delete" | "head"} Methods
 * 
 * @typedef RouterController
 * @property {import("express").Handler} view
 * @property {(import("express").Handler)[]} middleware
 * 
 * @typedef Router
 * @property {Methods} method
 * @property {String} path,
 * @property {RouterController} controller
 * 
 * @typedef OnlyParamDefault
 * @property {String} field
 * @property {*} default
 * 
 * @typedef RequestExtends
 * @property {Function} only
 * @property {Function} required
 * @property {RequestCtx} ctx
 * @property {import("@prisma/client").PrismaClient} prisma
 * @property {import("@aws-sdk/client-s3").S3Client} S3Client
 * 
 * @typedef Request
 * @type {import("express").Request & RequestExtends}
 * 
 * @typedef ResponseExtends
 * @property {Function} responseFailed
 * @property {Function} responseSuccess
 * 
 * @typedef Response
 * @type {import("express").Response & ResponseExtends}
 * 
 * @typedef RequestCtx
 * @property {import("@prisma/client").User} user
 * @property {import("@prisma/client").Admin} admin
 */

BigInt.prototype.toJSON = function () {
	return parseInt(this.toString());
};
/**
 * @this {import("express")}
 */

function setPrototypeResponse () {
	/**
	 * @type {Response}
	 */
	const response = this.response;
	response.responseFailed = responseFailed;
	response.responseSuccess = responseSuccess;
}

const prisma = new PrismaClient();

const client = new S3Client({
	region: "ap-southeast-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});
/**
 * @this {import("express")}
 */
function setPrototypeRequest () {
	/**
	 * @type {Request}
	 */
	const request = this.request;
	request.prisma = prisma;
	request.S3Client = client;
	request.required = required;
	request.only = only;
}

/**
 * @enum
 * @readonly
 */
const PAGE_SIZES = {
	PRODUCT_PER_PAGE: 50,
	ORDER_PER_PAGE: 30,
	NEWS_PER_PAGE: 10,
	USER_PER_PAGE: 10,
	HOT_PRODUCT_PER_PAGE: 10,
	TAGS_PER_PAGE: 10,
};

export {
	setPrototypeResponse,
	setPrototypeRequest,
	PAGE_SIZES,
	prisma
};