import axios from "axios";

const Y_URL = "https://farmverse-smart-agriculture-management-3.onrender.com/farmverse/yield";
const E_URL = "https://farmverse-smart-agriculture-management-3.onrender.com/farmverse/predict";

export const getExpectedYield = (id) => {
    return axios.post(`${Y_URL}/${id}`, {}, {
        withCredentials: true
    });
};

export const predictExpense = (id) => {
    return axios.post(`${E_URL}/${id}`, {}, {
        withCredentials: true
    });
};