import { Col, List, Row, Space, Table, Tabs, Tag } from "antd";
import { useEffect, createElement, useState } from "react";
import axiosUser from "../../api/axios/user";
import { SHIPPING_STATUS } from "../../../type";
import { ClockCircleOutlined, HourglassOutlined, DownSquareOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs"

/**
 * @type {import("antd/es/table").ColumnType[]}
 */
const columns = [
  {
    title: "Mã đơn hàng",
    dataIndex: 'id',
    key: 'id',
    render: (text) => `#${text}`,
  },
  {
    title: "Thời gian",
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    title: "Trạng thái",
    dataIndex: 'shipping_status',
    key: 'shipping_status',
    render: (text) => SHIPPING_STATUS[text],
  },
  {
    title: "Tổng tiền",
    dataIndex: 'final_price',
    key: 'final_price',
    render: (text) => Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(text),
  },
  {
    title: "Thao tác",
    dataIndex: 'id',
    key: 'action',
    render: (item) => {
      return <Link to={`/orders/${item}/view`} className="text-blue-500">Xem chi tiết</Link>
    },
  },
]

const listOderTabPanel = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listOrders, setListOrders] = useState([]);
  const [meta, setMeta] = useState({})

  const getOrders = (page) => {
    setIsLoading(true);
    return axiosUser
      .get("/order/list", {
        params: {
          shipping_status: props.shipping_status,
          page,
        },
      })
      .then((res) => {
        setListOrders(res.data.data);
        setMeta(res.data.meta)
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <Table loading={isLoading} columns={columns} dataSource={listOrders} pagination={{
      pageSize: meta.per_page,
      total: meta.total_object,
      onChange: getOrders
    }} />
  );
};

const ListOrdersPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const onChangeShipping = (type) => {
    navigate(`/orders/${type}`);
  };
  return (
    <div className="px-4 pb-8 pt-8 space-y-8">
      <div className="text-xl font-semibold">Quản lý đơn hàng</div>
      <div>
        <Tabs
          popupClassName="bg-white"
          defaultActiveKey={type}
          onChange={onChangeShipping}
          tabPosition="top"
          items={[
            {
              key: "all",
              label: "Tất cả",
              children: listOderTabPanel({ shipping_status: undefined }),
            },
            ...Object.entries(SHIPPING_STATUS).map(([key, label]) => ({
              key,
              label,
              children: listOderTabPanel({ shipping_status: key }),
            })),
          ]}
        />
      </div>
    </div>
  );
};

export default ListOrdersPage;
