import axios from "axios";

const Y_URL = "http://localhost:9696/farmverse/yield";
const E_URL = "http://localhost:9696/farmverse/predict";

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