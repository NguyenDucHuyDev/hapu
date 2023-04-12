import { createSlice, current } from '@reduxjs/toolkit';
/**
 * @type {{ carts: import("../../../../type").CartInfo[] }}
 */
const initialState = {
    carts: [],
}

const cartSlice = createSlice({
    name:'cart',
    initialState:initialState,
    reducers: {
        updateCart: (state, action) => {
            const cart = state.carts.find((cart) => cart.id == action.payload.id)
            cart.quantity = action.payload.quantity
        },
        createCart: (state, action) => {
            state.carts.push(action.payload)
        },
        deleteCart: (state, action) => {
            const index = state.carts.findIndex((cart) => cart.id == action.payload.id)
            state.carts.splice(index, 1)
        },
        resetCart: (state, action) => {
            return {
                ...state,
                carts: []
            }
        },
        setCarts: (state, action) => {
            return {
                ...state,
                carts: action.payload
            }
        },
    }
})

export const { setCarts, updateCart, createCart, deleteCart, resetCart } = cartSlice.actions
export default cartSlice.reducer