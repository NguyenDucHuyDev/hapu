import { categoryPageForm } from "../categories/edit"

const editManufacturersPage = () => {
  return categoryPageForm({
    path: "/admin/manufacturer/",
    isCreate: false,
    label: "Tên nhà sản xuất",
    title: "Chỉnh sửa nhà sản xuất",
  })
}

export default editManufacturersPage