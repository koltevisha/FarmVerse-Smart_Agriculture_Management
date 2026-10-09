package edu.infosys.farmVerseApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import edu.infosys.farmVerseApplication.bean.AgroExpense;
import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;
import edu.infosys.farmVerseApplication.service.AgroExpenseService;

@RestController
@RequestMapping("/farmverse")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")
public class AgroExpenseController {

    @Autowired
    private AgroExpenseDao agroExpenseDao;

    @Autowired
    private AgroExpenseService service;

    @PostMapping("/exp")
    public void addAgroExpense(@RequestBody AgroExpense agroExpense) {
        agroExpenseDao.addExpense(agroExpense);
    }

    @PutMapping("/exp")
    public void updateAgroExpense(@RequestBody AgroExpense agroExpense) {
        agroExpenseDao.addExpense(agroExpense);
    }

    @GetMapping("/exp/{id}")
    public AgroExpense getAgroExpenseById(@PathVariable Integer id) {
        return agroExpenseDao.getExpenseById(id);
    }

    @GetMapping("/exp")
    public List<AgroExpense> getAllAgroExpenses() {
        return agroExpenseDao.getAllExpense();
    }

    @DeleteMapping("/exp/{id}")
    public void deleteAgroExpenseById(@PathVariable Integer id) {
        agroExpenseDao.deleteExpenseById(id);
    }

    @GetMapping("/exp-id")
    public Integer generateExpenseId() {
        return service.generateExpenseId();
    }
}