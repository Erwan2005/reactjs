import { createSlice } from "@reduxjs/toolkit";

const pubSlice = createSlice({
    name: "publication",
    initialState: {
        publications: [],
        isFetching: false,
        error: false,
    },
    reducers: {
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
    }
});

export const { rmvPub, addPub } = pubSlice.actions;
export default pubSlice.reducer;