import React from 'react'
import { Routes,Route } from 'react-router-dom'
import NotPage404 from '../../pages/errors/404'

import AdminListUserPage from '../../pages/admin/users'
import AdminEditUserPage from '../../pages/admin/users/edit'
import AdminListCategoriesPage from '../../pages/admin/categories'
import AdminListManufacturerPage from '../../pages/admin/manufacturers'
import AdminEditCategoryPage from "../../pages/admin/categories/edit"
import AdminCreateCategoryPage from "../../pages/admin/categories/create"
import AdminEditManufacturerPage from "../../pages/admin/manufacturers/edit"
import AdminCreateManufacturerPage from "../../pages/admin/manufacturers/create"
import AdminListIngredientsPage from "../../pages/admin/ingredients"
import AdminEditIngredientsPage from "../../pages/admin/ingredients/edit"
import AdminCreateIngredientsPage from "../../pages/admin/ingredients/create"
import AdminListTagsPage from "../../pages/admin/tags"
import AdminEditTagsPage from "../../pages/admin/tags/edit"
import AdminCreateTagsPage from "../../pages/admin/tags/create"
import AdminLogoutPage from "../../pages/admin/logout"
import AdminListProductPage from '../../pages/admin/products'
import AdminEditProductPage from '../../pages/admin/products/edit'
import AdminCreateProductPage from '../../pages/admin/products/create'
import AdminListOrdersPage from '../../pages/admin/orders'
import AdminEditOrderPage from '../../pages/admin/orders/edit'
import AdminListNewsPage from '../../pages/admin/news'
import AdminEditNewsPage from '../../pages/admin/news/edit'
import AdminCreateNewsPage from '../../pages/admin/news/news'
import AdminListBannersPage from '../../pages/admin/banners'
import AdminEditBannerPage from '../../pages/admin/banners/edit'
import AdminCreateBannerPage from '../../pages/admin/banners/create'
import AdminListCouponsPage from '../../pages/admin/coupons'
import AdminEditCouponPage from '../../pages/admin/coupons/edit'
import AdminCreateCouponPage from '../../pages/admin/coupons/create'

const AdminRoutesMain = () => {
  return (
    <Routes>
        <Route path='users' element={<AdminListUserPage />}></Route>
        <Route path='users/:id/edit' element={<AdminEditUserPage />}></Route>
        <Route path='categories' element={<AdminListCategoriesPage />}></Route>
        <Route path='categories/:slug/edit' element={<AdminEditCategoryPage />}></Route>
        <Route path='categories/create' element={<AdminCreateCategoryPage />}></Route>
        <Route path='manufacturers' element={<AdminListManufacturerPage />}></Route>
        <Route path='manufacturers/:slug/edit' element={<AdminEditManufacturerPage />}></Route>
        <Route path='manufacturers/create' element={<AdminCreateManufacturerPage />}></Route>
        <Route path='ingredients' element={<AdminListIngredientsPage />}></Route>
        <Route path='ingredients/:slug/edit' element={<AdminEditIngredientsPage />}></Route>
        <Route path='ingredients/create' element={<AdminCreateIngredientsPage />}></Route>
        <Route path='tags' element={<AdminListTagsPage />}></Route>
        <Route path='tags/:slug/edit' element={<AdminEditTagsPage />}></Route>
        <Route path='tags/create' element={<AdminCreateTagsPage />}></Route>
        <Route path='logout' element={<AdminLogoutPage />}></Route>
        <Route path='products' element={<AdminListProductPage />}></Route>
        <Route path='products/:slug/edit' element={<AdminEditProductPage />}></Route>
        <Route path='product/create' element={<AdminCreateProductPage />}></Route>
        <Route path='orders' element={<AdminListOrdersPage />}></Route>
        <Route path='orders/:id/edit' element={<AdminEditOrderPage />}></Route>
        <Route path='news' element={<AdminListNewsPage />}></Route>
        <Route path='news/:slug/edit' element={<AdminEditNewsPage />}></Route>
        <Route path='news/create' element={<AdminCreateNewsPage />}></Route>
        <Route path='banners' element={<AdminListBannersPage />}></Route>
        <Route path='banners/:id/edit' element={<AdminEditBannerPage />}></Route>
        <Route path='banners/create' element={<AdminCreateBannerPage />}></Route>
        <Route path='coupons' element={<AdminListCouponsPage />}></Route>
        <Route path='coupons/:code/edit' element={<AdminEditCouponPage />}></Route>
        <Route path='coupons/create' element={<AdminCreateCouponPage />}></Route>
    </Routes>
  )
}

export default AdminRoutesMain