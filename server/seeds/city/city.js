import { PrismaClient } from "@prisma/client";
import fs from "fs";

const city = JSON.parse(fs.readFileSync("seeds/city/city.json").toString());
const prisma = new PrismaClient();

const seed = async () => {
	const _city = city.map((_) => ({
		id: _.code,
		name: _.name
	}));
	await prisma.city.createMany({
		data: _city
	});
};

export default seed;