import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adminInfo: null,
}

const adminSlice = createSlice({
    name:'admin',
    initialState:initialState,
    reducers: {
        setAdminInfo: (state, action) => {
            return {
                ...state,
                adminInfo: action.payload
            }
        },
        logout:(state, action) =>{
          localStorage.removeItem("access_token_admin")
          return {
              ...state,
              userInfo: null,
          };
        }
    }
})

export const {logout, setAdminInfo} = adminSlice.actions
export default adminSlice.reducer