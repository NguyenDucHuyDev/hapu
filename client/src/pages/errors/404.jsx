import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotPage404 = () => {
  const navigate = useNavigate()
  return (
    <div className="px-4 pb-8 pt-8">
      <Result
        status="404"
        title="404"
        className="bg-white"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={<Button type="primary" className="bg-blue-500" onClick={() => navigate("/")}>Trở về trang chủ</Button>}
      />
    </div>
  );
};

export default NotPage404;
