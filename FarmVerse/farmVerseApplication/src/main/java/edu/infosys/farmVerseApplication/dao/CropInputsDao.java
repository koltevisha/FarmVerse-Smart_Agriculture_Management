package edu.infosys.farmVerseApplication.dao;

import edu.infosys.farmVerseApplication.bean.CropInputs;

public interface CropInputsDao {

    public void addCropInputs(CropInputs cropInputs);

    public CropInputs getCropInputsById(String id);

    public void deleteCropInputsById(String id);

}