import axios from "axios";

const CIN_URL = "http://localhost:9696/farmverse/crop-inputs";

// Add crop inputs
export const addCropInputs = (farmCropInputs) => {
  return axios.post(
    CIN_URL,
    farmCropInputs,
    {
      withCredentials: true,
    }
  );
};

// Get crop inputs by crop ID
export const getCropInputsById = (id) => {
  return axios.get(
    `${CIN_URL}/${id}`,
    {
      withCredentials: true,
    }
  );
};

// Delete crop inputs by crop ID
export const deleteCropInputsById = (id) => {
  return axios.delete(
    `${CIN_URL}/${id}`,
    {
      withCredentials: true,
    }
  );
};