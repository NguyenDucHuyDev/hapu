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
  DatePicker,
  Switch,
} from "antd";
import dayjs from "dayjs"
import { PRODUCT_STATUS } from "../../../../type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";
import { InboxOutlined } from "@ant-design/icons";

const onFinishFailed = () => {};

const { Text } = Typography;

const editProductPage = () => {
  return editProductPageForm({
    path: "/admin/product/",
    isCreate: false,
    title: "Chỉnh sửa thông tin",
  });
};

let timeout = null;

const fetchTagsList = (q, callback ) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  timeout = setTimeout(() => {
    axiosAdmin
      .get("/admin/tags/list", {
        params: {
          q,
        },
      })
      .then((res) =>
        res.data.data.map((tagInfo) => ({
          label: tagInfo.name,
          value: tagInfo.id,
        }))
      )
      .then((data) => {
        callback(data);
      });
  }, 300);
};

const product_status = Object.entries(PRODUCT_STATUS).map(([value, label]) => ({
  label,
  value,
}));

const urlAPI = import.meta.env.VITE_MY_API_PATH

const editProductPageForm = ({ path, isCreate, title }) => {
  const [api, contextHolder] = notification.useNotification();
  const [infoProduct, setInfoProduct] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [listIngredients, setListIngredients] = useState([]);
  const [listManufacturer, setListManufacturer] = useState([]);
  const [tagsListData, setTagsListData] = useState([]);
  const [urlImage, setUrlImage] = useState("")
  const handleSearch = (newValue) => {
    if (newValue) {
      fetchTagsList(newValue, setTagsListData);
    } else {
      setTagsListData([]);
    }
  };
  const handleUpload = (data) => {
    if(data.file.status === "done") {
      const url = data.file.response.data.url
      setUrlImage(url)
    }
  }
  let id;
  if (!isCreate) {
    id = useParams().slug.split("-").at(-1);
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
      const data = res.data.data
      data.tags = data.tags.map(({tag}) => ({
        label: tag.name,
        value: tag.id,
      }))
      if(data.expiry) data.expiry = dayjs(data.expiry)
      setInfoProduct(data);
      setUrlImage(res.data.data.image_url)
  };

  const onFinish = async (data) => {
    if(!urlImage) {
      api.error({
        message: "Vui lòng upload ảnh đính kèm sản phẩm!",
        duration: 5,
      });
      return
    }
    setLoadingForm(true);
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const dataPost = {
      ...data
    }
    if(dataPost.tags[0]?.constructor === Object) dataPost.tags = dataPost.tags.map((tag) => tag.value)
    const res = await adapter(path, {
      ...dataPost,
      image_url: urlImage,
    }, {
      params: {
        id,
      },
    })
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
  const fetchListOptions = async () => {
    /**
     * @param {import("../../../../type").ModelCommon[]} data
     */
    const buildFieldOption = (data) => {
      return data.map((_) => ({
        label: _.name,
        value: _.id,
      }));
    };
    const fetchCategoryOption = async () => {
      const res = await axiosAdmin.get("/admin/category/list");
      /**
       * @type {import("../../../../type").categoryInfo[]}
       */
      const category = res.data.data;
      setListCategory(buildFieldOption(category));
    };

    const fetchIngredientsOption = async () => {
      const res = await axiosAdmin.get("/admin/ingredients/list");
      /**
       * @type {import("../../../../type").ingredientsInfo[]}
       */
      const ingredients = res.data.data;
      setListIngredients(buildFieldOption(ingredients));
    };

    const fetchManufacturerOption = async () => {
      const res = await axiosAdmin.get("/admin/manufacturer/list");
      /**
       * @type {import("../../../../type").manufacturerInfo[]}
       */
      const manufacturer = res.data.data;
      setListManufacturer(buildFieldOption(manufacturer));
    };
    return Promise.all([
      fetchCategoryOption(),
      fetchIngredientsOption(),
      fetchManufacturerOption(),
    ]);
  };
  useEffect(() => {
    if (!isCreate) getData(id);
    fetchListOptions();
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
            <Space direction="vertical">
              <Text type="secondary">
                Ngày đăng ký tài khoản: {infoProduct.created_at}
              </Text>
              <Text type="secondary">
                Cập nhật lần cuối lúc: {infoProduct.updated_at}
              </Text>
            </Space>
          )}
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={infoProduct}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{
              marginTop: "10px",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Đơn giá"
                  name="unit_price"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Input suffix="VND" />
                </Form.Item>

                <Form.Item label="Miêu tả ngắn" name="description">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item label="Miêu tả chi tết" name="full_description">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select options={product_status} />
                </Form.Item>

                <Form.Item
                  label="Nhóm thuốc"
                  name="category_id"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select options={listCategory} />
                </Form.Item>

                <Form.Item
                  label="Hoạt chất"
                  name="ingredient_id"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select options={listIngredients} />
                </Form.Item>
                <Form.Item
                  label="Nhà sản xuất"
                  name="manufacturer_id"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select options={listManufacturer} />
                </Form.Item>
                <Form.Item
                  label="Tags"
                  name="tags"
                >
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Tên tags"
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    notFoundContent={null}
                    options={tagsListData}
                  />
                </Form.Item>
                <Form.Item
                  label="Ghi chú"
                  name="note"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className="px-4 lg:px-10 pt-4 lg:pt-8">
                  <Row wrap gutter={[24,24]}>
                    <Col span={24}>
                      <div>
                        <Upload.Dragger
                          accept="image/*"
                          action={`${urlAPI}/admin/upload/image`}
                          listType="picture"
                          headers={{
                            Authorization: `Bearer ${localStorage.getItem("access_token_admin")}`
                          }}
                          maxCount={1}
                          onChange={handleUpload}
                          defaultFileList={urlImage ? [{
                            status: 'done',
                            url: urlImage,
                            thumbUrl: urlImage,
                          }] : []}
                          >
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Kéo thả vào khu vực này để upload
                          </p>
                          <p className="ant-upload-hint">
                            Vui lòng chỉ upload 1 ảnh, không upload nhiều ảnh trên 1
                            sản phẩm
                          </p>
                        </Upload.Dragger>
                      </div>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Hạn sử dụng"
                        name="expiry"
                      >
                        <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" className="w-full" />
                      </Form.Item>
                      <Form.Item
                        label="Giá nhập"
                        name="import_prices"
                      >
                        <Input type="number" className="w-full" suffix={"VND"} />
                      </Form.Item>
                      <Form.Item
                        label="Sản phẩm bán chạy"
                        name="is_hot"
                        valuePropName="checked"
                      >
                        <Switch className="bg-slate-200" />
                      </Form.Item>
                      <Form.Item
                        label="Sản phẩm nổi bật"
                        name="is_outstanding"
                        valuePropName="checked"
                      >
                        <Switch className="bg-slate-200" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
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

export { editProductPageForm };

export default editProductPage;
