import React from 'react'
import { Route, Routes } from 'react-router-dom'

// User pages below here
import UserLayout from '../../layouts/user'
import HomePage from '../../pages'
import RegisterPage from '../../pages/register'
import LoginPage from '../../pages/login'
import PassForgotPage from '../../pages/passForgot'
import LogOutPage from '../../pages/logout'
import ProductRoutes from './product'
import ListQuickOrderPage from '../../pages/quick-order'
import ListCartPage from '../../pages/cart/list'
import ListOrdersPage from '../../pages/order/list'
import ViewOrder from '../../pages/order/read'
import ReadNewsPage from '../../pages/news/read'
import ListNewsPage from '../../pages/news/list'
import NotPage404 from '../../pages/errors/404'
import IntroducePage from '../../pages/copyright/introduce'
import TermOfUsePage from "../../pages/copyright/term-of-use"
import RefundPage from "../../pages/copyright/refund"
import QuestionPage from "../../pages/copyright/question"
import PrivacyPage from "../../pages/copyright/privacy"
import GuidePage from "../../pages/copyright/guide"
import ComplainPage from "../../pages/copyright/complain"
import TransportPage from "../../pages/copyright/transport"


const UserRoutes = () => {
  return (
    <Routes>

      <Route element={<UserLayout />}>

        <Route path="/"  element={<HomePage />} />

        <Route path="register" element={<RegisterPage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="forgot" element={<PassForgotPage />} />

        <Route path="logout" element={<LogOutPage />} />

        <Route path="product/*" element={<ProductRoutes />} />
      
        <Route path="quick-order" element={<ListQuickOrderPage />} />

        <Route path="carts" element={<ListCartPage />} />

        <Route path="orders/:type?" element={<ListOrdersPage />} />

        <Route path="orders/:id/view" element={<ViewOrder />} />

        <Route path="news/:slug" element={<ReadNewsPage />} />

        <Route path="news/category/:type" element={<ListNewsPage />} />

        <Route path="lich-su-hinh-thanh-va-phat-trien" element={<IntroducePage />} />

        <Route path="dieu-khoan-su-dung" element={<TermOfUsePage />} />

        <Route path="quy-dinh-doi-tra-hang-hoan-tien" element={<RefundPage />} />

        <Route path="cau-hoi-thuong-gap" element={<QuestionPage />} />

        <Route path="chinh-sach-bao-mat" element={<PrivacyPage />} />

        <Route path="huong-dan-dat-hang-nhanh" element={<GuidePage />} />

        <Route path="chinh-sach-giai-quyet-khieu-nai" element={<ComplainPage />} />

        <Route path="chinh-sach-van-chuyen" element={<TransportPage />} />
        
        <Route path="not_pages" element={<NotPage404 />} />
        
      </Route>

    </Routes>
  )
}

export default UserRoutes