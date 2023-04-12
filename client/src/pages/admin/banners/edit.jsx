import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Space,
  Spin,
  Typography,
  Col,
  Select,
  Upload,
  Image,
} from "antd";

import { SHIPPING_STATUS } from "../../../../type";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";

const onFinishFailed = () => {};

const { Text } = Typography;
const urlAPI = import.meta.env.VITE_MY_API_PATH;

const editBannerPage = () => {
  return editBannerPageForm({
    path: "/admin/banner/",
    isCreate: false,
    title: "Chỉnh sửa thông tin",
  });
};

let timeout = null;

const fetchNewsList = (q, callback ) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  timeout = setTimeout(() => {
    axiosAdmin
      .get("/admin/news/list", {
        params: {
          title: q,
        },
      })
      .then((res) =>
        res.data.data.map((newInfo) => ({
          label: newInfo.title,
          value: newInfo.id,
        }))
      )
      .then((data) => {
        callback(data);
      });
  }, 300);
};

const editBannerPageForm = ({ path, isCreate, title }) => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [infoBanner, setInfoBanner] = useState({});
  const [urlImage, setUrlImage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [newsListData, setNewsListData] = useState([]);
  const [value, setValue] = useState();
  const handleSearch = (newValue) => {
    if (newValue) {
      fetchNewsList(newValue, setNewsListData);
    } else {
      setNewsListData([]);
    }
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  let id;
  if (!isCreate) {
    id = useParams().id;
  }
  const getData = async (id) => {
    setLoading(true);
    const res = await axiosAdmin
      .get(path, {
        params: {
          id,
        },
      })
      .finally(() => setLoading(false));
    setUrlImage(res.data.data.image_url);
    setNewsListData([{
      label: res.data.data.news.title,
      value: res.data.data.news.id,
    }])
    setInfoBanner(res.data.data);
  };

  const handleUpload = (data) => {
    if (data.file.status === "done") {
      const url = data.file.response.data.url;
      setUrlImage(url);
    }
  };

  const onFinish = async (data) => {
    if (!urlImage) {
      api.error({
        message: "Vui lòng upload ảnh đính kèm sản phẩm!",
        duration: 5,
      });
      return;
    }
    setLoadingForm(true);
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const res = await adapter(
      path,
      {
        ...data,
        image_url: urlImage,
      },
      {
        params: {
          id,
        },
      }
    )
      .catch((e) => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setLoadingForm(false);
      });
    if (res.data.status) {
      api.success({
        message: isCreate ? "Tạo mới thành công" : "Cập nhật thành công",
        duration: 5,
      });
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
  };
  useEffect(() => {
    if (!isCreate) getData(id);
  }, []);
  return (
    <>
      {contextHolder}
      <Divider className="!text-lg" orientation="left">
        {title}
      </Divider>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spin tip="Đang tải" />
        </div>
      ) : (
        <>
          {!isCreate && (
            <>
              <Space direction="vertical">
                <Text type="secondary">Ngày mua: {infoBanner.created_at}</Text>
                <Text type="secondary">
                  Cập nhật lần cuối lúc: {infoBanner.updated_at}
                </Text>
              </Space>
            </>
          )}
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={infoBanner}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{
              marginTop: "10px",
            }}
          >
            <div>Ảnh banner</div>
            <Form.Item>
              <Upload.Dragger
                accept="image/*"
                action={`${urlAPI}/admin/upload/image`}
                listType="picture"
                headers={{
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token_admin"
                  )}`,
                }}
                maxCount={1}
                onChange={handleUpload}
                defaultFileList={
                  urlImage
                    ? [
                        {
                          status: "done",
                          url: urlImage,
                          thumbUrl: urlImage,
                        },
                      ]
                    : []
                }
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả vào khu vực này để upload
                </p>
                <p className="ant-upload-hint">Vui lòng chỉ upload 1 ảnh.</p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item
              label="Gắn link bài viết"
              name="new_id"
            >
              <Select
                showSearch
                placeholder="Tiêu đề bài viết"
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                options={newsListData}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingForm}
                className="bg-blue-500"
              >
                {isCreate ? "Tạo mới" : "Cập nhật"}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export { editBannerPageForm };

export default editBannerPage;
