import { prisma } from "#root/types.js";
/**
 * 
 * @param {import("@prisma/client").Prisma.ModelName}	model
 * @param {import("#root/types.js").Request} 					req 
 * @param {import("#root/types.js").Response} 				res 
 */
const isOwner = async (model, id, user_id) => {
	const isExist = await checkOwner(model, id, user_id);
	if(isExist) {
		return true;
	}
	throw new Error(JSON.stringify({
		message: "Bạn không thể truy cập vào tài nguyên này!",
		http_code: 403
	}));
};

/**
 * 
 * @param   {import("@prisma/client").Prisma.ModelName}
 * @param   {BigInt}            user_id 
 * @returns {Promise<Boolean>} 
 */
const checkOwner = async (model, id, user_id) => {
	const result = await prisma[model].findFirst({
		where: {
			user_id,
			id,
		}
	});
	return result ? true : false;
};

export default isOwner;