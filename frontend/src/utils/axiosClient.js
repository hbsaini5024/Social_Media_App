import axios from "axios";
import store from "../redux/Store";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

//interceptors
//request interceptors used to passed authorization header with every API.
axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);

  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));

  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  store.dispatch(setLoading(false));
  const data = response.data;

  if (data.status === "Ok") {
    return response;
  }

  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.message;

  store.dispatch(
    showToast({
      type: TOAST_FAILURE,
      message: error.message,
    })
  );

  //when ur refresh token is also expired , then user gets logout and redirect user to login page to again relogin
  // if (
  //   statusCode === 401 &&
  //   originalRequest.url ===
  //     `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
  // ) {
  //     removeItem(KEY_ACCESS_TOKEN);
  //   window.location.replace("/login", "_self");
  //   return Promise.reject(error);
  // }

  //means the access token is expired
  if (statusCode === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const response = await axios
      .create({
        withCredentials: true,
      })
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

    console.log("response from backend", response);

    if (response.data.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.data.result.accessToken}`;
      return axios(originalRequest);
    } else {
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});
