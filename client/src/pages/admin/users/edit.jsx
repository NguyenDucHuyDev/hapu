import {
  Divider,
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Select,
  Typography,
  Space,
  DatePicker,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const { Text } = Typography;

const onFinishFailed = () => {};

const editUserPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingBasicForm, setLoadingBasicForm] = useState(false);
  const [isLoadingAdvancedForm, setLoadingAdvancedForm] = useState(false);
  /**
   * @type {Array<import("../../../../type").userInfo>}
   */
  const [userInfo, setUserInfo] = useState({});

  const [listCity, setListCity] = useState([]);

  const [listBusinessType, setListBusinessType] = useState([]);

  const onFinishBasicForm = (data) => {
    setLoadingBasicForm(true)
    updateProfile(data)
    .finally(() => setLoadingBasicForm(false))
  };
  
  const onFinishAdvancedForm = (data) => {
    setLoadingAdvancedForm(true)
    updateProfile(data)
    .finally(() => setLoadingAdvancedForm(false))
  };

  const updateProfile = async (data) => {
    const res = await axiosAdmin.patch("/admin/user", data, {
      params: {
        id,
      }
    })
    .catch((e) => {
      api.error({
        message: "Có lỗi xảy ra!",
        duration: 5,
      });
    })
    .finally(() => {

    })
    if(res.data.status) {
      api.success({
        message: 'Cập nhật thành công',
        duration: 5,
      });
    }
    else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
  }

  const getUserInfo = async (userId) => {
    const res = await axiosAdmin.get("/admin/user", {
      params: {
        id: userId,
      },
    });
    /**
   * @type {import("../../../../type").userInfo}
   */
    const userInfo = res.data.data;
    userInfo.prefix = "84"
    userInfo.birthday = dayjs(userInfo.birthday)
    setUserInfo(userInfo);
  };
  useEffect(() => {
    Promise.all([getUserInfo(id), getCity(), getBusinessType()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const getCity = async () => {
    const res = await axiosAdmin.get("/city/list");
    /**
     * @type {(import("../../../../type").cityInfo)[]}
     */
    const listCity = res.data.data;
    const listCitySelect = listCity.map((city) => {
      return {
        value: city.id,
        label: city.name,
      };
    });
    setListCity(listCitySelect);
  };

  const getBusinessType = async () => {
    const res = await axiosAdmin.get("/business_type/list");
    /**
     * @type {(import("../../../../type").BusinessType)[]}
     */
    const listType = res.data.data;
    const listTypeSelect = listType.map((type) => {
      return {
        value: type.id,
        label: type.name,
      };
    });
    setListBusinessType(listTypeSelect);
  };

  return (
    <>
      {contextHolder}
      <Divider className="!text-lg" orientation="left">
        Chỉnh sửa thông tin
      </Divider>
      <Space direction="vertical">
        <Text type="secondary">
          Ngày đăng ký tài khoản: {userInfo.created_at}
        </Text>
        <Text type="secondary">
          Cập nhật lần cuối lúc: {userInfo.updated_at}
        </Text>
      </Space>
      <div>
        <Divider orientation="left">Thông tin cơ bản</Divider>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin tip="Đang tải" />
          </div>
        ) : (
          <Form
            name="basic"
            onFinish={onFinishBasicForm}
            initialValues={userInfo}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: errorMessage.email.required },
                    { type: "email", message: errorMessage.email.invalid },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Họ tên"
                  name="full_name"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.full_name.required,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="number_phone"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.number_phone.required,
                    },
                  ]}
                >
                  <Input type="number"
                    addonBefore={
                      <Form.Item name="prefix" noStyle>
                        <Select style={{ width: 70 }}>
                          <Select.Option value="84">+84</Select.Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  rules={[
                    { required: true, message: errorMessage.birthday.required },
                  ]}
                >
                  <DatePicker style={{
                    width: "100%"
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Hình thức kinh doanh"
                      name="business_type"
                      rules={[
                        {
                          required: true,
                          message: errorMessage.business_type.required,
                        },
                      ]}
                    >
                      <Select options={listBusinessType} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tên doanh nghiệp"
                      name="business_name"
                      rules={[
                        {
                          required: true,
                          message: errorMessage.address.required,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Tỉnh/TP"
                  name="city_id"
                  rules={[
                    { required: true, message: errorMessage.city_id.required },
                  ]}
                >
                  <Select options={listCity} />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: errorMessage.address.required },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Người giới thiệu" name="user_referer">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoadingBasicForm} className="bg-blue-500">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      <div>
        <Divider orientation="left">Thông tin nâng cao</Divider>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin tip="Đang tải" />
          </div>
        ) : (
          <Form
            name="basic"
            onFinish={onFinishAdvancedForm}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: errorMessage.password.required },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoadingAdvancedForm} className="bg-blue-500">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </>
  );
};

export default editUserPage;
