import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";

const onFinishFailed = () => {};

const { Text } = Typography;

const editCategoryPage = () => {
  return categoryPageForm({
    path: "/admin/category/",
    isCreate: false,
    label: "Tên nhóm thuốc",
    title: "Chỉnh sửa thông tin",
  });
};

const categoryPageForm = ({ path, isCreate, label, title }) => {
  const [api, contextHolder] = notification.useNotification();
  const [infoCategory, setInfoCategory] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
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
    setInfoCategory(res.data.data);
  };

  const onFinish = async (data) => {
    setLoadingForm(true);
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const res = await adapter(path, data, {
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
            <Space direction="vertical">
              <Text type="secondary">
                Ngày đăng ký tài khoản: {infoCategory.created_at}
              </Text>
              <Text type="secondary">
                Cập nhật lần cuối lúc: {infoCategory.updated_at}
              </Text>
            </Space>
          )}
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={infoCategory}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{
              marginTop: "10px",
            }}
          >
            <Row gutter={[24, 24]}>
              <Col
                xs={{
                  span: 24,
                }}
                lg={{
                  span: 12,
                }}
              >
                <Form.Item
                  label={label}
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
              </Col>
              <Col
                xs={{
                  span: 24,
                }}
                lg={{
                  span: 12,
                }}
              >
                <Form.Item
                  label="Trạng thái"
                  name="is_active"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        label: "Khả dụng",
                        value: true,
                      },
                      {
                        label: "Không khả dụng",
                        value: false,
                      },
                    ]}
                  />
                </Form.Item>
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

export { categoryPageForm };

export default editCategoryPage;
