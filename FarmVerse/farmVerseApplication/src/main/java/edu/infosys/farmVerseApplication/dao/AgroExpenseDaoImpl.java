package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

@Repository
@Service
public class AgroExpenseDaoImpl implements AgroExpenseDao {

    @Autowired
    private AgroExpenseRepository repository;

    @Override
    public void addExpense(AgroExpense expense) {
        repository.save(expense);
    }

    @Override
    public AgroExpense getExpenseById(Integer id) {
        return repository.findById(id).get();
    }

    @Override
    public void deleteExpenseById(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Integer getMaxExpenseId() {
        return repository.getMaxExpenseId();
    }

    @Override
    public List<AgroExpense> getAllExpense() {
        return repository.findAll();
    }

}