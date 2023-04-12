import { onlyUser } from "#src/middleware/authentication.js";
// import serialization from "#src/utils/serialization.js";
import { v4 as uuidv4 } from "uuid";
/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const prisma = req.prisma;
	const required = req.required([
		"carts_id",
		"payment_type"
	]);
	const only = req.only([
		"note",
		"coupon_code"
	]);
	const carts_id = required.carts_id;
	const carts = await prisma.cart.findMany({
		where: {
			id: {
				in: carts_id,
			},
			user_id: parseInt(req.ctx.user.id),
		},
		include: {
			product: true,
		}
	});
	if(!carts.length) {
		throw new Error(JSON.stringify({
			http_code: 406,
			message: "Giỏ hàng không tồn tại"
		}));
	}
	let total_price = 0;
	const bill_id = uuidv4();
	/**
	 * @type {import("@prisma/client").Order[]}
	 */
	const orders_param = [];
	const products_id = [];
	for (const cart of carts) {
		if(cart.product.status !== "READY") {
			throw new Error(JSON.stringify({
				http_code: 406,
				message: "Sản phẩm này hiện tại không khả dụng!"
			}));
		}
		if(cart.quantity > 0) {
			const order_total_price = cart.quantity * parseInt(cart.product.unit_price);
			total_price += order_total_price;
			orders_param.push({
				product_id: cart.product.id,
				unit_price: cart.product.unit_price,
				total_price: order_total_price,
				quantity: cart.quantity,
				user_id: req.ctx.user.id,
			});
			products_id.push(cart.product.id);
		}
	}
	let final_price = total_price;
	let coupon;
	let discount_price;
	let coupon_code;
	if(only.coupon_code) {
		coupon = await prisma.coupon.findFirst({
			where: {
				coupon_code: only.coupon_code,
				is_active: true,
				used: {
					lt: prisma.coupon.fields.quantity
				}
			}
		});
		if(coupon) {
			final_price = total_price - parseInt(coupon.discount_price);
			discount_price = coupon.discount_price;
			coupon_code = coupon.coupon_code;
		}
	}
	if(final_price <=0) final_price = 0;
	/**
	 * @type {import("@prisma/client").Prisma.BillCreateInput}
	 */
	const params = {
		relation_id: bill_id,
		total_price,
		final_price,
		discount_price,
		coupon_code,
		payment_type: required.payment_type,
		user_id: req.ctx.user.id,
		note: only.note,
		order: {
			create: orders_param
		}
	};
	const transactions = [
		prisma.bill.create({
			data: params
		}),
		prisma.cart.deleteMany({
			where: {
				id: {
					in: carts_id
				}
			}
		}),
		prisma.product.updateMany({
			where: {
				id: {
					in: products_id
				}
			},
			data: {
				sold: {
					increment: 1
				}
			}
		})
	];
	if(coupon) transactions.push(
		prisma.coupon.update({
			where: {
				id: coupon.id
			},
			data: {
				used: {
					increment: 1,
				}
			}
		})
	);
	const [ bill, ] = await prisma.$transaction(transactions);
	return res.responseSuccess(bill);
};

// const serializer = (params) => {
// 	const { bill } = serialization;
// 	return serialization.do(params, bill);
// };


export default {
	view,
	middleware: [
		onlyUser,
	]
};