import { Form ,Input, Button, notification } from "antd"
import { errorMessage } from "../../errors/messages";
import axiosAdmin from "../../api/axios/admin"
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const onFinishFailed = (errorInfo) => {
  console.error('Failed:', errorInfo);
};

const loginPage = () => {
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification();

  const [isLoading, setLoading] = useState(false)
  const onFinish = async (values) => {
    setLoading(true)
    const res = await axiosAdmin.post("admin/login", values)
    .catch((e) => {
      api.error({
        message: "Có lỗi xảy ra!",
        duration: 5,
      });
    })
    .finally(() => {
      setLoading(false)
    })
    if(res?.data.status) {
      const token = res.data.data.token
      localStorage.setItem("access_token_admin", token)
      api.success({
        message: 'Đăng nhập thành công',
        duration: 5,
      });
      navigate('/admin')
    }
    else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <div className="p-8 m-2 border rounded-md">
        <div className="max-w-full w-96">
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelWrap={true}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: errorMessage.email.required,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: errorMessage.password.required,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" className="bg-blue-500" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form>
        </div>
      </div>
    </>
  )
}

export default loginPage