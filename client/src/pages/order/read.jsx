import { Col, List, Row, Skeleton, Space, Table, Tag } from "antd";
import { useEffect, useState, createElement, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SHIPPING_STATUS } from "../../../type";
import axiosUser from "../../api/axios/user";
import dayjs from "dayjs";

const columns = [
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
];

const ViewOrder = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataOrder, setDataOrder] = useState({});
  const { id } = useParams();

  const getData = async (id) => {
    setLoading(true);
    const res = await axiosUser
      .get("/order", {
        params: {
          id,
        },
      })
      .catch(() => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setLoading(false);
      });
    if (res?.data.status) {
      setDataOrder(res.data.data);
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
  };

  const listProducts = useMemo(() => {
    return (
      dataOrder.order?.map((order) => ({
        unit_price: order.unit_price,
        quantity: order.quantity,
        name: order.product.name,
        final_price: order.total_price,
      })) ?? []
    );
  }, [dataOrder]);

  useEffect(() => {
    getData(id);
  }, []);

  return (
    <div className="px-4 pb-8 pt-8 space-y-8">
      <div className="text-xl font-semibold">Chi tiết đơn hàng</div>
      <div className={isLoading ? "bg-white px-8 py-4 rounded-lg" : ""}>
        <Skeleton loading={isLoading} active={true}>
          {!isLoading && (
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
                      Đơn hàng số #{dataOrder.id}
                    </div>
                    <table className="border-collapse w-full ">
                      <tbody>
                        <tr>
                          <th className="border p-2">Thời gian:</th>
                          <td className="border p-2">
                            {dayjs(dataOrder.created_at).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="border p-2">Trạng thái:</th>
                          <td className="border p-2">
                            {SHIPPING_STATUS[dataOrder.shipping_status]}
                          </td>
                        </tr>
                        <tr>
                          <th className="border p-2">
                            Phương thức thanh toán:
                          </th>
                          <td className="border p-2">
                            Thanh toán khi nhận hàng
                          </td>
                        </tr>
                        <tr>
                          <th className="border p-2">Ghi chú:</th>
                          <td className="border p-2">{dataOrder.note}</td>
                        </tr>
                        <tr>
                          <th className="border p-2">Tổng tiền:</th>
                          <td className="border p-2">
                            {Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(dataOrder.final_price)}
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
                            {dataOrder.user.full_name}
                          </td>
                        </tr>
                        <tr>
                          <th className="border p-2">Số điện thoại: </th>
                          <td className="border p-2">
                            {dataOrder.user.number_phone}
                          </td>
                        </tr>
                        <tr>
                          <th className="border p-2">Địa chỉ: </th>
                          <td className="border p-2">
                            {dataOrder.user.address}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                <div className="text-right space-y-4 mt-4">
                  <div>
                    <span className="font-bold">Tạm tính: </span>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(dataOrder.total_price)}
                  </div>
                  {dataOrder.coupon_code && (
                    <div>
                      <span className="font-bold">Áp dụng mã giảm giá</span>
                      <span className="italic mx-2">
                        {dataOrder.coupon_code}:
                      </span>
                      <span>-</span>
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(dataOrder.discount_price)}
                    </div>
                  )}
                  <div className="font-bold text-lg">
                    <span>Tổng cộng: </span>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(dataOrder.final_price)}
                  </div>
                </div>
              </div>
            </>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default ViewOrder;
