import { Divider, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { SHIPPING_STATUS } from "../../../../type";
import dayjs from "dayjs"
const listOrdersPage = () => {
  const [isFetching, setFetching] = useState(false);

  /**
   * @type {Array<(import("../../../../type").orderInfo[]),Function>}
   */
  const [listOrder, setListOrder] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState({});
  const [columns] = useState([
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      render(data, item) {
        return <>{item.user.full_name}</>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render(data, item) {
        return <>{item.user.address}</>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "number_phone",
      key: "number_phone",
      render(data, item) {
        return <>{item.user.number_phone}</>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render(data) {
        return <>{data}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "shipping_status",
      key: "shipping_status",
      render(data) {
        return <>{SHIPPING_STATUS[data]}</>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "final_price",
      key: "final_price",
      render(data) {
        return (
          <>
            {Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(data)}
          </>
        );
      },
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "created_at",
      key: "created_at",
      render(item) {
        return dayjs(item).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "id",
      render(data, item) {
        return (
          <Link to={`/admin/orders/${item.id}/edit`} className="text-blue-500">
            Chỉnh sửa
          </Link>
        );
      },
    },
  ]);

  const getData = async (page, per_page) => {
    setFetching(true);
    const res = await axiosAdmin
      .get("admin/order/list", {
        params: {
          page,
          per_page,
        },
      })
      .finally((e) => {
        setFetching(false);
      });
    setListOrder([...res.data.data]);
    setMeta(res.data.meta ?? {});
    setPageSize(res.data.meta.per_page);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Divider className="!text-lg" orientation="left">
        Danh sách đơn đặt hàng
      </Divider>
      <Table
        loading={isFetching}
        dataSource={listOrder}
        pagination={{
          onChange: getData,
          onShowSizeChange: getData,
          pageSize: pageSize,
          total: meta.total_object,
        }}
        columns={columns}
      />
    </>
  );
};

export default listOrdersPage;
