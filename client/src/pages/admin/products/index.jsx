import { Divider, Modal, notification, Space, Table } from "antd"
import { useEffect, useState } from "react"
import axiosAdmin from "../../../api/axios/admin"
import { PRODUCT_STATUS } from "../../../../type"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import {
  FireOutlined,
  BarChartOutlined,
} from "@ant-design/icons"
const listProductPage = () => {
  const [isFetching, setFetching] = useState(false)
  const [currentTargetId, setCurrentTargetId] = useState()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [columns] = useState([
    {
      title: "",
      dataIndex: "more",
      key: "more",
      render(data, item) {
        return <>
          {item.is_hot && <FireOutlined title="Sản phẩm đang hot" className="text-red-500" /> }
          {item.is_outstanding && <BarChartOutlined title="Sản phẩm đang bán chạy" className="text-green-500" /> }
        </>
      }
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      key: "unit_price",
      render(data) {
        return Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(data)
      }
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render(data) {
        return <>{PRODUCT_STATUS[data]}</>
      }
    },
    {
      title: "Nhóm thuốc",
      dataIndex: "category",
      key: "category",
      render(data) {
        return <>{data.name}</>
      } 
    },
    {
      title: "Hoạt chất",
      dataIndex: "ingredient",
      key: "ingredient",
      render(data) {
        return <>{data.name}</>
      } 
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render(data) {
        return <>{data.name}</>
      } 
    },
    {
      title: "Ngày đăng",
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
      render(id, item) {
        return <Space>
          <Link to={`/admin/products/${id}/edit`} className="text-blue-500">Chỉnh sửa</Link>
          <a href="#" className="text-red-500" onClick={() => showModal(item)}>Xóa</a>
        </Space>
      }
    },
  ]);

  /**
   * @type {Array<(import("../../../../type").productInfo[]),Function>}
   */
  const [listProduct, setListProduct] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [meta, setMeta] = useState({})

  const getData = async (page, per_page) => {
    setFetching(true)
    const res = await axiosAdmin.get("admin/product/list", {
      params: {
        page,
        per_page,
      }
    })
    .finally((e) => {
      setFetching(false)
    })
    setListProduct([...res.data.data])
    setMeta(res.data.meta ?? {})
    setPageSize(res.data.meta.per_page)
  }
  useEffect(() => {
    getData()
  }, [])

  const [isOpenModal, setOpenModal] = useState(false);

  const showModal = (item) => {
    setCurrentTargetId(item.id)
    setOpenModal(true);
  };

  const hideModal = () => {
    setOpenModal(false);
  };

  const modalHandleDelete = async () => {
    setConfirmLoading(true);
    const res = await axiosAdmin.delete("/admin/product/", {
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
    getData()
  }

  return (
    <>
      {contextHolder}
      <Divider className="!text-lg" orientation="left">Danh sách sản phẩm</Divider>
      <Table
        columns={columns}
        dataSource={listProduct}
        loading={isFetching}
        pagination={{
          onChange: getData,
          onShowSizeChange: getData,
          pageSize: pageSize,
          total: meta.total_object
        }} 
      />
      <Modal
        title="Xác nhận hành động"
        open={isOpenModal}
        onOk={modalHandleDelete}
        onCancel={hideModal}
        okText="Tiếp tục"
        okButtonProps={{className: "bg-blue-500"}}
        confirmLoading={confirmLoading}
        cancelText="Hủy bỏ"
      >
        <p>Hành động này sẽ xóa luôn các đơn hàng đã được giao dịch trước đó, và không thể hoàn tác, bạn muốn tiếp tục?</p>
      </Modal>
    </>
  )
}

export default listProductPage