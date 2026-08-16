import axios from "axios";

const EXPENSE_URL = "http://localhost:9696/farmverse/exp";
const ID_URL = "http://localhost:9696/farmverse/exp-id";

export const addExpense = (expense) => {
  return axios.post(`${EXPENSE_URL}`, expense, {
    withCredentials: true,
  });
};

export const updateExpense = (expense) => {
  return axios.put(`${EXPENSE_URL}`, expense, {
    withCredentials: true,
  });
};

export const getExpenseById = (id) => {
  return axios.get(`${EXPENSE_URL}/${id}`, {
    withCredentials: true,
  });
};

export const getAllExpense = () => {
  return axios.get(`${EXPENSE_URL}`, {
    withCredentials: true,
  });
};

export const deleteExpenseById = (id) => {
  return axios.delete(`${EXPENSE_URL}/${id}`, {
    withCredentials: true,
  });
};

export const generateExpenseId = () => {
  return axios.get(`${ID_URL}`, {
    withCredentials: true,
  });
};