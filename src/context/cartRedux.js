import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
  },
  reducers: {
    addCart: (state, action) => {
      const IteamIndex = state.carts.findIndex((iteam) => iteam.id === action.payload.id);

      if (IteamIndex >= 0) {
        state.carts[IteamIndex].quantity += 1
        return {
          ...state,
          carts: [...state.carts]
        }
      } else {
        const temp = { ...action.payload, quantity: 1 }
        return {
          ...state,
          carts: [...state.carts, temp]
        }
      }
    },
    rmvCart: (state, action) => {
      const data = state.carts.filter((el) => el.id !== action.payload);
      // console.log(data);

      return {
        ...state,
        carts: data
      }
    },
    rmvOne: (state, action) => {
      const IteamIndex_dec = state.carts.findIndex((iteam) => iteam.id === action.payload.id);

      if (state.carts[IteamIndex_dec].qnty >= 1) {
        const dltiteams = state.carts[IteamIndex_dec].qnty -= 1
        console.log([...state.carts, dltiteams]);

        return {
          ...state,
          carts: [...state.carts]
        }
      } else if (state.carts[IteamIndex_dec].qnty === 1) {
        const data = state.carts.filter((el) => el.id !== action.payload);

        return {
          ...state,
          carts: data
        }
      }
    }
  },
});

export const { addCart, rmvCart, rmvOne } = cartSlice.actions;
export default cartSlice.reducer;