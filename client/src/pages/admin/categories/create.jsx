import { categoryPageForm } from "./edit";

const createCategoryPage = () => {
  return categoryPageForm({
    path: "/admin/category/",
    isCreate: true,
    label: "Tên nhóm thuốc",
    title: "Tạo mới nhóm thuốc"
  })
}

export default createCategoryPage