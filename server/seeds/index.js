import city from "./city/city.js";
import admin from "./admin/admin.js";
import business_type from "./business_type/business_type.js";
import news_type from "./news_type/news_type.js";
import user from "./user/user.js";

(async () => {
	await city();
	await admin();
	await business_type();
	await news_type();
	await user();
})();