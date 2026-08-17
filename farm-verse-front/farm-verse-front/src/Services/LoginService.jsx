import axios from 'axios';

const BASE_URL = 'https://farmverse-smart-agriculture-management-3.onrender.com';

const LOGIN_URL = `${BASE_URL}/farmverse/login`;
const LOGOUT_URL = `${BASE_URL}/farmverse/logout`;
const USR_URL = `${BASE_URL}/farmverse/user`;

export const registerNewUser = (user) => {
 return axios.post(LOGIN_URL, user, {
  withCredentials: true
 });
};

export const validateUser = (userId, password) => {
 return axios.get(`${LOGIN_URL}/${userId}/${password}`, {
  withCredentials: true
 });
};

export const getUserDetails = () => {
 return axios.get(LOGIN_URL, {
  withCredentials: true
 });
};

export const getUserId = () => {
 return axios.get(USR_URL, {
  withCredentials: true
 });
};

export const logoutUser = () => {
 return axios.post(LOGOUT_URL, {}, {
  withCredentials: true
 });
};