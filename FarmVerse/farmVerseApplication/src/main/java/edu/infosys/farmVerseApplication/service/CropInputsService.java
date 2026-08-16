package edu.infosys.farmVerseApplication.service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.AgroExpense;
import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.dao.FarmDao;

@Service
public class CropInputsService {

    @Autowired
    private CropDao cropDao;

    @Autowired
    private FarmUserService service;

    @Autowired
    private FarmDao farmDao;

    @Autowired
    private AgroExpenseDao agroExpDao;

    @Autowired
    private CropInputsDao inputsDao;


    public FarmCropInputs setFarmCropInputData(String cropId) {

        Crop crop = cropDao.getCropById(cropId);

        Farm farm = farmDao.getFarmById(crop.getFarmId());

        return new FarmCropInputs(crop, farm.getSoil());
    }


    public CropInputs setCropInputData(FarmCropInputs farmCropInputs) {

        CropInputs cropInputs = new CropInputs(farmCropInputs);

        cropInputs.setAgroTools(1.0);

        return cropInputs;
    }


    public void expenseCalculation(String cropId) {

        // Get all expenses from database
        List<AgroExpense> expenseList = agroExpDao.getAllExpense();

        // Create map:
        // expense name -> AgroExpense object
        Map<String, AgroExpense> expenseMap = new HashMap<>();

        for (AgroExpense ae : expenseList) {

            expenseMap.put(ae.getExpenseName(), ae);
        }


        // Get crop input data
        CropInputs cropInputs = inputsDao.getCropInputsById(cropId);

        if (cropInputs == null) {

            System.out.println("Crop Inputs not found for cropId: " + cropId);

            return;
        }


        // Get all fields from CropInputs class
        Class<?> clazz = cropInputs.getClass();

        Field[] fields = clazz.getDeclaredFields();

        Double totValue = 0.0;


        try {

            for (Field fd : fields) {

                // Allow access to private fields
                fd.setAccessible(true);


                /*
                 * Example:
                 *
                 * fd.getName()
                 *
                 * waterGallon
                 * fertilizer
                 * pesticides
                 * tractorHour
                 * agroTools
                 */

                AgroExpense ae = expenseMap.get(fd.getName());


                // If matching expense exists in database
                if (ae != null) {

                    Object value = fd.get(cropInputs);


                    // Avoid NullPointerException
                    if (value != null) {

                        Double inputValue =
                                Double.parseDouble(value.toString());

                        Double perAcre =
                                ae.getRatePerUnit() * inputValue;


                        System.out.println(
                                ae.getExpenseName()
                                + " - Rate: "
                                + ae.getRatePerUnit()
                                + " - Input: "
                                + inputValue
                                + " - Cost: "
                                + perAcre
                        );


                        totValue = totValue + perAcre;
                    }
                }
            }

        } catch (Exception ex) {

            ex.printStackTrace();
        }


        System.out.println("Total Cost Per Acre: " + totValue);
    }
}