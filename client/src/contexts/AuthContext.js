import { createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducers/authReducer";
import { setAuthToken } from "../utils/setAuthToken";
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./constants";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  const loadUser = async () => {
    // if (Cookies.get("token")) {
    //   console.log(Cookies.get("token"));
    //   setAuthToken(Cookies.get("token"));
    // }
    if (localStorage["token"]) {
      setAuthToken(localStorage["token"]);
    }
    try {
      const response = await axios.get(`${apiUrl}users`);
      if (response.data.success) {
        dispatch({
          type: "SET_AUTH",
          payload: { isAuthenticated: true, user: response.data.user },
        });
      }
    } catch (error) {
      Cookies.remove("token");
      setAuthToken(null);
      dispatch({
        type: "SET_AUTH",
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  useEffect(() => loadUser(), []);

  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}users/login`, userForm);

      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
      }

      await loadUser();

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const registerUser = async (registerForm) => {
    try {
      const response = await axios.post(
        `${apiUrl}users/register`,
        registerForm
      );

      await loadUser();

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const logoutUser = async () => {
    // await axios.get(`${apiUrl}users/logout`);
    localStorage.removeItem("token");
    await setAuthToken(null);
    await dispatch({
      type: "SET_AUTH",
      payload: { isAuthenticated: false, user: null },
    });
  };

  const authContextData = { loginUser, registerUser, logoutUser, authState };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
