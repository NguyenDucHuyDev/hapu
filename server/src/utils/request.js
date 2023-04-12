/**
 * 
 * @this {import("#root/types.js").Request}
 * @param {String[]|(import("#root/types.js").OnlyParamDefault)[]} params 
 * @returns {Object}
 */
function only(params) {
	const _params = {
		...this.body,
		...this.files,
		...this.params,
		...this.query,
	};
	const result = {};
	params.forEach(_ => {
		if(_.constructor === Object) {
			/**
			 * @type {(import("#root/types.js").OnlyParamDefault)}
			 */
			const fieldParam = _;
			if(Object.prototype.hasOwnProperty.call(_params, fieldParam.field)) {
				result[fieldParam.field] = _params[fieldParam.field];
			}
			else {
				result[_.field] = _.default;
			}
		}
		else {
			if(_params[_] !== undefined) result[_] = _params[_];
		}
	});
	return result;
}

/**
 * 
 * @this {import("#root/types.js").Request} params 
 * @param {String[]} params
 * @returns {Object}
 */
function required(params) {
	const _params = {
		...this.body,
		...this.files,
		...this.params,
		...this.query
	};
	const res = {};
	params.forEach(_ => {
		if(Object.prototype.hasOwnProperty.call(_params, _)) {
			res[_] = _params[_];
		}
		else {
			const errors = [{
				missing_params: _
			}];
			throw new Error(JSON.stringify({errors, message: "Vui lòng điền đầy đủ thông tin", http_code: 406}));
		}
	});
	return res;
}

export {
	only,
	required,
};
