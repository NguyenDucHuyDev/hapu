import {
  UserOutlined,
  DashboardOutlined,
  BarcodeOutlined,
  CodepenOutlined,
  ApartmentOutlined,
  UngroupOutlined,
  TagOutlined,
  ReadOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import React from "react";
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosAdmin from "../../api/axios/admin";
import { setAdminInfo } from "../../redux/features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
const { Sider } = Layout;
const items = [
  {
    key: "/admin",
    icon: React.createElement(DashboardOutlined),
    label: "Trang chính",
  },
  {
    key: "order",
    icon: React.createElement(ShoppingCartOutlined),
    label: "Đơn hàng",
    
    children: [
      {
        key: "/admin/orders",
        label: "Danh sách",
      },
    ],
  },
  {
    key: "users",
    icon: React.createElement(UserOutlined),
    label: "Tài khoản",
    children: [
      {
        key: "/admin/users",
        label: "Danh sách",
      },
    ],
  },
  {
    key: "products",
    icon: React.createElement(BarcodeOutlined),
    label: "Sản phẩm",
    children: [
      {
        key: "/admin/products",
        label: "Danh sách",
      },
      {
        key: "/admin/product/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "coupons",
    icon: React.createElement(QrcodeOutlined),
    label: "Mã giảm giá",
    children: [
      {
        key: "/admin/coupons",
        label: "Danh sách",
      },
      {
        key: "/admin/coupons/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "categories",
    icon: React.createElement(CodepenOutlined),
    label: "Nhóm thuốc",
    children: [
      {
        key: "/admin/categories",
        label: "Danh sách",
      },
      {
        key: "/admin/categories/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "manufacturers",
    icon: React.createElement(ApartmentOutlined),
    label: "Nhà sản xuất",
    children: [
      {
        key: "/admin/manufacturers",
        label: "Danh sách",
      },
      {
        key: "/admin/manufacturers/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "ingredients",
    icon: React.createElement(UngroupOutlined),
    label: "Hoạt chất",
    children: [
      {
        key: "/admin/ingredients",
        label: "Danh sách",
      },
      {
        key: "/admin/ingredients/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "tags",
    icon: React.createElement(TagOutlined),
    label: "Tags",
    children: [
      {
        key: "/admin/tags",
        label: "Danh sách",
      },
      {
        key: "/admin/tags/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "news",
    icon: React.createElement(ReadOutlined),
    label: "Tin tức",
    children: [
      {
        key: "/admin/news",
        label: "Danh sách",
      },
      {
        key: "/admin/news/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "banners",
    icon: React.createElement(PictureOutlined),
    label: "Banners",
    children: [
      {
        key: "/admin/banners",
        label: "Danh sách",
      },
      {
        key: "/admin/banners/create",
        label: "Tạo mới",
      },
    ],
  },
  {
    key: "/admin/logout",
    icon: React.createElement(LogoutOutlined),
    label: "Đăng xuất",
  },
];


const SideBarAdmin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathName = useLocation().pathname
  const onClick = (e) => {
    navigate(e.key)
  }
  const getAdminInfo = async () => {
    const res = await axiosAdmin
      .get("/admin/me")
      .catch(() => {
        navigate("/admin/logout")
      });
    if (res.data?.data) {
      dispatch(setAdminInfo(res.data.data));
    }
    else {
      navigate("/admin/logout")
    }
  }
  useEffect(() => {
    if(!localStorage.getItem("access_token_admin")) {
      navigate("/admin/logout")
    }
    else {
      getAdminInfo()
    }
  }, [])
  return (
    <Sider
      width={250}
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <div style={{ height: 35, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          onClick={onClick}
          className="flex-auto"
          mode="inline"
          defaultSelectedKeys={[pathName]}
          defaultOpenKeys={[pathName.split("/admin/")[1]]}
          style={{
            height: "100%",
            borderRight: 0,
          }}
          items={items}
        />
      </div>
    </Sider>
  );
};

export default SideBarAdmin;
