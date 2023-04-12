import React from 'react'
import loginLib from '../../libs/login'
import { Input, InputNumber,Checkbox, Button, Form, Spin, notification} from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../api/apiUrl';
import { setUserInfo } from '../../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { setCarts } from '../../redux/features/user/cartSlice';
import axiosUser from "../../api/axios/user"

const LoginForm = () => {
  const {formLogin} = API_URL
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [fetchStatus,setFetchStatus] = React.useState(null)
  const [disableEventSubmit, setDisableEventSubmit] = React.useState(false)
  const [getData, setGetData] = React.useState({
    status:false,
    message: null
  })
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type,title,des) => {
    api[type]({
      message: title,
      description:des,
    });
    if(type === "success"){
      setTimeout(() => {
          setDisableEventSubmit(false)
          setFetchStatus(null)
          navigate("/")
      }, 750);
    }
    if(type === "error"){
      setTimeout(() => {
        setDisableEventSubmit(false)
        setFetchStatus(null)
    }, 750);
    } 
    
  }

  const sendDataToServer = async (sendData)=>{
    const response = await fetch(formLogin,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(sendData)
    })
    // !response.ok check xem đường dẫn api backend đúng chưa
    if(!response.ok && response.status === 404) throw new Error(`HTTP error! Status: ${response.status}`)
    // // Nếu đúng thì convert sang json() vì trình duyệt chỉ gửi về string
    const data = await response.json();
    return data;
  }

  const onFinish = async(fieldsValue)=> {
    const sendData = {
      ...fieldsValue,
      'number_phone': `0${fieldsValue.number_phone}`
    }
    setFetchStatus('pending')
    setDisableEventSubmit(true)
    const resData =  await sendDataToServer(sendData);
    setDisableEventSubmit(true)
    // Đường dẫn trả về là đúng và đã có dữ liệu. Nhưng dữ liệu đúng hay sai thì phải qua thêm một bước check status
    // Nếu đường dẫn đúng nhưng dữ liệu trả về sai(Ví như truyền thiếu parmater hoặc dữ liệu sai)
    if(!resData.status) {
      setFetchStatus('resolve')
      return setGetData({'status':false, message:resData.message})
    }
    // Nếu đúng hoàn toàn không trục trục gì thì toàn code phía bên dưới chạy
    dispatch(setUserInfo(resData.data.user))
    localStorage.setItem("access_token", resData.data.token)
    const carts = await axiosUser.get("/cart/list")
    if(carts.data.data) {
      dispatch(setCarts(carts.data.data))
    }
    setFetchStatus('resolve')
    setGetData({'status':true, 'message':'Đăng nhập thành công'})
  }
    
  return (
    <div className="flex justify-between items-center relative w-full px-2">
      {contextHolder}
      <Form
        onFinish={onFinish}
        layout="vertical"
        name="formLogin"
        className="modalLogin text-black w-full py-7 px-2 lg:px-10 my-5 border bg-white rounded-lg shadow-lg shadow-indigo-500/40"
      >
        <div className="form__main w-full lg:w-1/3 flex flex-col mx-auto">
          <div className="font-bold text-3xl text-center mb-5">{loginLib.title}</div>
          <Form.Item
            name={loginLib.loginField.idName}
            label={loginLib.loginField.label}
            rules={[
              {
                required:true
              }
            ]}
          >
            <InputNumber 
              style={{width:"100%"}} 
              placeholder={loginLib.loginField.placeholder}
              prefix="+84 || 0"
            />
          </Form.Item>

          <Form.Item
            name={loginLib.passField.idName}
            label={loginLib.passField.label}
            rules={[
              {
                required:true
              }
            ]}
          >
            <Input.Password 
              placeholder={loginLib.passField.placeholder} 
            />
          </Form.Item>
          
          <Checkbox>{loginLib.passRemember}</Checkbox>
          
          <Button
            className="bg-[#28a745] font-bold text-white mt-5"
            htmlType="submit"
            type="primary"
            size={"large"}
            disabled={disableEventSubmit}
          >
            {loginLib.title}
          </Button>
          <Link to="/forgot">
            <p className="text-[#28a745] cursor-pointer mt-5 text-center">{loginLib.passForgot}</p>
          </Link>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div>{loginLib.notAccount}</div>
            <Link to="/register">
              <div className="text-[#28a745] cursor-pointer">{loginLib.nowRegister}</div>
            </Link>
          </div>
        </div>
        
        <>        
          { fetchStatus === "pending" &&
            <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
              <Spin />
            </div>
          }

          {fetchStatus === "resolve" && getData.status 
          && 
            <div>
              <div onClick={openNotificationWithIcon('success', 'Thành Công', getData.message)}></div>
            </div>
          }

          {fetchStatus === "resolve" && !getData.status 
          && 
            <div>
              <div onClick={openNotificationWithIcon('error', 'Thất Bại', getData.message)}></div>
            </div>
          }
        </>

      </Form>
    </div>
  )
}

export default LoginForm