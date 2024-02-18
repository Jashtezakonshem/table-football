import axios from "axios";
import { notification } from "antd";

axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.common["Content-Type"] = "application/json";
// I would use axios interceptor to add the token to the request header in a real world scenario
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    notification.error({
      message: error.response?.data?.error || "Error",
    });
  },
);
