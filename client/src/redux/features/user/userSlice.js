import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {{ userInfo: import("../../../../type").userInfo }}
 */
const initialState = {
    userInfo: null, // Lưu trữ thông tin người dùng khác (ví dụ: tên, email, ...)
}

const userSlice = createSlice({
    name:'user1',
    initialState:initialState,
    reducers: {
        setUserInfo: (state, action) => {
            return {
                ...state,
                userInfo: action.payload
            }
        },
        login:(state,action) =>{
            const { status, userInfo, accessToken} = action.payload;
            return {
                ...state,
                'status': status,
                'userInfo': userInfo,
                'accessToken': accessToken,
            }
        },
        logout:(state, action) =>{
            localStorage.removeItem("access_token")
            return {
                ...state,
                userInfo: null,
            };
        }
    }
})

export const {login, logout, setUserInfo} = userSlice.actions
export default userSlice.reducer