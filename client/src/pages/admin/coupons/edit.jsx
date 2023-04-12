import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";

const onFinishFailed = () => {};


const editCouponPage = () => {
  return couponPageForm({
    path: "/admin/coupon/",
    isCreate: false,
    title: "Chỉnh sửa thông tin",
  });
};

const couponPageForm = ({ path, isCreate, title }) => {
  const [api, contextHolder] = notification.useNotification();
  const [infoCoupon, setInfoCoupon] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  let code;
  if (!isCreate) {
    code = useParams().code;
  }
  const getData = async (code) => {
    setLoading(true);
    const res = await axiosAdmin
      .get(path, {
        params: {
          coupon_code: code,
        },
      })
      .finally(() => setLoading(false));
    setInfoCoupon(res.data.data);
  };

  const onFinish = async (data) => {
    setLoadingForm(true);
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const res = await adapter(path, data, {
      params: {
        id: infoCoupon?.id,
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
    if (!isCreate) getData(code);
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
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={infoCoupon}
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
                  label="Tên mã giảm giá"
                  name="coupon_name"
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
                  label="Giảm giá"
                  name="discount_price"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Input type="number" suffix="VND" />
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Input type="number" />
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
                  label="Mã giảm giá"
                  name="coupon_code"
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
                <Form.Item
                  label="Đã sử dụng"
                  name="used"
                >
                  <Input disabled />
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

export { couponPageForm };

export default editCouponPage;
