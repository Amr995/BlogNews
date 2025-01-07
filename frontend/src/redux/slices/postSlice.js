import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        post: [],
        postsCount: null,
        postsCate: [],
        loading:false,
        isPostCreated: false,

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
        setLoading(state) {
            state.loading = true;
        },
        clearLoading(state) {
            state.loading = false;
        },
        setIsPostCreated(state) {
            state.isPostCreated = true;
            state.loading = false;
        },
        clearIsPostCreated(state) {
            state.isPostCreated = false;
        }
    },
});

const postReducer = postSlice.reducer;
const postActions = postSlice.actions;

export { postActions, postReducer };