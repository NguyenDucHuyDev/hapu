import React from 'react'
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom'
import SideBarAdmin from '../../components/sidebar/Admin';

const { Header, Content, Footer } = Layout;

const AuthLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
     <Layout className="layout min-h-screen">
      
      <Layout hasSider>
        <SideBarAdmin />
        <Layout
          style={{
            marginLeft: 250
          }}
        >
        <Header>
          <div className="logo" />
        </Header>
        <Content
          style={{
            padding: '20px 25px',
          }}
          className="flex"
          >
            <div className='bg-white flex-1 p-5 rounded-lg px-6' >
              <Outlet />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Powered by Ily1606
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AuthLayout