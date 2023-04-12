import React from 'react'
import registerLib from '../../libs/register'
import { Link } from 'react-router-dom';
import { Input, Button, Space, Select, Form, InputNumber, Spin, notification, DatePicker } from 'antd';
import { API_URL } from '../../api/apiUrl';
import { useNavigate } from "react-router-dom";

const FormRegister = (props) => {
    const {dataList} = props
    const {formRegister} = API_URL
    const navigate = useNavigate();
    const [dataInfo,setDataInfo] = React.useState({
        status: false,
        message: null
    })

    const [dataStatus, setDataStatus] = React.useState(null);
    const [disableEventSubmit, setDisableEventSubmit] = React.useState(false)

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type,title,des) => {
      api[type]({
        message: title,
        description:des,
      });

      if(type === "success"){
        setTimeout(() => {
            setDisableEventSubmit(false)
            setDataStatus(null)
            navigate("/login")
        }, 750);
      }

      if(type === "error"){
        setTimeout(() => {
            setDisableEventSubmit(false)
            setDataStatus(null)
        }, 750);
    }
    };

    const sendDataToServer = async(sendData) =>{
        const response = await fetch(formRegister,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(sendData)
        })
        if (!response.ok && response.status === 404) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    }

    const onFinish = async (fieldsValue) => {
        const sendData = {
            ...fieldsValue,
            'number_phone': `0${fieldsValue.number_phone}`
        };
        try{
            setDataStatus('pending');
            setDisableEventSubmit(true)
            const responseData = await sendDataToServer(sendData);
            setDataStatus('resolved');
            setDisableEventSubmit(true)
            if(!responseData.status) return setDataInfo({'status':false, 'message':responseData.message})
            return setDataInfo({'status':true, 'message':'Đăng ký tài khoản thành công!'});
        } catch(error){
        }
    };

    return (
    <div className="flex justify-between items-center relative w-full px-2 min-h-screen">
        {contextHolder}
        <Form  
            onFinish={onFinish}
            layout="vertical"
            name="formRegister"
            className="modalRegister text-black w-full py-7 lg:px-10 my-5 border bg-white rounded-lg px-2 shadow-lg shadow-indigo-500/40"
        >
            <div className="modalRegister__main flex flex-col gap-5">
                <div className="font-bold text-3xl text-center">{registerLib.title}</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {(registerLib.formItems).map(item=>{
                        return(
                            <React.Fragment key={item.name}>

                                {item.idDiff === "input" && (
                                    <Form.Item
                                        name={item.uniqueInput}
                                        label={item.name}
                                        dependencies={[(item.confirmPass && "password" )]}
                                        style={{margin:"0"}}
                                        rules={[
                                            {
                                            type:(item.uniqueInput === "email" && "email"),
                                            required:(item.reqField !== "not" ? true : false),
                                            // required:true,
                                            min:(item.reqField !== "not" ? 6 : null ),
                                            message:item.message,
                                            },

                                            ({ getFieldValue }) => 
                                            ( (item.confirmPass ? 
                                                {
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Nhập lại mật khẩu không đúng!'));
                                                    },
                                                }
                                                : false
                                            ) )
                                        ]}
                                        hasFeedback          
                                    >    
                                    <label className="w-full lg:w-4/5 block">
                                        {item.type === "number" && 
                                            <InputNumber className="w-full" 
                                                            maxLength="15" 
                                                            prefix="+84 || 0" 
                                            />
                                        }
                                        {item.type === "email" && <Input />}
                                        {item.type === "password" && <Input.Password />}
                                        {item.type === "text" && <Input  />}
                                    </label>
                                    </Form.Item>
                                )}
                            
                                {item.idDiff === "select" && (
                                    <label className="w-full lg:w-4/5 block">
                                        <Form.Item
                                            name= {item.uniqueInput}
                                            label={item.name}
                                            hasFeedback
                                            style={{display:"flex",margin:"0"}} 
                                            rules={[
                                                {
                                                    required: true,
                                                    message: item.message
                                                }
                                            ]}
                                        >   
                                            <Select 
                                                placeholder={item.name} 
                                                allowClear
                                            >

                                            {(item.valueSelect ==="business" && dataList?.business)
                                            && (dataList.business.data).map(business =>{
                                                return(
                                                    <React.Fragment key={business.id}>
                                                        <Select.Option 
                                                            value={business.id}
                                                            style={{marginTop:"10px"}}
                                                        >{business.name}</Select.Option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }

                                            {(item.valueSelect === "city" && dataList?.city)
                                            && (dataList.city.data).map(nameCity =>{
                                                return(
                                                    <React.Fragment key={nameCity.id}>
                                                        <Select.Option value={nameCity.id}>{nameCity.name}</Select.Option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                            </Select>     
                                        </Form.Item>
                                    </label>  
                                )}
                                
                                {item.idDiff === "textarea" && (
                                <label className="w-full lg:w-4/5 block">
                                <Form.Item
                                    name= {item.uniqueInput}
                                    label={item.name}
                                    style={{margin:"0"}}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            min:6,
                                            message: item.message
                                        }
                                    ]}
                                >
                                        <Input.TextArea 
                                            type="text" 
                                        />
                                </Form.Item>
                                </label>   
                                )}

                                {item.idDiff === "date" && (
                                <label className="w-full lg:w-4/5 block">
                                    <Form.Item
                                        name= {item.uniqueInput}
                                        label={item.name}
                                        style={{margin:"0"}}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: item.message
                                            }
                                        ]}
                                    >

                                        {item.type === "date" && <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" className='w-full' />}
                                    </Form.Item>
                                </label>   
                                )}
                            </React.Fragment>
                        ) 
                    })}
                </div>

                <label className="flex items-center gap-2 justify-center cursor-pointer">
                  <input type="checkbox" />
                  <p>Tôi đã đọc và đồng ý với Điều khoản sử dụng *</p>
                </label>

                <div className="flex items-center gap-2 justify-center">
                    <span>{registerLib.accountIf}</span>
                    <Link to="/login">
                        <span className="cursor-pointer text-lime-500">{registerLib.btnLogin}</span>
                    </Link>
                </div>
                
                <Space className="flex justify-center">
                    <Button className="bg-[#1677ff] font-bold"
                            type="primary"
                            size={"large"}
                            htmlType="submit"
                            disabled={disableEventSubmit}
                            >{registerLib.title}
                    </Button>
                </Space>
            </div>  
        </Form>
       
        <>
            { dataStatus === "pending" &&
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
                    <Spin />
                </div>
            }
            {dataStatus === "resolved" && dataInfo.status
            &&
                <div>
                    <div onClick={openNotificationWithIcon('success','Thành Công', dataInfo.message)}></div>
                </div>
            
            }
            {dataStatus === "resolved" && !dataInfo.status
            &&
                <div>
                    <div onClick={openNotificationWithIcon('error','Thất bại', dataInfo.message)}></div>
                </div>
            
            }
        </>

        <style jsx="true">{`
            .ant-form-item-feedback-icon{
                display:flex
            }
            .ant-form-item-row{
                width:100%
            }
            .ant-form-item-row{
                flex-direction:unset !important;
            }
        `}</style>
   </div>
  )
}

export default FormRegister