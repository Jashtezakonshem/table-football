import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.common["Content-Type"] = "application/json";
// I would use axios interceptor to add the token to the request header in a real world scenario
