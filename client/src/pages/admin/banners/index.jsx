import {Divider, Table, Modal, notification, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import dayjs from "dayjs"

const listBannersPage = () => {
  const [isFetching, setFetching] = useState(false);
  const [currentTargetId, setCurrentTargetId] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  /**
   * @type {Array<(import("../../../../type").BannerInfo[]),Function>}
   */
  const [listBanner, setListBanner] = useState([]);
  const [columns] = useState([
    {
      title: "Tên bài viết",
      dataIndex: "name",
      key: "name",
      render(data, item) {
        return <>{item.news.title}</>
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render(data) {
        return data ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Không khả dụng</Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
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
          <Space>
            <Link
              to={`/admin/banners/${item.id}/edit`}
              className="text-blue-500"
            >
              Chỉnh sửa
            </Link>
            <a href="#" onClick={showModal} className="text-red-500">
              Xóa
            </a>
          </Space>
        );
      },
    },
  ]);

  const getData = async () => {
    setFetching(true);
    const res = await axiosAdmin.get("admin/banner/list").finally((e) => {
      setFetching(false);
    });
    setListBanner([...res.data.data]);
  };
  useEffect(() => {
    getData();
  }, []);

  const [isOpenModal, setOpenModal] = useState(false);

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
      .delete("/admin/banner/", {
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
        Danh sách banner
      </Divider>
      <Table dataSource={listBanner} columns={columns} loading={isFetching} />
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
        <p>Hành động này sẽ không thể hoàn tác, bạn muốn tiếp tục?</p>
      </Modal>
    </>
  );
};

export default listBannersPage;
