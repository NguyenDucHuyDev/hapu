import { Badge, Col, Input, Row, Space, notification } from "antd";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Link } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import axiosUser from "../../api/axios/user"
import {createCart, deleteCart, updateCart} from "../../redux/features/user/cartSlice"

/**
 *
 * @param {{item: import("../../../type").productInfo}} props
 */
const Item = (props) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <>
      <div className="px-2 py-2 rounded-lg w-full aspect-[3/4] bg-white flex items-center relative">
        <img
          src={props.item.image_url}
          className="object-contain w-full aspect-square"
        />
      </div>
      <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-lg text-slate-600 mt-3">
        {props.item.name}
      </div>
      <div className="text-blue-500 font-bold overflow-hidden text-lg">
        {userInfo &&
          Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(props.item.unit_price)}
      </div>
      {props.showFooter ? (
        <>
          <div className="text-slate-500 font-medium text-sm">
            Nhóm thuốc: <Link to={`/product/category/${props.item.category.slug}-${props.item.category.id}`}>{props.item.category.name}</Link>
          </div>
          <div className="text-slate-500 font-medium text-sm">
            {props.item.note ?? ""}
          </div>
        </>
        
      ) : (
        ""
      )}
    </>
  );
};

/**
 *
 * @param {{item: import("../../../type").productInfo}} props
 */
const ItemProduct = (props) => {

  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch()
  const store = useStore()
  const cartsInfo = useSelector((state) => state.cart.carts);
  const [api, contextHolder] = notification.useNotification();

  const decreaseQuantity = useCallback(() => _setQuantity(quantity - 1), [quantity])
  const increaseQuantity = useCallback(() => _setQuantity(quantity + 1), [quantity])
  const setQuantityInput = useCallback((event) => _setQuantity(event.currentTarget.value, event), [quantity])
  const _setQuantity = useCallback((fieldValue, event) => {
    const value = parseInt(fieldValue)
    setQuantity(value)
    const cartsInfo = store.getState().cart.carts
    const cartInfo = cartsInfo.find((cart) => cart.product.id === props.item.id) ?? {}
    if(isNaN(value) || value < 0) {
      setQuantity(0)
      event?.preventDefault()
      return
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
          product_id: props.item.id,
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
    const cart = cartsInfo.find((cart) => cart.product.id === props.item.id)

    if(!cart){
      setQuantity(0)
    }

    if(cart) {
      setQuantity(cart.quantity)
    }
  }, [cartsInfo])

  return (
    <>
      {contextHolder}
      <Link to={`/product/${props.item.slug}-${props.item.id}`}>
        {props.item.tags?.[0]?.tag.name && props.showBadge ? (
          <Badge.Ribbon
            text={props.item.tags?.[0]?.tag.name}
            color="green"
            style={{
              maxWidth: "100%",
            }}
          >
            <Item item={props.item} showFooter={props.showFooter} />
          </Badge.Ribbon>
        ) : (
          <Item item={props.item} showFooter={props.showFooter} />
        )}
      </Link>
      <Space>  
        <MinusCircleOutlined onClick={() => decreaseQuantity()} />
        <Input
          type="number"
          value={quantity}
          className="w-full text-center"
          onInput={setQuantityInput}
        />
        <PlusCircleOutlined onClick={() => increaseQuantity()} />
      </Space>
    </>
  );
};

export default ItemProduct;
