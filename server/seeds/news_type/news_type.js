import { PrismaClient } from "@prisma/client";

const news_types_name = [
	"Thông báo",
	"Hướng dẫn",
	"Chia sẻ kinh nghiệm",
	"Thông tin nghành dược",
	"Câu hỏi thường gặp",
	"Giới thiệu",
	"Hoạt động nổi bật",
	"Sản phẩm mới",
	"Thông tin khác",
	"Thông tin sức khỏe",
	"Tin khuyến mại",
	"Tin y học",
	"Tuyển dụng",
];

const seed = async () => {
	const prisma = new PrismaClient();
	await prisma.newType.createMany({
		data: news_types_name.map((_) => ({
			name: _,
		}))
	});
};

export default seed;