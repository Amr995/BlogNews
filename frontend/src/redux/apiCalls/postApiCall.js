import { postActions } from "../slices/postSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Fetch Posts Baased Page Number
export function fetchPosts(pageNumber) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts?pageNumber/${pageNumber}`);
            dispatch(postActions.setProfile(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

// Get Posts count
export function getPostsCount(pageNumber) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts/count`);
            dispatch(postActions.setProfile(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

// Fetch Posts Based On Category
export function fetchPostsBasedOnCategory(category) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts?category/${category}`);
            dispatch(postActions.setPostsCate(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

// Create Post
export function createPost(newPost) {
    return async (dispatch, getState) => {
        try {
            dispatch(postActions.setLoading());
            await request.post(`/api/posts`, newPost, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                    "Content-Type":"multipart/form-data"
                }
            });
            dispatch(postActions.setIsPostCreated());
            setTimeout(() => dispatch(postActions.clearIsPostCreated()), 2000); // 2s
        } catch (error) {
            toast.error(error.response.data.message);
            dispatch(postActions.clearLoading());
        }
    }
}