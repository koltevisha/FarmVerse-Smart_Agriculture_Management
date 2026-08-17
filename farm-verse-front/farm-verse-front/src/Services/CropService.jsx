import axios from 'axios';
const CROP_URL = 'https://farmverse-smart-agriculture-management-3.onrender.com/farmverse/crop';
const ID_URL = 'https://farmverse-smart-agriculture-management-3.onrender.com/farmverse/crop-id';


	 export const addCrop = (crop) => {
		return axios.post(CROP_URL, crop, {
			withCredentials: true
		});
	}

	 export const updateCrop = (crop) => {
		return axios.put(CROP_URL, crop, {
			withCredentials: true
		});
	};

	 export const getCropById = (id) => {
	    return axios.get(`${CROP_URL}/${id}`, {
			withCredentials: true
		});
		}

	 export const getCropsByUsername = () => {
		return axios.get(CROP_URL, {
			withCredentials: true
		});
	}

	 export const deleteCropById = (id) => {
		return axios.delete(`${CROP_URL}/${id}`, {
			withCredentials: true
		});
	}

	 export const generateCropId = () => {
		return axios.get(ID_URL, {
			withCredentials: true
		});
	}

	