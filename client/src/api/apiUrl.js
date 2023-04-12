const baseUrl = import.meta.env.VITE_MY_API_PATH
export const API_URL = {
    cityList: `${baseUrl + "/city/list"}`,
    businessList: `${baseUrl + "/business_type/list"}`,
    formRegister: `${baseUrl + "/register"}`,
    formLogin:`${baseUrl + "/login"}`,
    category : `${baseUrl + "/category/list"}`,
    ingredients: `${baseUrl + "/ingredients/list"}`,
    manufacturer: `${baseUrl + "/manufacturer/list"}`,
    productHot: `${baseUrl + "/product/hot"}`,
    productOutstanding: `${baseUrl + "/product/outstanding"}`,
}