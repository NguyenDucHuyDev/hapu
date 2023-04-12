import serialization from "#src/utils/serialization.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
	const param = serializer({
		email: "admin@ily1606.dev",
		password: "Admin@123456",
	});
	await prisma.admin.create({
		data: param
	});
};

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

export default seed;