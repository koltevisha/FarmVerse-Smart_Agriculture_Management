import axios from 'axios';

// Render backend URL
const BASE_URL =
    'https://farmverse-smart-agriculture-management-3.onrender.com';

// API URLs
const LOGIN_URL = `${BASE_URL}/farmverse/login`;
const LOGOUT_URL = `${BASE_URL}/farmverse/logout`;
const USR_URL = `${BASE_URL}/farmverse/user` ;

// Register new user
export const registerNewUser = (user) => {
 return axios.post(LOGIN_URL, user, {
  withCredentials: true,
  headers: {
   'Content-Type': 'application/json',
  },
 });
};

// Validate/login user
export const validateUser = (userId, password) => {
 return axios.get(`${LOGIN_URL}/${userId}/${password}`, {
  withCredentials: true,
 });
};

// Get logged-in user details
export const getUserDetails = () => {
 return axios.get(LOGIN_URL, {
  withCredentials: true,
 });
};

// Get current user ID/details
export const getUserId = () => {
 return axios.get(USR_URL, {
  withCredentials: true,
 });
};

// Logout user
export const logoutUser = () => {
 return axios.post(
     LOGOUT_URL,
     {},
     {
      withCredentials: true,
      headers: {
       'Content-Type': 'application/json',
      },
     }
 );
};