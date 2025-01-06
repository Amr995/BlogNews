import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        post: [],
        postsCount: null,
        postsCate: [],
    },
    reducers: {
        setPosts(state, action) {
            state.post = action.payload;
        },
        setPostsCount(state, action) {
            state.postsCount = action.payload;
        },
        setPostCate(state, action) {
            state.postsCate = action.payload;
        },
    },
});

const postReducer = postSlice.reducer;
const postActions = postSlice.actions;

export { postActions, postReducer };