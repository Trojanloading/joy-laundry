// eslint-disable-next-line semi
import axios from "axios";
// eslint-disable-next-line semi
import { MessageBox, Message } from "element-ui";
// eslint-disable-next-line semi
import store from "@/store";
// eslint-disable-next-line semi
import { getToken } from "@/utils/auth";
// eslint-disable-next-line semi
import moment from "moment";
// eslint-disable-next-line semi
import md5 from "js-md5";
// import { getLanguage } from '@/langs/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // baseURL: "https://s4a-api-staging.wistkey.com/",
  // baseURL: "https://s4a-api-testing.wistkey.com/",
  timeout: 60000, // request timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "app-id": "564452e4-6501-11e9-bd7e-b8cacc9eb5b0",
    "language-code": "en"
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const time = moment().format("YYYY-MM-DD HH:mm:ss"); // 2019-01-09 11:22:29
    const secret = md5(
      "101b13d8-3746-47da-81fc-7801b735c02a" +
        ":" +
        "__:SPE-WMS:__" +
        ":" +
        time
    );
    config.headers["request-time"] = time;
    config.headers["secret"] = secret;

    if (getToken()) {
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response;
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res.data;
    }
  },
  error => {
    console.log({ error });
    console.log("err" + error); // for debug
    if (error.response.data.error.code === "10020") {
      Message({
        message: "You have been logged out, you can log in again",
        type: "error",
        duration: 5 * 1000
      });
      store.dispatch("user/logout").then(() => {
        location.reload();
      });
    }
    if (error.status === 500) {
      Message({
        message: "Network connection failure",
        type: "error",
        duration: 5 * 1000
      });
    } else {
      if (error.message.includes("timeout")) {
        Message({
          message: "Network connection error, please try again",
          type: "error",
          duration: 5 * 1000
        });
      }
      Message({
        message: error.response.data.error.message,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
