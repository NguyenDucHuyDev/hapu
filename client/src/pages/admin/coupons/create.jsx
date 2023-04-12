import { couponPageForm } from "./edit";

const createCouponPage = () => {
  return couponPageForm({
    path: "/admin/coupon/",
    isCreate: true,
    title: "Tạo mới mã giảm giá"
  })
}

export default createCouponPage