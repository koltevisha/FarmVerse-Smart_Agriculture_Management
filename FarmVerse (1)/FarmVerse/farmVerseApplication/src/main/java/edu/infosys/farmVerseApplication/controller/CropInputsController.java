package edu.infosys.farmVerseApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropReport;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.service.CropInputsService;

@RestController
@RequestMapping("/farmverse")
@CrossOrigin(
    origins = "http://localhost:3636",
    allowCredentials = "true"
)
public class CropInputsController {

    @Autowired
    private CropInputsDao cropInputsDao;

    @Autowired
    private CropInputsService service;


    // ==========================================
    // ADD / SAVE CROP INPUTS
    // ==========================================

    @PostMapping("/crop-input")
    public CropInputs addCropInputs(
            @RequestBody FarmCropInputs farmCropInputs) {

        return service.setCropInputData(farmCropInputs);
    }


    // ==========================================
    // GET CROP INPUTS BY CROP ID
    // ==========================================

    @GetMapping("/crop-input/{cropId}")
    public CropInputs getCropInputsById(
            @PathVariable String cropId) {

        return cropInputsDao.getCropInputsById(cropId);
    }


    // ==========================================
    // DELETE CROP INPUTS BY CROP ID
    // ==========================================

    @DeleteMapping("/crop-input/{cropId}")
    public void deleteCropInputsById(
            @PathVariable String cropId) {

        cropInputsDao.deleteCropInputsById(cropId);
    }


    // ==========================================
    // CALCULATE CROP EXPENSE REPORT
    // ==========================================

    @GetMapping("/crop-exp/{id}")
    public FarmCropReport expenseCalculation(
            @PathVariable String id) {

        return service.expenseCalculation(id);
    }
}