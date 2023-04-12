import React from 'react'
import productsHomeLib from '../../../libs/home/products';
import { API_URL } from '../../../api/apiUrl';
import { Divider, List, Spin, Typography } from 'antd';
import { Link } from 'react-router-dom';

const MenuProduct = (props) => {
  const {category, ingredients, manufacturer, productOutstanding} = API_URL
  const arrayListMenu = ["category", "ingredients", "manufacturer", "productOutstanding"]

  const [dataList, setDataList] = React.useState({
    status:false,
    category:null,
    ingredients :null,
    manufacturer: null,
    productOutstanding:null
  })

  React.useEffect(() =>{
    const urls = [category, ingredients, manufacturer, productOutstanding]
    const promises = urls.map(url=> fetch(url)
      .then(async(response) => {
        if(!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`)
        const data = await response.json()
        return data
      })
    )
    Promise.all(promises)
      .then(([category, ingredients, manufacturer, productOutstanding]) => {
        setDataList({
          ...dataList,
          status:true,
          category: category,
          ingredients: ingredients,
          manufacturer: manufacturer,
          productOutstanding: productOutstanding 
        })
      }).catch(error =>{
        setDataList(
          Object.keys(dataList).forEach(key =>{
            dataList[key] = null;
          })
        ),  
        console.error(error)
      })
  },[])

  return (
  <>
    <div className="menuProduct">
      <div className="menuProduct__main">
        <div className="text-black w-full p-5 border bg-white rounded-lg shadow-lg shadow-indigo-500/40">
          <div>
            <Divider orientation="center" 
                     style={{fontSize:"20px",fontWeight:"700"}}
            >{productsHomeLib.titleMenu}</Divider>
            {dataList?.status 
            ?
              <>
                {arrayListMenu.map(item=>{
                  return(
                    <React.Fragment key={item}>
                    <List
                      size="small"
                      header={<div className="text-sm font-bold">{productsHomeLib[item]}</div>}
                      dataSource={dataList[item].data}
                      renderItem={(content) => (
                        <Link to={`/${item != "productOutstanding" ? `product/${item}` : "product"}/${content.slug}-${content.id}`} >
                          <List.Item
                            className={["cursor-pointer hover:bg-[#F0F2F5]", item === "productOutstanding" ? "flex items-start gap-3" : ""].join(" ")}
                          >
                            {item ==="productOutstanding" &&
                              <div className="flex items-center justify-center">
                                <img src={content.image_url} alt="" className="max-h-20" />
                              </div>
                            }
                            <div className="whitespace-nowrap text-ellipsis block overflow-hidden text-sm">{content.name}</div>
                          </List.Item>
                        </Link>
                      )}
                    />
                    </React.Fragment>
                  )
                })}
              </>
            :
              <div className="flex items-center justify-center"><Spin tip="Đang Tải" /></div>
            }
          </div>
        </div> 
      </div>
    </div>
  </>
  )
}

export default MenuProduct