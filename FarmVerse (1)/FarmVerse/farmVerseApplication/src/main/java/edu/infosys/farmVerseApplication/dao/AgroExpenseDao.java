package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

public interface AgroExpenseDao {
	public void addExpense(AgroExpense expense);
	public AgroExpense getExpenseById(Integer id);
	public void deleteExpenseById(Integer id);
	public Integer getMaxExpenseId();
	public List<AgroExpense> getAllExpense();
	

}