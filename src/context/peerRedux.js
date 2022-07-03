import { createSlice } from "@reduxjs/toolkit";

const peerSlice = createSlice({
  name: "peer",
  initialState: {
    peer: null,
  },
  reducers: {
    addPeer: (state, action) => {
        state.peer = action.payload;
    },

  },
});

export const { addPeer } = peerSlice.actions;
export default peerSlice.reducer;