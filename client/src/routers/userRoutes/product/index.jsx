import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductHome from '../../../pages/products'
import PageInfoProduct from '../../../pages/infoProduct'

const ProductRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<ProductHome />} />
        <Route path=":type/:slugProductId" element={<ProductHome />} />
        <Route path=":idProduct" element={<PageInfoProduct />}/>
    </Routes>
  )
}

export default ProductRoutes