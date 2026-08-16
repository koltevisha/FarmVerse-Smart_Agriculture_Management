import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllExpense,
  deleteExpenseById,
} from "../../Services/AgroExpenseService";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

import "./ExpenseList.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ExpenseList = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setLoading(true);

    getAllExpense()
      .then((response) => {
        setExpenses(response.data || []);
      })
      .catch((error) => {
        console.error("Expenses load error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) {
      return;
    }

    setDeleting(true);

    deleteExpenseById(deleteConfirmId)
      .then(() => {
        setDeleteConfirmId(null);
        loadExpenses();
      })
      .catch((error) => {
        console.error("Delete expense error:", error);
        alert("Unable to delete expense item.");
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return expenses;
    }

    return expenses.filter((expense) => {
      return (
        expense.expenseName
          ?.toLowerCase()
          .includes(query) ||
        expense.unitName
          ?.toLowerCase()
          .includes(query) ||
        String(expense.expenseId).includes(query)
      );
    });
  }, [expenses, search]);

  const chartData = useMemo(() => {
    if (!expenses.length) {
      return null;
    }

    const labels = expenses.map(
      (expense) =>
        expense.expenseName ||
        `EXP-${expense.expenseId}`
    );

    const data = expenses.map(
      (expense) =>
        Number(expense.ratePerUnit) || 0
    );

    const colors = [
      "#0D2218",
      "#4E7842",
      "#BD9650",
      "#362217",
      "#B8583B",
      "#7CA064",
      "#5E685F",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Unit Rate (₹)",
          data,
          backgroundColor: colors.slice(
            0,
            expenses.length
          ),
          borderColor: "#FAF8F3",
          borderWidth: 2,
        },
      ],
    };
  }, [expenses]);

  const totalItemCount = expenses.length;

  const avgRate = useMemo(() => {
    if (!expenses.length) {
      return 0;
    }

    const total = expenses.reduce(
      (sum, expense) =>
        sum +
        (Number(expense.ratePerUnit) || 0),
      0
    );

    return Math.round(
      total / expenses.length
    );
  }, [expenses]);

  return (
    <div className="el-page">

      <main className="el-main">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="el-top-bar">

          <div>
            <span className="el-eyebrow">
              FARM ECONOMICS
            </span>

            <h1 className="el-title">
              Expense Analytics
            </h1>

            <p className="el-subtitle">
              Comprehensive breakdown of agricultural
              input costs, rates, and expenditure analytics.
            </p>
          </div>

          <button
            type="button"
            className="el-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

        </div>


        {/* ==================================================
            KPI ROW
        ================================================== */}

        <section className="el-kpi-row">

          <div className="el-kpi-card">

            <span className="el-kpi-icon">
              🧾
            </span>

            <div>
              <span className="el-kpi-label">
                Recorded Inputs
              </span>

              <h3 className="el-kpi-val">
                {totalItemCount} Items
              </h3>
            </div>

          </div>


          <div className="el-kpi-card">

            <span className="el-kpi-icon">
              💰
            </span>

            <div>
              <span className="el-kpi-label">
                Average Unit Cost
              </span>

              <h3 className="el-kpi-val">
                ₹{avgRate.toLocaleString("en-IN")}
              </h3>
            </div>

          </div>


          <button
            type="button"
            className="el-kpi-card el-kpi-action"
            onClick={() =>
              navigate("/expense-entry")
            }
          >

            <span className="el-kpi-icon">
              ➕
            </span>

            <div>
              <span className="el-kpi-label">
                Financial Ledger
              </span>

              <h3 className="el-kpi-val">
                + Log Expense
              </h3>
            </div>

          </button>

        </section>


        {/* ==================================================
            ANALYTICS
        ================================================== */}

        {expenses.length > 0 &&
          chartData && (
            <section className="el-chart-section">

              <div className="el-chart-card">

                <h4>
                  Agro Expense Distribution (₹)
                </h4>

                <div className="el-chart-container">

                  <Doughnut
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />

                </div>

              </div>


              <div className="el-chart-card">

                <h4>
                  Input Unit Rate Comparison
                </h4>

                <div className="el-chart-container">

                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: "#66736B",
                          },
                          grid: {
                            color:
                              "rgba(117, 100, 61, 0.10)",
                          },
                        },
                        y: {
                          ticks: {
                            color: "#66736B",
                          },
                          grid: {
                            color:
                              "rgba(117, 100, 61, 0.10)",
                          },
                        },
                      },
                    }}
                  />

                </div>

              </div>

            </section>
          )}


        {/* ==================================================
            EXPENSE LEDGER
        ================================================== */}

        <section className="el-table-card">

          <div className="el-table-header">

            <div>

              <span className="el-section-label">
                FINANCIAL RECORDS
              </span>

              <h3>
                Farm Expense Ledger
              </h3>

              <p>
                Filter and manage logged input items
                and unit rates.
              </p>

            </div>


            <div className="el-header-actions">

              <div className="el-search-box">

                <span className="el-search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search expense items..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="el-search-input"
                />

              </div>

              <button
                type="button"
                className="el-header-add"
                onClick={() =>
                  navigate("/expense-entry")
                }
              >
                + Add Expense
              </button>

            </div>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="el-state-box">

              <div className="el-spinner" />

              <h4>
                Loading expense ledger...
              </h4>

              <p>
                Preparing your farm economics.
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredExpenses.length === 0 && (
              <div className="el-empty-box">

                <span className="el-empty-icon">
                  🧾
                </span>

                <span className="el-empty-label">
                  FARM ECONOMICS
                </span>

                <h4>
                  No Expense Items Recorded
                </h4>

                <p>
                  Log your agricultural input costs
                  such as seeds, fertilizer, labor,
                  irrigation, and fuel.
                </p>

                <button
                  type="button"
                  className="el-add-btn"
                  onClick={() =>
                    navigate("/expense-entry")
                  }
                >
                  + Log Expense Item
                </button>

              </div>
            )}


          {/* TABLE */}

          {!loading &&
            filteredExpenses.length > 0 && (
              <div className="el-table-wrap">

                <table className="el-table">

                  <thead>
                    <tr>
                      <th>
                        Item Code
                      </th>

                      <th>
                        Input Name
                      </th>

                      <th>
                        Unit Measure
                      </th>

                      <th>
                        Rate Per Unit (₹)
                      </th>

                      <th
                        style={{
                          textAlign: "right",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredExpenses.map(
                      (expense) => (
                        <tr
                          key={expense.expenseId}
                        >

                          <td>
                            <span className="el-id-badge">
                              EXP-{expense.expenseId}
                            </span>
                          </td>

                          <td className="el-item-name">
                            {expense.expenseName}
                          </td>

                          <td>
                            <span className="el-unit-tag">
                              {expense.unitName}
                            </span>
                          </td>

                          <td className="el-rate-val">
                            ₹
                            {Number(
                              expense.ratePerUnit
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            <button
                              type="button"
                              className="el-btn-del"
                              onClick={() =>
                                setDeleteConfirmId(
                                  expense.expenseId
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="el-footer">
          🔒 Farm expense information securely recorded
          <span>•</span>
          FarmVerse
        </footer>

      </main>


      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      {deleteConfirmId && (
        <div
          className="el-modal-overlay"
          onClick={() => {
            if (!deleting) {
              setDeleteConfirmId(null);
            }
          }}
        >

          <div
            className="el-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="el-modal-icon">
              !
            </div>

            <span className="el-modal-label">
              FARM ECONOMICS
            </span>

            <h3>
              Delete Expense Record
            </h3>

            <p>
              Are you sure you want to remove item
              <strong>
                {" "}EXP-{deleteConfirmId}
              </strong>
              {" "}from your ledger?
            </p>

            <div className="el-modal-actions">

              <button
                type="button"
                className="el-btn-cancel"
                onClick={() =>
                  setDeleteConfirmId(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="el-btn-confirm"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Item"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ExpenseList;