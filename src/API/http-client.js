import axios from "axios";

const token = "Bearer " + localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = token;
}

export const AXIOS = axios.create({
  baseURL: "http://localhost:8081/api/v1"
});
