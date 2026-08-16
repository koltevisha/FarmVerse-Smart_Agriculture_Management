package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Farm;

@Repository
@Service
public class FarmDaoImpl implements FarmDao {
	
	@Autowired
	private FarmRepository repository;

	@Override
	public void addFarm(Farm farm) {
		// TODO Auto-generated method stub
		repository.save(farm);

	}

	@Override
	public Farm getFarmById(Long id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public List<Farm> getFarmsByUsername(String username) {
		// TODO Auto-generated method stub
		return repository.getFarmsByUsername(username);
	}

	@Override
	public void deleteFarmById(Long id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);
	}

	@Override
	public Long getMaxFarmId() {
		// TODO Auto-generated method stub
		return repository.getMaxFarmId();
	}

}