import axios from 'axios';

const FARM_URL ='http://localhost:9696/farmverse/farm';
const FID_URL = 'http://localhost:9696/farmverse/farm-id';
const FNO_URL = 'http://localhost:9696/farmverse/farm-no';

    
    export  const addFarm = (farm) => {
        return axios.post(FARM_URL, farm, {
            withCredentials: true
        });
    }

    
    export const updateFarm = (farm) => {
        return axios.put(FARM_URL, farm, {
            withCredentials: true
        });
    }

    
    export const getFarmById = (id) => {
        return axios.get(`${FARM_URL}/${id}`, {
            withCredentials: true
        });
    }

    export const getFarmsByUsername = () => {
        return axios.get(FARM_URL, {
            withCredentials: true
        });
    }

    export const deleteFarmById = (id) => {
        return axios.delete(`${FARM_URL}/${id}`, {
            withCredentials: true
        });
    }

    export const generateFarmId = () => {
        return axios.get(FID_URL, {
            withCredentials: true
        });
    }

    export const getAllFarmIdsByUser = () => {
        return axios.get(FNO_URL, {
            withCredentials: true
        });
    }
