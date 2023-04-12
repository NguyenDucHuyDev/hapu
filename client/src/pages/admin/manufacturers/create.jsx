import { categoryPageForm } from "../categories/edit"

const createManufacturersPage = () => {
  return categoryPageForm({
    path: "/admin/manufacturer/",
    isCreate: true,
    label: "Tên nhà sản xuất",
    title: "Thêm mới nhà sản xuất",
  })
}

export default createManufacturersPage