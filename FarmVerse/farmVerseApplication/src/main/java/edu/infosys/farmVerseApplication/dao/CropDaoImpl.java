package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Crop;

@Repository
@Service
public class CropDaoImpl implements CropDao {

	@Autowired
	private CropRepository repository;

	@Override
	public void addCrop(Crop crop) {
		// TODO Auto-generated method stub
		repository.save(crop);
	}

	@Override
	public Crop getCropById(String id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public List<Crop> getCropsByUsername(String username) {
		// TODO Auto-generated method stub
		return repository.getCropsByUsername(username);
	}
	
	@Override
	public void deleteCropById(String id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);
	}

	@Override
	public Integer getMaxCropId() {
		// TODO Auto-generated method stub
		return repository.getMaxCropId();
	}

	
	
	
}