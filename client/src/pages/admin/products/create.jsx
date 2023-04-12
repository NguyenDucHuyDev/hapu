import { editProductPageForm } from "./edit";

const createProductPage = () => {
  return editProductPageForm({
    path: "/admin/product/",
    isCreate: true,
    title: "Tạo mới sản phẩm",
  });
};

export default createProductPage