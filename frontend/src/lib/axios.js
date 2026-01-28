import axios from 'axios';

// Create an Axios instance with default configurations
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
});