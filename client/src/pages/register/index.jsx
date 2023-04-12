import React from 'react'
import { API_URL } from '../../api/apiUrl';
import FormRegister from '../../components/forms/RegisterForm'
// const FormRegister = React.lazy(() => import("../../components/forms/RegisterForm"));

const RegisterPage = () => {  
  const {businessList,cityList} = API_URL

  const [dataList, setDataList] = React.useState({
      business:null,
      city:null,
  });

  React.useEffect(() => {
  const urls = [businessList, cityList]
  const promises = urls.map(url => fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })) 

  Promise.all(promises)
    .then(([business,city]) => {
      setDataList({
        ...dataList,
        business:business,
        city:city,
      })
    })
    .catch(error =>{
      console.error(error)
    })
  }, []);

  return (
      <div className="pageRegister bg-[#F0F2F5] max-w-container">
            <div className="pageRegister__main">
              <React.Suspense fallback={<FormRegister dataList={null} />}>
                <FormRegister dataList={dataList} />
              </React.Suspense>
            </div>
      </div>
  )
}

export default RegisterPage