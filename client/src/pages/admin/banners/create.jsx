import { editBannerPageForm } from "./edit";

const createBannerPage = () => {
  return editBannerPageForm({
    path: "/admin/banner/",
    isCreate: true,
    title: "Thêm banner",
  });
};

export default createBannerPage