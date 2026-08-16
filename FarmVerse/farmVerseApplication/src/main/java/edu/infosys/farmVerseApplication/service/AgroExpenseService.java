package edu.infosys.farmVerseApplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;

@Service
public class AgroExpenseService {
	@Autowired
    private AgroExpenseDao agroExpenseDao;

    public Integer generateExpenseId() {

        Integer value = agroExpenseDao.getMaxExpenseId();

        if (value == null)
            value = 1001;
        else
            value = value + 1;

        return value;
        
    }
}