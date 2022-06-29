import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    onSuccess: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.onSuccess = true;
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
      state.currentUser.covert = action.payload
    },
    themeUpdate: (state, action) =>{
      state.isFetching = false;
      state.currentUser.theme = action.payload
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, avatarUpdate, covertUpdate, themeUpdate } = userSlice.actions;
export default userSlice.reducer;