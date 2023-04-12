import { categoryPageForm } from "../categories/edit"

const editIngredientPage = () => {
  return categoryPageForm({
    path: "/admin/ingredients/",
    isCreate: true,
    label: "Tên hoạt chất",
    title: "Tạo mới hoạt chất",
  })
}

export default editIngredientPage