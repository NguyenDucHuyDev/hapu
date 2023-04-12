import { decryptToken } from "../utils/jwt.js";
import { prisma } from "#root/types.js";

const getInfoUser = (userId) => {
	return prisma.user.findUnique({
		where: {
			id: userId
		}
	});
};

const getInfoAdmin = (adminId) => {
	return prisma.admin.findUnique({
		where: {
			id: adminId
		}
	});
};

const decodeToken = (token) => {
	const payload = decryptToken(token);
	return payload ? payload : null;
};

const isAuth = (token) => {
	const payload = decodeToken(token);
	return payload ? true : false;
};

const isAuthAdmin = (token) => {
	const payload = decodeToken(token);
	return payload && payload.isAdmin ? true : false;
};

const getToken = (req) => {
	const currentAuthorization = req.get("Authorization");
	if(currentAuthorization) {
		const token = currentAuthorization.split("Bearer ")[1];
		return token;
	}
	return null;
};

const onlyGuest = (req, res, next) => {
	const token = getToken(req);
	if(token && isAuth(token)) {
		throw new Error(JSON.stringify({message: "Trang này không dành cho người đã đăng nhập", http_code: 400}));
	}
	else {
		next();
	}
};

const onlyUser = async (req, res, next) => {
	const throwError = () => {
		throw new Error(JSON.stringify({message: "Trang này chỉ dành cho người dùng đã đăng nhập", http_code: 401}));
	};
	const token = getToken(req);
	if(token && isAuth(token)) {
		const userInfo = decodeToken(token).data;
		const user = req.ctx.user = await getInfoUser(userInfo.id);
		if(!user) throwError();
		next();
	}
	else{
		throwError();
	}
};

const onlyAdmin = async (req, res, next) => {
	const token = getToken(req);
	if(token && isAuthAdmin(token)) {
		const adminInfo = decodeToken(token).data;
		req.ctx.admin = await getInfoAdmin(adminInfo.id);
		next();
	}
	else{
		throw new Error(JSON.stringify({message: "Trang này chỉ dành cho quản trị viên", http_code: 401}));
	}
};

export {
	isAuth,
	onlyGuest,
	onlyUser,
	onlyAdmin,
};