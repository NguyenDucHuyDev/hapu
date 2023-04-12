import { categoryPageForm } from "../categories/edit"

const editIngredientPage = () => {
  return categoryPageForm({
    path: "/admin/ingredients/",
    isCreate: false,
    label: "Tên hoạt chất",
    title: "Chỉnh sửa hoạt chất",
  })
}

export default editIngredientPage