import {
  Button,
  Col,
  Form,
  Input,
  List,
  notification,
  Row,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useState } from "react";
import axiosUser from "../../api/axios/user";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import { PRODUCT_STATUS } from "../../../type";
import { Link } from "react-router-dom";
import { createCart, deleteCart, updateCart } from "../../redux/features/user/cartSlice";
import { useCallback } from "react";

const ListQuickOrderPage = () => {
  const [isFetching, setFetching] = useState(true);
  const [isFetchingTags, setFetchingTags] = useState(true);
  const [isFetchingHotProduct, setFetchingHotProduct] = useState(true);
  const [dataMeta, setDataMeta] = useState({});
  const userInfo = useSelector((state) => state.user.userInfo);
  const cartsInfo = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch()
  const store = useStore()
  const [api, contextHolder] = notification.useNotification();

  const [listTag, setListTag] = useState([])

  /**
   * @type {Array<import("../../../type").productInfo[], Function>}
   */
  const [listProduct, setListProduct] = useState([]);

  /**
   * @type {Array<import("../../../type").productInfo[], Function>}
   */
  const [listHotProduct, setListHotProduct] = useState([]);

  const decreaseQuantity = useCallback((index) => {
    _setQuantity(listProduct[index], listProduct[index].quantity - 1)
  }, [listProduct])
  const increaseQuantity = useCallback((index) => _setQuantity(listProduct[index], listProduct[index].quantity + 1), [listProduct])
  const setQuantityInput = useCallback((index, event) => _setQuantity(listProduct[index], event.currentTarget.value, event), [listProduct])
  const _setQuantity = useCallback((item, fieldValue, event) => {
    const value = parseInt(fieldValue)
    item.quantity = value
    setListProduct(structuredClone(listProduct));
    const cartsInfo = store.getState().cart.carts
    const cartInfo = cartsInfo.find((cart) => cart.product.id === item.id) ?? {}
    if(!userInfo) {
      item.quantity = 0
      setListProduct(structuredClone(listProduct))
      event?.preventDefault()
      return
    }
    if(isNaN(value) || value <= 0) {
      if(cartInfo.id) {
        let confirm = window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")
        if(confirm) {
          item.quantity = 0
          setListProduct(structuredClone(listProduct))
          event?.preventDefault()
        }
        else {
          item.quantity = 1
        }
      }
      else {
        item.quantity = 0
        setListProduct(structuredClone(listProduct))
        event?.preventDefault()
        return
      }
    }
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
          product_id: item.id,
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
  })

  const getData = async (page, params) => {
    setFetching(true);
    axiosUser
      .get("/product/list", {
        params: {
          page,
          ...params,
        },
      })
      .then((res) => {
        setListProduct(
          res.data.data.map((_) => {
            _.quantity = 0;
            const cart = cartsInfo.find((cart) => cart.product_id === _.id)
            if(cart) {
              _.quantity = cart.quantity
            }
            _.isLoading = false;
            _.available = _.status === "READY";
            return _;
          })
        );
        setDataMeta(res.data.meta);
      })
      .finally(() => setFetching(false));
  };

  const getHotProduct = async () => {
    setFetchingHotProduct(true);
    axiosUser
      .get("/product/outstanding")
      .then((res) => {
        setListHotProduct(res.data.data);
      })
      .finally(() => setFetchingHotProduct(false));
  };

  const onSearch = (params) => {
    getData(null, params);
  };

  const getTags = useCallback(() => {
    setFetchingTags(true)
    axiosUser.get("/tags/", {
      params: {
        per_page: 2
      }
    })
    .then((res) => {
      if(res.data.status) {
        setListTag(res.data.data)
      }
    })
    .finally(() => setFetchingTags(false))
  },[])

  useEffect(() => {
    getData();
    getHotProduct();
    getTags();
  }, []);

  useEffect(() => {
    for (const cart of cartsInfo) {
      const product = listProduct.find((product) => product.id === cart.product_id)
      if(product) product.quantity = cart.quantity
    }
    setListProduct(structuredClone(listProduct))
  }, [cartsInfo, listProduct.length])
  return (
    <div className="px-4 pb-8 pt-8 space-y-4">
      <Row gutter={[24, 24]}>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 16,
          }}
        >
          {contextHolder}
          <div className="text-xl font-semibold mb-4">Đặt hàng nhanh</div>
          <div className="flex gap-x-4 flex-wrap mb-4">
            <Link to="/quick-order" className="bg-green-700 text-white px-4 py-2 font-bold rounded-xl hover:text-white">Tất cả</Link>
            {
              listTag.map((tag) => {
                return <Link to={`/product/tag/${tag.slug}-${tag.id}`} className="bg-green-700 text-white px-4 py-2 font-semibold rounded-2xl hover:text-white">{tag.name}</Link>
              })
            }
          </div>
          <Form onFinish={onSearch}>
            <Form.Item
              name="q"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <div className="flex gap-x-2">
                <div className="flex-auto">
                  <Input
                    className="w-full"
                    placeholder="Tên sản phẩm..."
                    size="large"
                  />
                </div>
                <div>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="bg-blue-500"
                    icon={<SearchOutlined />}
                    size="large"
                    loading={isFetching}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Form>
          <div className={isFetching ? "bg-white px-8 py-4 rounded-lg" : ""}>
            <Skeleton loading={isFetching} active={true}>
              <List
                itemLayout="vertical"
                bordered
                className="bg-white"
                size="large"
                dataSource={listProduct}
                pagination={{
                  onChange: getData,
                  pageSize: dataMeta.per_page,
                  total: dataMeta.total_object,
                }}
                renderItem={(item, index) => (
                  <List.Item
                    className="flex-col gap-y-3 lg:flex-row"
                    key={`product_${item.id}`}
                    extra={<img width={220} alt="logo" src={item.image_url} />}
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
                            onInput={(event) => setQuantityInput(index, event)}
                          />
                        </Col>
                        <Col>
                          <PlusCircleOutlined
                            onClick={() => increaseQuantity(index)}
                          />
                        </Col>
                      </Row>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Link to={`/info-product/${item.slug}-${item.id}`} className="font-semibold">
                          {item.name}
                        </Link>
                      }
                      description={
                        <Row gutter={[24, 16]} align="middle">
                          <Col className="font-medium text-slate-500">
                            Nhóm thuốc: <Link className="text-green-500" to={`/product/category/${item.category.slug}-${item.category.id}`}>{item.category.name}</Link>
                          </Col>
                          {item.tags.map(({ tag }) => {
                            return (
                              <Tag
                                key={`tag_${item.id}_${tag.id}`}
                                color="green"
                              >
                                {tag.name}
                              </Tag>
                            );
                          })}
                        </Row>
                      }
                    />
                    <div>
                      {item.description ? (
                        <Typography.Paragraph
                          ellipsis={{
                            rows: 2,
                            expandable: false,
                            symbol: "more",
                          }}
                        >
                          {item.description}
                        </Typography.Paragraph>
                      ) : (
                        ""
                      )}

                      {item.status !== "READY" ? (
                        <p className="text-red-500 font-medium">
                          {PRODUCT_STATUS[item.status]}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Skeleton>
          </div>
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 8,
          }}
        >
          <div
            className={
              isFetchingHotProduct ? "bg-white px-8 py-4 rounded-lg" : ""
            }
          >
            <div className="text-xl font-semibold mb-4">Sản phẩm nổi bật</div>
            <Skeleton loading={isFetchingHotProduct} active={true}>
              <List
                itemLayout="horizontal"
                dataSource={listHotProduct}
                className="bg-white"
                bordered
                renderItem={(item, index) => (
                  <List.Item>
                      <div className="flex items-center justify-center gap-x-4">
                        <img src={item.image_url} alt="" className="w-16 aspect-video object-cover" />
                        <div className="space-y-3">
                          <Link className="font-semibold" to={`/info-product/${item.slug}-${item.id}`}>{item.name}</Link>
                          <div>Nhóm thuốc: <Link className="text-green-500" to={`/product/category/${item.category.slug}-${item.category.id}`}>{item.category.name}</Link></div>
                        </div>
                      </div>
                  </List.Item>
                )}
              />
            </Skeleton>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ListQuickOrderPage;
