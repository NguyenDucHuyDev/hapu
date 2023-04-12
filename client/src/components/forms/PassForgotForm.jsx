import React from 'react'
import passForgotLib from '../../libs/passforgot'
import {Form} from 'antd';
import { Link } from 'react-router-dom';

const PassForgotForm = () => {
  return (
    <div className="flex justify-between items-center relative w-full px-2">
        <Form
          className="modalLogin text-black w-full py-7 px-10 my-5 border bg-white rounded shadow-lg shadow-indigo-500/40"
          layout="vertical"
          name="passForgotForm"
        >
          <div className="form__main w-1/3 flex flex-col mx-auto gap-5">
            <div className="font-bold text-3xl text-center mb-5">{passForgotLib.title}</div>
            <div className="p-2 text-center bg-amber-300 rounded font-mono">{passForgotLib.titleDes}</div>
            <div className="text-center mt-5 cursor-pointer">
                <Link to="/login">
                    <span className="bg-[#1677ff] font-bold text-white p-4 rounded">{passForgotLib.login}</span>
                </Link>
            </div>
            <div className="flex items-center justify-center mt-5 gap-1">
                <span>{passForgotLib.notAccount}</span>
                <Link to="/register">
                    <span className="cursor-pointer text-orange-600">{passForgotLib.registerNow}</span>
                </Link>
            </div>
          </div>
        </Form>
    </div>
  )
}

export default PassForgotForm