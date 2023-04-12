import {
  Divider,
  Image,
  List,
  Modal,
  notification,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";

const listNewsPage = () => {
  const [isFetching, setFetching] = useState(false);

  /**
   * @type {Array<(import("../../../../type").NewsInfo[]),Function>}
   */
  const [listNews, setListOrder] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState({});
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const getData = async (page, per_page) => {
    setFetching(true);
    const res = await axiosAdmin
      .get("admin/news/list", {
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
  const toEditPage = (item) => {
    navigate(`/admin/news/${item.slug}/edit`);
  };

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
      .delete("/admin/news/", {
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
        Danh sách tin tức
      </Divider>
      <List
        loading={isFetching}
        dataSource={listNews}
        size="small"
        style={{
          padding: "0 20px",
        }}
        pagination={{
          onChange: getData,
          onShowSizeChange: getData,
          pageSize: pageSize,
          total: meta.total_object,
        }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit" onClick={() => toEditPage(item)}>
                Xem
              </a>,
              <a key="list-loadmore-edit" onClick={() => showModal(item)}>
                Xóa
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={<Image src={item.image_url} width={200} />}
            />
            <div>
              <div className="text-lg font-semibold flex items-center justify-between">
                <div>{item.title}</div>
                <Tag color="blue">{item.newType.name}</Tag>
              </div>
              <Typography.Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              >
                {item.content_post}
              </Typography.Paragraph>
            </div>
          </List.Item>
        )}
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
          Hành động này sẽ xóa luôn các banner đã liên kết với bài viết này, và
          không thể hoàn tác, bạn muốn tiếp tục?
        </p>
      </Modal>
    </>
  );
};

export default listNewsPage;
