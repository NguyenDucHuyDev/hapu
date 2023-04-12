import { editNewsPageForm } from "./edit";

const createNewsPage = () => {
  return editNewsPageForm({
    path: "/admin/news/",
    isCreate: true,
    title: "Tạo bài viết"
  })
}

export default createNewsPage