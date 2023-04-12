import { Divider, Tag, Table, } from "antd"
import { useEffect, useState } from "react"
import axiosAdmin from "../../../api/axios/admin"
import { Link, useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const listCategoriesPage = () => {
  const [isFetching, setFetching] = useState(false)
  /**
   * @type {Array<(import("../../../../type").categoryInfo),Function>}
   */
  const [listCategories, setListCategories] = useState([])

  const [columns] = useState([
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
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
        return <Link to={`/admin/categories/${item.slug}-${item.id}/edit`} className="text-blue-500">Chỉnh sửa</Link>
      }
    },
  ]);

  const getData = async (page, per_page) => {
    setFetching(true)
    const res = await axiosAdmin.get("admin/category/list", {
      params: {
        page,
        per_page,
      }
    })
    .finally((e) => {
      setFetching(false)
    })
    setListCategories([...res.data.data])
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Divider className="!text-lg" orientation="left">Danh sách nhóm thuốc</Divider>
      <Table
        dataSource={listCategories}
        columns={columns}
        loading={isFetching}
      />
    </>
  )
}

export default listCategoriesPage