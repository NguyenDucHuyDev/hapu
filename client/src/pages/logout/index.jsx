import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/user/userSlice';
import { useEffect } from "react";
import { resetCart } from "../../redux/features/user/cartSlice";

const LogOutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(logout())
    dispatch(resetCart())
  }, [])
  return (
    <div className="px-4 pb-8 pt-8">
      <Result
        status="success"
        title="Hoàn tất đăng xuất"
        subTitle="Cảm ơn bạn đã sử dụng dịch vụ, hẹn gặp lại."
        className="bg-white"
        extra={[
          <Button type="primary" className="bg-blue-500" key="console" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>,
          <Button key="buy" onClick={() => navigate("/login")}>Đăng nhập lại</Button>,
        ]}
      />
    </div>
  );
};

export default LogOutPage;
