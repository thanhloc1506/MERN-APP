import axios from "axios";
import React, { useEffect, useState, useReducer, createContext } from "react";
import { postReducer } from "../reducers/postReducer";
import { apiUrl } from "./constants";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
  const [postState, dispatch] = useReducer(postReducer, {
    post: null,
    posts: [],
    postLoading: true,
  });

  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}posts/`);
      if (response.data.success) {
        dispatch({
          type: "POSTS_LOADED_SUCCESS",
          payload: response.data.posts,
        });
      }
    } catch (error) {
      dispatch({ type: "POSTS_LOADED_FAIL" });
    }
  };

  const createPost = async (newPost) => {
    try {
      const response = await axios.post(`${apiUrl}posts/`, newPost);
      if (response.data.success) {
        dispatch({
          type: "CREATE_POST",
          payload: response.data.message,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  const findPost = (postId) => {
    const post = postState.posts.find((post) => post._id === postId);
    dispatch({
      type: "FIND_POST",
      payload: post,
    });
  };

  const updatePost = async (updatedPost) => {
    try {
      const response = await axios.put(
        `${apiUrl}posts/${updatedPost._id}`,
        updatedPost
      );
      if (response.data.success) {
        dispatch({
          type: "UPDATE_POST",
          payload: response.data.updatedPost,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  const deletePost = async (postID) => {
    try {
      const response = await axios.delete(`${apiUrl}posts/${postID}`);
      if (response.data.success) {
        dispatch({
          type: "DELETE_POST",
          payload: postID,
        });
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  const postContextData = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    findPost,
    showAddPostModal,
    setShowAddPostModal,
    showUpdatePostModal,
    setShowUpdatePostModal,
    postState,
  };

  return (
    <PostContext.Provider value={postContextData}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
