import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  notification,
  Row,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import axiosUser from "../../api/axios/user";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { deleteCart, resetCart, updateCart } from "../../redux/features/user/cartSlice";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ListCartPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
  const [isOpenModalDelete, setOpenModalDelete] = useState(false);
  const [isModalLoading, setModalLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate()
  const [currentOrderItem, setCurrentOrderItem] = useState({});
  const [couponData, setCouponData] = useState({});
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  /**
   * @type {Array<import("../../../type").CartInfo[], Function>}
   */
  const [listCarts, setListCarts] = useState([]);

  const getCarts = () => {
    setIsLoading(true);
    axiosUser
      .get("/cart/list")
      .then((res) => {
        setListCarts(res.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const est_price = useMemo(() => {
    let total = 0;
    for (const cart of listCarts) {
      total += cart.product.unit_price * cart.quantity;
    }
    return total
  },[listCarts])

  const total_price = useMemo(() => {
    let total = est_price
    if(couponData?.discount_price) total = total - couponData?.discount_price
    if(total < 0) total = 0
    return total;
  }, [est_price, couponData]);

  const _updateQuantity = (cart) => {
    axiosUser.patch("/cart", {
      quantity: cart.quantity,
    },
    {
      params: {
        id: cart.id
      }
    })
    dispatch(updateCart({
      id: cart.id,
      quantity: cart.quantity
    }))
  }

  const increaseQuantity = (index) => {
    listCarts[index].quantity++;
    _updateQuantity(listCarts[index])
    setListCarts(structuredClone(listCarts));
  };
  const checkCoupon = useCallback((params) => {
    setCouponCode(params.coupon_code)
    setIsLoadingCoupon(true)
    axiosUser.get("/coupon", {
      params
    })
    .then((res) => {
      if(res.data.data) {
        setCouponData(res.data.data)
      }
      else {
        setCouponData({})
        api.error({
          message: res.data.message ?? "Coupon không hợp lệ!",
          duration: 5,
        });
      }
    })
    .catch(() => {
      api.error({
        message: "Có lỗi xảy ra!",
        duration: 5,
      });
    })
    .finally(() => setIsLoadingCoupon(false))
  })
  

  const decreaseQuantity = (index) => {
    if (listCarts[index].quantity == 1) return;
    listCarts[index].quantity--;
    _updateQuantity(listCarts[index])
    setListCarts(structuredClone(listCarts));
  };

  const setQuantity = (index, event) => {
    const value = event.currentTarget.value;
    if (isNaN(value) && value < 1) return;
    listCarts[index].quantity = value;
    _updateQuantity(listCarts[index])
    setListCarts(structuredClone(listCarts));
  };

  const removeOrder = async () => {
    setModalLoading(true);
    const res = await axiosUser
      .delete("/cart", {
        params: {
          id: currentOrderItem.id,
        },
      })
      .catch((e) => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setModalLoading(false);
      });
    if (res.data.status) {
      api.success({
        message: "Thao tác thành công",
        duration: 5,
      });
      dispatch(deleteCart({
        id: currentOrderItem.id
      }))
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
    setOpenModalDelete(false);
    getCarts();
  };

  const onFinishOrder = async (data) => {
    if(!listCarts.length){
      api.error({
        message: "Không có sản phẩm trong giỏ hàng!",
        duration: 5,
      });
      return
    }
    setModalLoading(true);
    const res = await axiosUser
      .post(
        "/order",
        {
          ...data,
          coupon_code: couponCode,
          carts_id: listCarts.map((_) => _.id)
        },
      )
      .catch((e) => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setModalLoading(false);
      });
    if (res.data.status) {
      api.success({
        message: "Thao tác thành công",
        duration: 5,
      });
      dispatch(resetCart())
      setTimeout(() => {
        navigate(`/orders/${res.data.data.id}/view`)
      }, 2000)
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
    getCarts();
  };

  const setConfirmDelete = (item) => {
    setCurrentOrderItem(item);
    setOpenModalDelete(true);
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <div className="px-4 pb-8 pt-8 space-y-8">
      <div className="text-xl font-semibold">Quản lý giỏ hàng</div>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 16,
          }}
        >
          <List
            itemLayout="vertical"
            size="large"
            loading={isLoading}
            dataSource={listCarts}
            bordered={true}
            className="bg-white"
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                className="flex-col gap-y-3 lg:flex-row"
                extra={
                  <img width={200} alt="logo" src={item.product.image_url} />
                }
                actions={[
                  <Row align="middle" gutter={10} className="my-2">
                    <Col>
                      <MinusCircleOutlined
                        onClick={() => decreaseQuantity(index)}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="number"
                        value={item.quantity}
                        className="w-20"
                        onInput={(event) => setQuantity(index, event)}
                      />
                    </Col>
                    <Col>
                      <PlusCircleOutlined
                        onClick={() => increaseQuantity(index)}
                      />
                    </Col>
                  </Row>,
                  <div className="text-green-500 my-2">
                    Đơn giá:{" "}
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product.unit_price)}
                  </div>,
                  <div className="text-green-500 font-semibold underline my-2">
                    Thành tiền:{" "}
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product.unit_price * item.quantity)}
                  </div>,
                  <Row gutter={18} align="middle" className="my-2">
                    <Col>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setConfirmDelete(item)}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a
                      href={item.product.slug}
                      className="font-semibold text-lg"
                    >
                      {item.product.name}
                    </a>
                  }
                  description={
                    <Row gutter={[24, 16]} align="middle">
                      <Col className="font-medium text-slate-500">
                        Nhóm thuốc: {item.product.category.name}
                      </Col>
                      {item.product.tags.map(({ tag }) => {
                        return (
                          <Tag key={`tag_${item.id}_${tag.id}`} color="green">
                            {tag.name}
                          </Tag>
                        );
                      })}
                    </Row>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 8,
          }}
        >
          <div className="bg-white px-4 py-2 rounded-lg">
            <Row className="border-b">
              <Col span={10}>
                <div className="relative border-r">
                  <div className="mb-4 text-center text-base">Số lượng</div>
                  <div className="text-center text-green-500 font-semibold text-2xl">
                    {listCarts.length}
                  </div>
                </div>
              </Col>
              <Col span={14}>
                <div className="relative">
                  <div className="mb-4 text-center text-base">Thành tiền</div>
                  <div className="text-center  top-1/2 left-1/2 font-semibold w-full">
                    <div className="flex items-end gap-x-2 justify-center">
                      <span className="">Tổng: </span>
                      <span className="">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(est_price)}
                        {
                          couponData?.coupon_code &&
                          (
                            <>
                              <span className="inline-block">-</span>
                              <span className="inline-block">
                                {Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(couponData.discount_price)}
                              </span>
                              <span className="inline-block">=</span>
                              <span className="inline-block text-green-500 text-2xl ">
                                {Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(total_price)}
                              </span>
                            </>
                          )
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Form className="flex gap-x-2 mt-2" layout="inline" onFinish={checkCoupon}>
              <Form.Item
                name="coupon_code"
                rules={[
                  {
                    required: true,
                    message: ""
                  }
                ]}
                className="!flex-auto"
              >
                <Input placeholder="Mã ưu đãi" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className="bg-blue-500" type="primary" loading={isLoadingCoupon}>
                  Áp dụng
                </Button>
              </Form.Item>
            </Form>
            {
              couponData?.coupon_code && (
                <div className="text-sm italic text-green-500 mt-2">
                  Đang áp dụng mã giảm giá: {couponData.coupon_code}
                </div>
              )
            }
            {
              couponData === null && (
                <div className="text-sm italic text-red-500 mt-2">
                  Mã giảm giá: {couponData.coupon_code} không hợp lệ
                </div>
              )
            }
            <Form
              className="pt-4"
              layout="vertical"
              form={form}
              onFinish={onFinishOrder}
            >
              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={4} placeholder="Ghi chú cho shop" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className="bg-blue-500" type="primary">Đặt hàng</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal
        title="Xác nhận hành động"
        open={isOpenModalDelete}
        onOk={removeOrder}
        onCancel={() => setOpenModalDelete(false)}
        okText="Tiếp tục"
        confirmLoading={isModalLoading}
        okButtonProps={{ className: "bg-blue-500" }}
      >
        <p>Bạn thực sự muốn xóa sản phẩm này khỏi giỏ hàng?</p>
      </Modal>
    </div>
  );
};

export default ListCartPage;
