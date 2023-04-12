import { onlyAdmin } from "#src/middleware/authentication.js";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 * @returns 
 */

const view = async (req, res) => {
	return res.responseSuccess(req.ctx.admin);
};


export default {
	view: view,
	middleware: [
		onlyAdmin
	],
};