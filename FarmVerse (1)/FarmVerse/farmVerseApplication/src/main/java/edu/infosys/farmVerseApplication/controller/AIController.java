package edu.infosys.farmVerseApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.aiService.ExpensePredictService;
import edu.infosys.farmVerseApplication.aiService.YieldPredictService;
import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCrop;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropReport;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.service.CropInputsService;
import edu.infosys.farmVerseApplication.service.CropService;

@RestController
@RequestMapping("/farmverse")
@CrossOrigin(
        origins = "http://localhost:3636",
        allowCredentials = "true"
)
public class AIController {

    @Autowired
    private YieldPredictService yService;

    @Autowired
    private ExpensePredictService eService;

    @Autowired
    private CropService cService;

    @Autowired
    private CropDao cropDao;

    @Autowired
    private CropInputsService iService;

    @Autowired
    private CropInputsDao cropInputsDao;

    @PostMapping("/yield/{id}")
    public FarmCrop getExpectedYield(
            @PathVariable String id) {

        Crop crop = cropDao.getCropById(id);

        FarmCrop farmCrop =
                cService.setFarmCrop(crop);

        FarmCrop predictedCrop =
                yService.predictYield(farmCrop);

        crop.setYield(predictedCrop.getYield());

        cropDao.addCrop(crop);

        return predictedCrop;
    }


     @PostMapping("/predict")
    public FarmCropInputs getExpectedExpenses(
            @RequestBody FarmCropInputs cropInputs) {

        return eService.predictResourceExpenses(cropInputs);
    }


        @PostMapping("/predict/{id}")
    public FarmCropReport getExpectedExpenses(
            @PathVariable String id) {

                FarmCropInputs farmCropInputs =
                iService.setFarmCropInputData(id);

        FarmCropInputs predictedInputs =
                eService.predictResourceExpenses(
                        farmCropInputs
                );

        CropInputs cropInputs =
                iService.setCropInputData(
                        predictedInputs
                );



        cropInputs.setAgroTools(1.0);

        cropInputsDao.addCropInputs(cropInputs);


                FarmCropReport report =
                iService.expenseCalculation(id);


                return report;
    }
}