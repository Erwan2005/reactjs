import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    avatarUpdate: (state, action) => {
      state.isFetching = false;
      state.currentUser.avatar = action.payload
    },
    covertUpdate: (state, action) => {
      state.isFetching = false;
      state.currentUser.img_covert = action.payload
    },
    themeUpdate: (state, action) =>{
      state.isFetching = false;
      state.currentUser.color = action.payload
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, avatarUpdate, covertUpdate, themeUpdate } = userSlice.actions;
export default userSlice.reducer;