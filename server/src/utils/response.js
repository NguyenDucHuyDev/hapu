
/**
 * @this {import("#root/types.js").Response}
 * @param {import("axios").HttpStatusCode} HTTP_Code 
 * @param {String} message 
 * @param {Object} options 
 * @returns 
 */
function responseFailed (HTTP_Code, message, { statusCode, errors } = {}) {
	this.status(HTTP_Code).send(responseFailedBody(statusCode, message, errors));
	return this;
};

function responseSuccess(data, meta) {
	this.send(responseSuccessBody(data, meta));
}

const responseFailedBody = (statusCode, message, errors) => {
	return {
		status: false,
		code: statusCode,
		message,
		errors,
	};
};

const responseSuccessBody = (data, meta) => {
	return {
		status: true,
		data,
		meta,
	};
};

export {
	responseFailed,
	responseSuccess,
};