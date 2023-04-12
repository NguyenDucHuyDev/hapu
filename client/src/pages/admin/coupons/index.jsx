import {
  Divider,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import dayjs from "dayjs"

const listCouponPage = () => {
  const [isFetching, setFetching] = useState(false);
  const [listCoupons, setListCoupon] = useState([]);
  const [columns, ] = useState([
    {
      title: "Mã giảm giá",
      dataIndex: 'coupon_code',
      key: 'coupon_code',
    },
    {
      title: "Tên mã giảm giá",
      dataIndex: 'coupon_name',
      key: 'coupon_name',
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render(data) {
        return data ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không khả dụng</Tag>
      }
    },
    {
      title: "Số lượng",
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: "Đã sử dụng",
      dataIndex: 'used',
      key: 'used',
    },
    {
      title: "Giảm giá",
      dataIndex: 'discount_price',
      key: 'discount_price',
      render: (text) => Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(text),
    },
    {
      title: "Thao tác",
      dataIndex: 'coupon_code',
      key: 'coupon_code',
      render: (item, record) => {
        return (<Space>
          <Link to={`/admin/coupons/${item}/edit`} className="text-blue-500">Xem chi tiết</Link>
        </Space>
        )
      },
    },
  ])
  
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState({});
  const [api, contextHolder] = notification.useNotification();

  const getData = async (page, per_page) => {
    setFetching(true);
    const res = await axiosAdmin
      .get("admin/coupon/list", {
        params: {
          page,
          per_page,
        },
      })
      .finally((e) => {
        setFetching(false);
      });
      setListCoupon([...res.data.data]);
    setMeta(res.data.meta ?? {});
    setPageSize(10);
  };
  useEffect(() => {
    getData();
  }, []);

  const [isOpenModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentTargetId, setCurrentTargetId] = useState();

  const showModal = (item) => {
    setCurrentTargetId(item.id);
    setOpenModal(true);
  };

  const hideModal = () => {
    setOpenModal(false);
  };

  const modalHandleDelete = async () => {
    setConfirmLoading(true);
    const res = await axiosAdmin
      .delete("/admin/coupon/", {
        params: {
          id: currentTargetId,
        },
      })
      .catch((e) => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setConfirmLoading(false);
      });
    if (res.data.status) {
      api.success({
        message: "Thao tác thành công",
        duration: 5,
      });
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
    hideModal();
    getData();
  };

  return (
    <>
      {contextHolder}
      <Divider className="!text-lg" orientation="left">
        Danh sách mã giảm giá
      </Divider>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={listCoupons}
        pagination={{
          onChange: getData,
          onShowSizeChange: getData,
          pageSize: pageSize,
          total: meta.total_object,
        }}
      />
      <Modal
        title="Xác nhận hành động"
        open={isOpenModal}
        onOk={modalHandleDelete}
        onCancel={hideModal}
        okText="Tiếp tục"
        okButtonProps={{ className: "bg-blue-500" }}
        confirmLoading={confirmLoading}
        cancelText="Hủy bỏ"
      >
        <p>
          Hành động này sẽ không thể hoàn tác, bạn muốn tiếp tục?
        </p>
      </Modal>
    </>
  );
};

export default listCouponPage;
