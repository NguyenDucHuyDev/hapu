import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import "express-async-errors";
import fileUpload from "express-fileupload";
import cors from "cors";
import routers from "./src/router/index.js";
import "./types.js";
import { setPrototypeRequest, setPrototypeResponse } from "./types.js";
dotenv.config();
const app = express();

/**
 * Binding the prototype for express
 */

setPrototypeResponse.call(app);
setPrototypeRequest.call(app);

app.use((req, res, next) =>  {
	req.ctx = {};
	next();
});

/**
 * //TODO Using libraries for expressJs
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable cors for all origins
app.use(fileUpload());

/**
 // TODO Dynamic router, middleware
 * Author: Ily1606
 */
routers.forEach((router) => {
	app[router.method](router.path, ...router.controller.middleware, router.controller.view);
});

/**
 * // TODO Try catch errors from expressjs
 */

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
	console.log(err);
	let message = err.message;
	let errors = [];
	let http_code = 500;
	try {
		const _ = JSON.parse(err.message);
		message = _.message;
		errors = _.errors;
		http_code = _.http_code;
	}
	catch(e) {}
	res.responseFailed(http_code, message, {errors: errors}).end();
});

export default app;