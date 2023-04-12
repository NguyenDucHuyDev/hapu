import React from 'react'
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import { Spin } from 'antd';
import MenuProduct from '../../components/home/products/Menu'
import ShowProduct from '../../components/home/products/ShowProduct'

const paramsType = {
  'category': "category_id",
  'ingredients' :"ingredient_id",
  'manufacturer': "manufacturer_id",
  'tag': "tag_id"
}
const ProductHome = () => {
  const location = useLocation()
  const navigate = useNavigate()
  let {type, slugProductId} = useParams()
  const url = new URL(`${import.meta.env.VITE_MY_API_PATH}/product/list`)
  const params = {}
  const searchParams = new URLSearchParams(location.search);
  const queryParams = searchParams.toString();

  const [dataProduct, setDataProduct] = React.useState({
    data:null,
    pageCurrent:{
      current_page:null,
      per_page:null
    }
  })
  const [statusData, setStatusData] = React.useState(false)

  if(dataProduct.pageCurrent.current_page) {params["page"] = dataProduct.pageCurrent.current_page}
  if(dataProduct.pageCurrent.per_page) {params["per_page"] = dataProduct.pageCurrent.per_page} 
  
  if(queryParams !== ""){
    url.search = queryParams
  } else{
    if(slugProductId) {
      const productId = slugProductId.split("-").at(-1)
      params[paramsType[type]] = productId
      url.search = new URLSearchParams(params).toString()
    }
  }

  React.useEffect(()=>{
    setStatusData(false)
    fetch(url.href)
      .then(response =>{
        if(!response.ok) navigate('/not_pages', {replace:true})
        return response.json()
      })
      .then(data=> {
        setDataProduct({
          data:data.data,
          pageCurrent:data.meta
        })
        setStatusData(true)
      }).catch(error =>{
        setStatusData(false)
      })

  },[queryParams, type, slugProductId])


  return (
    <div className="productHome bg-[#F0F2F5] px-2">
      <div className="productHome__main w-full px-2 min-h-screen">
        <div className="flex py-8 gap-10 lg:flex-row flex-col-reverse">
          <div className="flex-[1] shrink-0 grow-0 max-w-[300px]">
            <MenuProduct />
          </div>
          <div className="flex-[3] shrink-0">
            {!statusData && 
              <div className="flex justify-center"><Spin tip="Đang tải" /></div>
            }
            {statusData &&
                <ShowProduct
                  dataProduct={dataProduct} 
                  setDataProduct={setDataProduct} 
                /> 
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductHome