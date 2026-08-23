package edu.infosys.farmVerseApplication.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

public interface AgroExpenseRepository extends JpaRepository<AgroExpense, Integer> {

    @Query("Select max(expenseId) from AgroExpense")
    public Integer getMaxExpenseId();

}