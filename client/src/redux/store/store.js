import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/user/cartSlice';
import adminSlice from '../features/admin/adminSlice';

export const store = configureStore ({
    reducer:{
        user:userReducer,
        cart: cartReducer,
        admin: adminSlice,
    },
});
