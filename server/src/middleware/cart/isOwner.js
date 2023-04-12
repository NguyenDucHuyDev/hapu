import serialization from "#src/utils/serialization.js";
import checkOwner from "../isOwner.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const isOwner = async (req, res, next) => {
	const { id } = serializer(req.required(["id"]));
	const user_id = req.ctx.user.id;
	const canAccess = await checkOwner("cart", id, user_id);
	if(canAccess) {
		next();
	}
};

const serializer = (params) => {
	const { cart } = serialization;
	return serialization.do(params, cart);
};

export default isOwner;