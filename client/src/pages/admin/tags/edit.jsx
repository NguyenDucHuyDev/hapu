import { categoryPageForm } from "../categories/edit"

const editTagsPage = () => {
  return categoryPageForm({
    path: "/admin/tags/",
    isCreate: false,
    label: "Tên tag",
    title: "Chỉnh sửa tag",
  })
}

export default editTagsPage