import {
  Button,
  Divider,
  Table,
  notification,
  Row,
  Space,
  Spin,
  Typography,
  Col,
  Select,
  Form,
} from "antd";

import { SHIPPING_STATUS } from "../../../../type";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const shipping_status = Object.entries(SHIPPING_STATUS).map(
  ([value, label]) => ({
    label,
    value,
  })
);
const editProductPage = () => {
  return editProductPageForm({
    path: "/admin/order/",
    isCreate: false,
    title: "Chỉnh sửa thông tin",
  });
};

const editProductPageForm = ({ path, isCreate, title }) => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [infoOrder, setInfoOrder] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [columns] = useState([
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "unit_price",
      key: "unit_price",
      render(text) {
        return Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text);
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "final_price",
      key: "final_price",
      render(text) {
        return Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text);
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render(text, { product }) {
        return (
          <Button
            className="bg-green-500"
            type="primary"
            htmlType="submit"
            icon={<InboxOutlined />}
            onClick={() =>
              navigate(`/admin/products/${product.slug}-${product.id}/edit`)
            }
          >
            Đến sản phẩm này
          </Button>
        );
      },
    },
  ]);
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
    setInfoOrder(res.data.data);
  };

  const handleChange = async (data) => {
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const res = await adapter(
      path,
      data,
      {
        params: {
          id,
        },
      }
    ).catch((e) => {
      api.error({
        message: "Có lỗi xảy ra!",
        duration: 5,
      });
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
  const listProducts = useMemo(() => {
    return (
      infoOrder.order?.map((order) => ({
        unit_price: order.unit_price,
        quantity: order.quantity,
        name: order.product.name,
        final_price: order.total_price,
        product: order.product,
      })) ?? []
    );
  }, [infoOrder]);
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
              <Text type="secondary">Ngày mua: {infoOrder.created_at}</Text>
              <Text type="secondary">
                Cập nhật lần cuối lúc: {infoOrder.updated_at}
              </Text>
            </Space>
          )}
          <>
            <Row className="mt-4" gutter={[24, 24]}>
              <Col
                xl={{
                  span: 12,
                }}
                xs={{
                  span: 24,
                }}
              >
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-xl mb-2">
                    Đơn hàng số #{infoOrder.id}
                  </div>
                  <table className="border-collapse w-full ">
                    <tbody>
                      <tr>
                        <th className="border p-2">Thời gian:</th>
                        <td className="border p-2">
                          {dayjs(infoOrder.created_at).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Trạng thái:</th>
                        <td className="border p-2">
                          {SHIPPING_STATUS[infoOrder.shipping_status]}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Phương thức thanh toán:</th>
                        <td className="border p-2">Thanh toán khi nhận hàng</td>
                      </tr>
                      <tr>
                        <th className="border p-2">Ghi chú:</th>
                        <td className="border p-2">{infoOrder.note}</td>
                      </tr>
                      <tr>
                        <th className="border p-2">Tổng tiền:</th>
                        <td className="border p-2">
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(infoOrder.final_price)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
              <Col
                xl={{
                  span: 12,
                }}
                xs={{
                  span: 24,
                }}
              >
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-xl mb-2">
                    Thông tin khách hàng
                  </div>
                  <table className="border-collapse w-full">
                    <tbody>
                      <tr>
                        <th className="border p-2">Họ tên:</th>
                        <td className="border p-2">
                          {infoOrder.user.full_name}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Số điện thoại: </th>
                        <td className="border p-2">
                          {infoOrder.user.number_phone}
                        </td>
                      </tr>
                      <tr>
                        <th className="border p-2">Địa chỉ: </th>
                        <td className="border p-2">{infoOrder.user.address}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Button
                    className="bg-blue-500 mt-4"
                    type="primary"
                    htmlType="submit"
                    icon={<UserOutlined />}
                    onClick={() =>
                      navigate(`/admin/users/${infoOrder.user.id}/edit`)
                    }
                  >
                    Đến profile user
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="p-4 bg-white rounded-lg mt-4">
              <div className="font-bold text-xl mb-2">
                Danh sách sản phẩm đã đặt
              </div>
              <Table
                columns={columns}
                dataSource={listProducts}
                pagination={false}
              />
              <Row>
                <Col
                  xs={{
                    span: 24,
                  }}
                  lg={{
                    span: 12,
                  }}
                >
                  <div className="mt-4">
                    <Form onFinish={handleChange} layout="vertical" initialValues={infoOrder}>
                      <Form.Item label="Trạng thái đơn hàng" name="shipping_status">
                        <Select
                          className="w-full mt-2"
                          options={shipping_status}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          type="primary"
                          className="bg-blue-500"
                        >
                          Cập nhật
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
                <Col
                  xs={{
                    span: 24,
                  }}
                  lg={{
                    span: 12,
                  }}
                >
                  <div className="text-right space-y-4 mt-4">
                    <div>
                      <span className="font-bold">Tạm tính: </span>
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(infoOrder.total_price)}
                    </div>
                    {infoOrder.coupon_code && (
                      <div>
                        <span className="font-bold">Áp dụng mã giảm giá</span>
                        <span className="italic mx-2">
                          {infoOrder.coupon_code}:
                        </span>
                        <span>-</span>
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(infoOrder.discount_price)}
                      </div>
                    )}
                    <div className="font-bold text-lg">
                      <span>Tổng cộng: </span>
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(infoOrder.final_price)}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        </>
      )}
    </>
  );
};

export { editProductPageForm };

export default editProductPage;
