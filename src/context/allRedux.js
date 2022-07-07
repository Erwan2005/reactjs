import { createSlice } from "@reduxjs/toolkit";

const allSlice = createSlice({
    name: "all",
    initialState: {
        publications: [],
        story: [],
        users: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        //publications reducer
        addPub: (state, action) => {
            const temp = { ...action.payload }
            return {
                ...state,
                publications: [...state.publications, temp]
            }
        },
        rmvPub: (state, action) => {
            const data = state.publications.filter((el) => el.id !== action.payload);
            return {
                ...state,
                publications: data
            }
        },
        //story reducer
        addStory: (state, action) => {
            const temp = { ...action.payload }
            return {
                ...state,
                story: [...state.story, temp]
            }
        },
        //all users reducer
        addUsers: (state, action) => {
            const temp = { ...action.payload }
            return {
                ...state,
                users: [...state.users, temp]
            }
        },
    }
});

export const { rmvPub, addPub,addStory,addUsers } = allSlice.actions;
export default allSlice.reducer;