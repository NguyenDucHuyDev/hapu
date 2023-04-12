import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const types = [
	"Nhà thuốc",
	"Quầy thuốc",
	"Phòng khám",
	"Người tiêu dùng",
];
const seed = async () => {
	await prisma.businessType.createMany({
		data: types.map((_) => ({
			name: _
		}))
	});
};

export default seed;