import React from 'react'
import headerLib from '../../libs/ui/header'
import Logo from "../../assets/images/logo.gif"
import iconSearch from "../../assets/images/icons8-search.svg"
import { Button, Space } from 'antd';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className="header">
      <div className="header-top relative">

        <div className="header-top__main flex justify-between py-4 w-[75rem] m-auto items-center">
          <img src={Logo} alt="" />
          <div className="absolute w-[33.33%] left-2/4 -translate-x-2/4 border-2 rounded flex items-center">
            <input 
              type="text" 
              placeholder={headerLib.input} 
              defaultValue="" 
              className="px-3 py-2 outline-none w-full"
            />
            <img 
              src={iconSearch} 
              alt=""
              width="24"
              className='cursor-pointer mx-2'
            />
          </div>
          <div className="header-top__info">
            <div className="header-top__button flex flex-col gap-2">
              <Space>
                <Link to="/login">
                  <Button className="bg-[#1677ff] font-bold"
                          type="primary" 
                          shape="round"
                          size="large"
                          >{headerLib.login}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#1677ff] font-bold" 
                          type="primary" 
                          shape="round"
                          size="large"
                          >{headerLib.register}
                  </Button>
                </Link>

              </Space>
              <div className="flex gap-2 justify-end items-center">
                <span className="text-sm">{headerLib.hotline}</span>
                <span className="text-lime-500 cursor-pointer">{headerLib.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-top__nav bg-lime-600">
          <nav className="w-[75rem] m-auto flex">
            {(headerLib.navItems).map(item =>{
              return(
                <React.Fragment key={item.content}>
                <a className="p-3 cursor-pointer border-b-[3px] border-transparent hover:border-b-amber-600">
                  <li className="text-white font-medium uppercase">{item.content}</li>
                </a>
                </React.Fragment>
              )
            })}
          </nav>
        </div>

      </div>
    </header>
  )
}

export default Header