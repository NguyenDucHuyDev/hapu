import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import serialization from "#src/utils/serialization.js";

const prisma = new PrismaClient();

const serializer = (params) => {
	const { user } = serialization;
	return serialization.do(params, user);
};

const seed = async () => {
	for(let i = 0; i < 300; i++) {
		const params = serializer({
			address: faker.address.streetAddress(),
			birthday: faker.date.birthdate(),
			business_name: faker.company.name(),
			email: faker.internet.email(),
			full_name: faker.name.fullName(),
			number_phone: faker.phone.number(),
			password: "password",
			business_type: 1,
			city_id: 74,
		});
		await prisma.user.create({
			data: params
		});
	}
};

export default seed;