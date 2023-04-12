import { Divider, Table } from "antd";
import { useEffect, useState } from "react";
import axiosAdmin from "../../../api/axios/admin";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const listUserPage = () => {
  const [isFetching, setFetching] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState({});
  const [listBusinessType, setListBusinessType] = useState({});
  let listBusinessTypeDraft = {}
  const [columns] = useState([
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "number_phone",
      key: "number_phone",
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Tên doanh nghiệp",
      dataIndex: "business_name",
      key: "business_name",
    },
    {
      title: "Hình thức doanh nghiệp",
      dataIndex: "business_type",
      key: "business_type",
      render(item) {
        return <>{listBusinessType[item] ?? listBusinessTypeDraft[item]}</>
      }
    },
    {
      title: "Ngày đăng ký",
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
      render(item) {
        return <Link to={`/admin/users/${item}/edit`} className="text-blue-500">Chỉnh sửa</Link>
      }
    },
  ]);
  const navigate = useNavigate();

  const getData = async (page, per_page) => {
    const res = await axiosAdmin
      .get("admin/user/list", {
        params: {
          page,
          per_page,
        },
      })
    setMeta(res.data.meta ?? {});
    setPageSize(res.data.meta.per_page);
    setListUsers([...res.data.data]);
  };

  const getBusinessType = async () => {
    const res = await axiosAdmin.get("/business_type/list");
    /**
     * @type {(import("../../../../type").BusinessType)[]}
     */
    const listType = res.data.data;
    const listTypeSelect = listType.map((type) => {
      return [type.id,type.name]
    });
    listBusinessTypeDraft = Object.fromEntries(listTypeSelect)
    setListBusinessType(listBusinessTypeDraft);
  };
  useEffect(() => {
    setFetching(true);
    Promise.all([
      getBusinessType(),
      getData(),
    ])
    .finally(() => setFetching(false))
  }, []);
  return (
    <>
      <Divider className="!text-lg" orientation="left">
        Danh sách users
      </Divider>
      <Table
        columns={columns}
        dataSource={listUsers}
        loading={isFetching}
        pagination={{
          onChange: getData,
          onShowSizeChange: getData,
          pageSize: pageSize,
          total: meta.total_object,
        }}
      />
    </>
  );
};

export default listUserPage;
