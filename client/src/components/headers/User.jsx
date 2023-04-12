import {
  Avatar,
  Button,
  Dropdown,
  Menu,
  Skeleton,
  Space,
  Drawer,
  Badge,
  Form,
  Input,
} from "antd";
import logo from "../../assets/images/logo.gif";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axiosUser from "../../api/axios/user";
import { setUserInfo } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ShoppingCartOutlined, MenuOutlined } from "@ant-design/icons";
import { setCarts } from "../../redux/features/user/cartSlice";
import Search from "../../assets/images/search.svg"
import Close from "../../assets/images/close.svg"
import {SearchOutlined} from "@ant-design/icons";

const items = [
  {
    label: "Trang chủ",
    key: "home",
  },
  {
    label: "Sản phẩm",
    key: "product",
  },
  {
    label: "Đặt hàng nhanh",
    key: "quick_order",
  },
  {
    label: "Khuyến mãi",
    key: "sales",
  },
  {
    label: "Tin tức",
    key: "news",
    children: [
      {
        label: "Thông báo",
        key: "notification",
      },
      {
        label: "Hướng dẫn",
        key: "guide",
      },
      {
        label: "Chia sẻ kinh nghiệm",
        key: "share",
      },
      {
        label: "Thông tin ngành dược",
        key: "information_medical",
      },
    ],
  },
  {
    label: "Tuyển dụng",
    key: "recruitment",
  },
];

const profileItems = [
  {
    key: "1",
    label: <Link to="/orders">Quản lý đơn hàng</Link>,
  },
  {
    key: "2",
    label: <Link to="/logout">Đăng xuất</Link>,
  },
];

const UserHeader = () => {
  const navigate = useNavigate();
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  /**
   * Handle function with key in menu
   */
  const functionWithKeys = {
    home() {
      navigate("/");
    },
    product() {
      navigate("/product");
    },
    quick_order() {
      navigate("/quick-order");
    },
    sales() {
      navigate("/news/category/tin-khuyen-mai");
    },
    news() {},
    notification() {
      navigate("/news/category/thong-bao");
    },
    guide() {
      navigate("/news/category/huong-dan");
    },
    share() {
      navigate("/news/category/chia-se-kinh-nghiem");
    },
    information_medical() {
      navigate("/news/category/thong-tin-nghanh-duoc");
    },
    recruitment() {
      navigate("/news/category/tuyen-dung");
    },
    carts() {
      navigate("/carts/");
    },
  };
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const cartsInfo = useSelector((state) => state.cart.carts);
  const getInitData = async () => {
    setIsLoadingUserInfo(true);
    const [carts, userInfo] = await Promise.all([
      axiosUser
      .get("/cart/list"),
      axiosUser
      .get("/user")
    ])
    .finally(() => setIsLoadingUserInfo(false))
    if (userInfo.data?.data) {
      dispatch(setUserInfo(userInfo.data.data));
    }
    if(carts.data.data) {
      dispatch(setCarts(carts.data.data))
    }
  };

  // handle show input header
  const navHeader = useRef()
  const inputHeader = useRef()

  const handleShowInput = () =>{
    if(navHeader.current && inputHeader.current) {
      navHeader.current.classList.remove("showInputHeader")
      inputHeader.current.classList.remove("hiddenInputHeader")
      navHeader.current.classList.add("hiddenInputHeader")
      inputHeader.current.classList.add("showInputHeader")
    }
  }

  const handleHiddenInput = () =>{
    if(navHeader.current && inputHeader.current){
      navHeader.current.classList.remove("hiddenInputHeader")
      inputHeader.current.classList.remove("showInputHeader")
      navHeader.current.classList.add("showInputHeader")
      inputHeader.current.classList.add("hiddenInputHeader")
    }
  }

  const onSubmitSearchHeader = (value) =>{
    if(!value.input_header) value.input_header = ""
    setOpen(false)
    navigate(`/product?q=${value.input_header}`)
  }

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <div className="px-2 fixed top-0 right-0 left-0 lg:px-32 w-full z-50 bg-[#0b9444]">
      <div className="px-2 flex w-full py-5 lg:py-0 gap-x-6 items-center mx-[0.5625rem]">
        <div className="mr-auto">
          <img src={logo} width={80} />
        </div>
        <div className="hidden lg:block flex-auto">

          <div ref={navHeader} className="relative">
            <Menu
              mode="horizontal"
              items={items}
              className="border-none bg-transparent uppercase text-white colorNavHeader"
              onClick={({ key }) => functionWithKeys[key]()}
            />
            
            <div 
              className="cursor-pointer absolute top-2/4 right-0 -translate-y-2/4"
              onClick={handleShowInput}
            >
              <img src={Search} alt="" className="p-2"/>
             </div>

          </div>

          <div 
            ref={inputHeader} 
            className="hiddenInputHeader"
          >
            <Form 
              className="hidden lg:block flex-auto m-auto w-3/4"
              onFinish={onSubmitSearchHeader}
            >
              <Form.Item
                name="input_header"
                style={{margin:"0"}}
                className="relative"
              >
                <Input 
                  className="w-full" 
                  placeholder="Tìm kiếm sản phẩm" 
                  suffix={                 
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        className="bg-blue-500"
                        htmlType="submit"
                      />
                  }
                />
              </Form.Item>

              <div 
                  className="cursor-pointer absolute top-2/4 right-0 -translate-y-2/4"
                  onClick={handleHiddenInput}
                >
                  <img src={Close} alt="" className="p-2"/>
              </div>

            </Form>
          </div>

        </div>

        <div className="text-sm text-slate-100">Hotline: 0878.929.789</div>
        {isLoadingUserInfo ? (
          <Space>
            <Skeleton.Avatar active={true} size="default" shape="circle" />
            <Skeleton.Input active={true} size="default" />
          </Space>
        ) : userInfo ? (
          <>
            <div>
              <Badge count={cartsInfo.length}>
                <Button
                  className="bg-blue-500"
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={functionWithKeys["carts"]}
                >
                </Button>
              </Badge>
            </div>
            <Dropdown
              menu={{
                items: profileItems,
              }}
              placement="bottomRight"
              arrow={{
                pointAtCenter: true,
              }}
            >
              <Space>
                <Avatar>{userInfo.full_name[0]}</Avatar>
                <div className="text-white">{userInfo.full_name}</div>
              </Space>
            </Dropdown>
          </>
        ) : (
          <div className="flex space-x-2 text-sm lg:text-base">
            <div>
              <Link
                to="/login"
                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-ellipsis whitespace-nowrap overflow-hidden"
              >
                Đăng nhập
              </Link>
            </div>
            <div>
              <Link
                to="/register"
                className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg text-ellipsis whitespace-nowrap overflow-hidden"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        )}
        <div className="block lg:hidden">
          <MenuOutlined style={{
            fontSize: 24
          }}
          onClick={() => setOpen(true)}
          />
          <Drawer
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
          >

            <Form 
              onFinish={onSubmitSearchHeader}
              className="mb-5"
            >
              <Form.Item
                name="input_header"
                style={{margin:"0"}}
                className="relative"
              >
                <Input 
                  className="w-full" 
                  placeholder="Tìm kiếm sản phẩm" 
                  suffix={                 
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        className="bg-blue-500"
                        htmlType="submit"
                      />
                  }
                />
              </Form.Item>
            </Form>

            <Menu
              mode="vertical"
              items={items}
              className="border-none"
              style={{
                fontSize: "16px",
              }}
              onSelect={({ key }) => { setOpen(false); functionWithKeys[key]()}}
            />          
          </Drawer>
        </div>
      </div>
      <style jsx="true">{`
        .hiddenInputHeader{
          transform: scale(0) !important;
          transform-origin: center !important;
          transition: all 0s ease-in !important; 
          position: absolute !important;
        }
        .showInputHeader{
          transform: scaleY(1) !important;
          transform-origin: center !important;
          position:unset !important;
          transition: all 0.2s linear !important;
        }
        .colorNavHeader>li{
          color:#fff !important;
        }
        .colorNavHeader>li>.ant-menu-submenu-title{
          color:#fff !important;
        }
      `}
      </style>
    </div>
  );
};

export default UserHeader;
