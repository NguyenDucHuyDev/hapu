import { categoryPageForm } from "../categories/edit"

const createTagsPage = () => {
  return categoryPageForm({
    path: "/admin/tags/",
    isCreate: true,
    label: "Tên tag",
    title: "Tạo mới tag",
  })
}

export default createTagsPage