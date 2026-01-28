import axios from "axios";

// create an axios instance with default settings
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
