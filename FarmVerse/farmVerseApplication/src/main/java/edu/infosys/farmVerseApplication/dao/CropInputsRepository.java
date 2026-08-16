package edu.infosys.farmVerseApplication.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.infosys.farmVerseApplication.bean.CropInputs;

@Repository
public interface CropInputsRepository extends JpaRepository<CropInputs, String> {

}