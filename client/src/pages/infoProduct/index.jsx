import { Badge, Col, Input, Row, Space, Spin, Tag, Typography, notification } from "antd";
import React, { useCallback, useState } from "react";
import { useParams,useNavigate, Link} from "react-router-dom";
import { API_URL } from "../../api/apiUrl";
import { useDispatch, useSelector, useStore } from "react-redux";
import axiosUser from "../../api/axios/user";
import ItemProduct from "../../components/products/Item"
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { createCart, deleteCart, updateCart } from "../../redux/features/user/cartSlice";
import dayjs from "dayjs";

const PageInfoProduct = () => {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(0);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = React.useState(true);
  const [totalProduct, setTotalProduct] = useState(null)
  // Thư viện
  const [api, contextHolder] = notification.useNotification();
  const { productHot } = API_URL;
  const { idProduct } = useParams();
  const idInfoProduct = idProduct.split("-").at(-1);
  const [dataStatus, setDataStatus] = React.useState(false);
  const [dataInfoProduct, setDataInfoProduct] = React.useState({
    infoProduct: null,
    productHot: null,
  });

  React.useEffect(() => {
    setIsLoadingUserInfo(false)
  }, [userInfo]);


  React.useEffect(() => {
    setDataStatus(false);
    const urlInfoProduct = `${import.meta.env.VITE_MY_API_PATH}/product?id=${idInfoProduct}`;
    const urls = [urlInfoProduct, productHot];
    const promises = urls.map((url) =>
      fetch(url).then(async (response) => {
        if (!response.ok) navigate('/not_pages', {replace:true})
        const data = await response.json();
        return data;
      })
    );

    Promise.all(promises)
      .then(([urlInfoProduct, productHot]) => {
        if(!urlInfoProduct.data) navigate('/not_pages', {replace:true})
        setDataInfoProduct({
          infoProduct: urlInfoProduct.data,
          productHot: productHot.data,
        });
        setDataStatus(true);
      })
      .catch((error) => {});
  }, [idProduct]);

  // Copy code Item + -
  const store = useStore()
  const cartsInfo = useSelector((state) => state.cart.carts)
  const dispatch = useDispatch()
  const decreaseQuantity = useCallback(() => _setQuantity(quantity - 1), [quantity])
  const increaseQuantity = useCallback(() => _setQuantity(quantity + 1), [quantity])
  const setQuantityInput = useCallback((event) => _setQuantity(event.currentTarget.value, event), [quantity])

  const _setQuantity = useCallback((fieldValue,event) => {
    let value = parseInt(fieldValue)
    setQuantity(value)
    const cartsInfo = store.getState().cart.carts
    const cartInfo = cartsInfo.find((cart) => cart.product.id == idInfoProduct) ?? {}
    
    if(isNaN(value) || value < 0) {
      setQuantity(0)
      setTotalProduct(0)
      event?.preventDefault()
      return
    }

    if(value === 0 ) setTotalProduct(0)

    if(value > 0) {
      if(cartInfo.id) {
        axiosUser.patch("/cart", {
          quantity: value,
        },
        {
          params: {
            id: cartInfo.id
          }
        })
        dispatch(updateCart({
          id: cartInfo.id,
          quantity: value
        }))
      }
      else {
        axiosUser.post("/cart", {
          product_id: idInfoProduct,
          quantity: value,
        })
        .catch((e) => {
          api.error({
            message: "Có lỗi xảy ra!",
            duration: 5,
          });
        })
        .then((res) => {
          if (res.data.status) {
            api.success({
              message: "Thêm vào giỏ hàng thành công",
              duration: 5,
            });
            const data = structuredClone(res.data.data)
            dispatch(createCart(data))
          } else {
            api.error({
              message: res.data.message,
              duration: 5,
            });
          }
        })
      }
    }
    else if(cartInfo.id) {
      axiosUser.delete("/cart", {
        params: {
          id: cartInfo.id
        }
      })
      .then((res) => {
        dispatch(deleteCart({
          id: cartInfo.id
        }))
      })
    }

  }, [quantity])

  useEffect(() => {
    const cart = cartsInfo.find((cart) => cart.product.id == idInfoProduct)

    if(!cart){
      setQuantity(0)
      setTotalProduct(0)
    }

    if(cart) {
      setQuantity(cart.quantity)
      setTotalProduct(cart.quantity * cart.product.unit_price)
    }
  }, [cartsInfo, idInfoProduct])

  return (
    <div className="infoProduct">
      {contextHolder}
      <div className="infoProduct__main w-full px-2 min-h-screen py-5">
        <div className="font-bold text-2xl">Thông tin sản phẩm</div>
        <div className="flex py-8 gap-10 flex-col lg:flex-row">
          <div className="flex-1">
              {!dataStatus && (
                <div className="flex justify-center items-center h-full">
                  <Spin tip="Đang Tải" />
                </div>
              )}
              {dataStatus && (
                  dataInfoProduct.infoProduct?.expiry ?
                    <Badge.Ribbon text={`Hạn sử dụng: ${dayjs(dataInfoProduct.infoProduct?.expiry).format("DD/MM/YYYY")}`}  color="green">
                      <div className="bg-white rounded-lg p-4">
                        <img
                          src={dataInfoProduct.infoProduct.image_url}
                          alt=""
                          className="max-h-full max-w-full"
                        />
                      </div>
                    </Badge.Ribbon>
                    :
                    <div className="bg-white rounded-lg p-4">
                      <img
                        src={dataInfoProduct.infoProduct.image_url}
                        alt=""
                        className="max-h-full max-w-full"
                      />
                    </div>
              )}
          </div>
          <div className="flex-1 relative">

            {!dataStatus && (
              <div className="flex justify-center items-center h-full">
                <Spin tip="Đang Tải" />
              </div>
            )}
            
            {dataStatus && (
              <div className="flex flex-col gap-5 h-full">
                <div className="font-bold text-xl">
                  Sản phẩm: {dataInfoProduct.infoProduct.name}
                </div>

                <div className="text-sm text-justify flex flex-col flex-1 gap-5">
                  
                  <Typography.Paragraph
                    ellipsis={{ rows: 3, expandable: false, symbol: "more" }}
                  >
                    Miêu tả sản phẩm: {dataInfoProduct.infoProduct.description}
                  </Typography.Paragraph> 

                  <div className="mt-2 flex items-center gap-x-4 lg:gap-x-10 lg:gap-y-5 gap-y-2 flex-wrap">
                    {dataInfoProduct.infoProduct.tags.map(({ tag }) => {
                      return (
                        <Link key={`tag_${tag.id}`} to={`/product/tag/${tag.slug}-${tag.id}`}>
                          <Tag color="#52c41a">
                            {tag.name}
                          </Tag>
                        </Link>
                      );
                    })}
                  </div>
                  
                  {isLoadingUserInfo ? (
                    <div className="text-center">
                      <Spin tip="Đang Tải" />
                    </div>
                  ) : (
                    <>
                      {userInfo && (
                      <>
                        <div className="mb-2 flex items-center gap-x-4 lg:gap-x-10 lg:gap-y-5 gap-y-2 flex-wrap">
                          <Link to={`/product/category/${dataInfoProduct.infoProduct.category.slug}-${dataInfoProduct.infoProduct.category.id}`}>
                            <Tag
                              color="orange"
                              style={{
                                padding: 10,
                                fontSize: 16,
                              }}
                            >
                              Thuộc nhóm: {dataInfoProduct.infoProduct.category.name}
                            </Tag>
                          </Link>
                          <Tag
                            color="green"
                            style={{
                              padding: 10,
                              fontSize: 17,
                            }}
                          >
                            Giá: &nbsp;
                            {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            }).format(dataInfoProduct.infoProduct.unit_price)}
                          </Tag>
                        </div>

                        <Space className="mt-4">
                          <span>Nhập số lượng sản phẩm:</span>
                          <MinusCircleOutlined onClick={() => decreaseQuantity()} />
                          <Input
                            type="number"
                            value={quantity}
                            className="w-full text-center"
                            onInput={setQuantityInput}
                          />
                          <PlusCircleOutlined onClick={() => increaseQuantity()} />
                        </Space>

                        {/* <div>Thành tiền: {!totalProduct ? "0" : totalProduct}</div> */}
                        {/* <div className="text-blue-500 font-bold overflow-hidden text-lg">
                          Thành tiền: &nbsp;
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalProduct)}
                        </div> */}

                      </>
                      )}  
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
        {
          dataStatus && dataInfoProduct.infoProduct.full_description &&
          (
            <div className="space-y-3">
              <div className="text-2xl font-bold">Nội dung</div>
              <div>{dataInfoProduct.infoProduct.full_description}</div>
            </div>
          )
        }

        <div className="">
          <div className="font-bold text-2xl my-5">Sản phẩm bán chạy</div>
          <Row gutter={[20, 30]}>
            {!dataStatus && (
              <div className="flex justify-center items-center h-full">
                <Spin tip="Đang Tải" />
              </div>
            )}
            {dataStatus &&
              dataInfoProduct.productHot.map((item) => {
                return (
                  <Col
                      lg={{
                        span: 6,
                      }}
                      xs={{
                        span: 12,
                      }}
                      xxl={{
                        span: 4,
                      }}
                      key={`product_${item.id}`}
                    >
                      <ItemProduct item={item} showBadge={true} />
                    </Col>
                );
              })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PageInfoProduct;
