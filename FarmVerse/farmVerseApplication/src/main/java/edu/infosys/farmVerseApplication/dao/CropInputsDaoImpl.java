package edu.infosys.farmVerseApplication.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import edu.infosys.farmVerseApplication.bean.CropInputs;

@Repository
public class CropInputsDaoImpl implements CropInputsDao {

    @Autowired
    private CropInputsRepository repository;

    @Override
    public void addCropInputs(CropInputs cropInputs) {
        repository.save(cropInputs);
    }

    @Override
    public CropInputs getCropInputsById(String id) {
        return repository.findById(id).get();
    }

    @Override
    public void deleteCropInputsById(String id) {
        repository.deleteById(id);
    }
}