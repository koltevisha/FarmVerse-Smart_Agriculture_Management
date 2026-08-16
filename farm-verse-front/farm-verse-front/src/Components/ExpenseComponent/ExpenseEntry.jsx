
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addExpense,
  generateExpenseId,
} from "../../Services/AgroExpenseService";

import { FARM_FIELD_IMAGE } from "../../utils/cropAssets";

import "./ExpenseEntry.css";

const initialExpense = {
  expenseId: "",
  expenseName: "",
  unitName: "",
  ratePerUnit: "",
};

const ExpenseEntry = () => {
  const navigate = useNavigate();

  const [expense, setExpense] = useState(initialExpense);
  const [expenseId, setExpenseId] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadExpenseId();
  }, []);

  const loadExpenseId = () => {
    setLoading(true);

    generateExpenseId()
      .then((response) => {
        setExpenseId(response.data);
      })
      .catch((error) => {
        console.error("Expense ID generation error:", error);

        setStatus({
          type: "error",
          message:
            "Unable to generate Expense ID from server.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setExpense((values) => ({
      ...values,
      [name]: value,
    }));

    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: "",
        };
      }

      return prev;
    });

    setStatus(null);
  };

  const validate = () => {
    const temp = {};

    if (!expense.expenseName.trim()) {
      temp.expenseName =
        "Expense item name is required.";
    }

    if (!expense.unitName.trim()) {
      temp.unitName =
        "Unit of measurement is required.";
    }

    if (
      expense.ratePerUnit === "" ||
      Number(expense.ratePerUnit) <= 0
    ) {
      temp.ratePerUnit =
        "Unit rate must be greater than 0.";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setStatus(null);

    if (!validate()) {
      return;
    }

    setSaving(true);

    const payload = {
      ...expense,
      expenseId: expenseId,
      ratePerUnit: parseFloat(
        expense.ratePerUnit
      ),
    };

    addExpense(payload)
      .then(() => {
        setStatus({
          type: "success",
          message:
            `Expense EXP-${expenseId} logged successfully!`,
        });

        setExpense(initialExpense);

        loadExpenseId();
      })
      .catch((error) => {
        console.error(
          "Expense save error:",
          error
        );

        setStatus({
          type: "error",
          message:
            "Unable to save expense item. Please check network connection.",
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleReset = () => {
    setExpense(initialExpense);
    setErrors({});
    setStatus(null);
  };

  return (
    <div className="ee-page">

      <div className="ee-layout">

        {/* ==================================================
            LEFT IMAGE PANEL
        ================================================== */}

        <section
          className="ee-visual"
          style={{
            backgroundImage: `url("${FARM_FIELD_IMAGE}")`,
          }}
        >
          <div className="ee-visual-overlay" />

          <div className="ee-visual-content">

            {/* BRAND */}

            <div className="ee-brand">

              <div className="ee-brand-icon">
                🌱
              </div>

              <div>
                <div className="ee-brand-name">
                  FarmVerse
                </div>

                <div className="ee-brand-tagline">
                  PRECISION AGRICULTURE
                </div>
              </div>

            </div>


            {/* LEFT MESSAGE */}

            <div className="ee-visual-message">

              <span className="ee-visual-kicker">
                FARM ECONOMICS
              </span>

              <h2>
                Track every cost.
                <br />
                Manage smarter.
              </h2>

              <p>
                Organize seeds, fertilizer,
                labour, equipment, fuel and
                every other agricultural expense
                in one place.
              </p>

              <div className="ee-visual-line" />


              <div className="ee-visual-stats">

                <div>
                  <strong>
                    01
                  </strong>

                  <span>
                    INPUT COST
                  </span>
                </div>

                <div>
                  <strong>
                    02
                  </strong>

                  <span>
                    UNIT RATE
                  </span>
                </div>

                <div>
                  <strong>
                    03
                  </strong>

                  <span>
                    FARM LEDGER
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ==================================================
            RIGHT FORM PANEL
        ================================================== */}

        <section className="ee-form-panel">

          <div className="ee-form-inner">

            {/* TOP */}

            <div className="ee-form-top">

              <div>

                <span className="ee-record-badge">
                  EXPENSE RECORD
                </span>

                <h1>
                  Log Agro Expense
                </h1>

                <p>
                  Enter the cost details of your
                  agricultural input below.
                </p>

              </div>

              <button
                type="button"
                className="ee-back-btn"
                onClick={() =>
                  navigate("/expense-list")
                }
              >
                ← Back
              </button>

            </div>


            <div className="ee-divider" />


            {/* STATUS */}

            {status && (
              <div
                className={`ee-alert ee-alert-${status.type}`}
              >

                <span>
                  {status.type === "success"
                    ? "✓"
                    : "⚠"}
                </span>

                <p>
                  {status.message}
                </p>

                {status.type === "success" && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/expense-list")
                    }
                  >
                    View Expenses
                  </button>
                )}

              </div>
            )}


            {/* SECTION 01 */}

            <div className="ee-section-heading">

              <div className="ee-section-number">
                01
              </div>

              <div>

                <h2>
                  Expense Information
                </h2>

                <p>
                  Add the basic details of the
                  agricultural input.
                </p>

              </div>

            </div>


            {/* EXPENSE ID */}

            <div className="ee-id-row">

              <span>
                EXPENSE ID
              </span>

              <strong>
                EXP-{loading ? "..." : expenseId}
              </strong>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="ee-form"
            >

              <div className="ee-grid">

                {/* EXPENSE NAME */}

                <div
                  className={`ee-field ee-field-full ${
                    errors.expenseName
                      ? "is-error"
                      : ""
                  }`}
                >

                  <label htmlFor="expenseName">
                    EXPENSE ITEM NAME
                  </label>

                  <div className="ee-input-wrap">

                    <span className="ee-input-icon">
                      🌾
                    </span>

                    <input
                      id="expenseName"
                      name="expenseName"
                      type="text"
                      placeholder="e.g. NPK Fertilizer / Organic Compost / Diesel Fuel"
                      value={expense.expenseName}
                      onChange={onChangeHandler}
                      className="ee-input"
                    />

                  </div>

                  {errors.expenseName && (
                    <span className="ee-error">
                      {errors.expenseName}
                    </span>
                  )}

                </div>


                {/* UNIT */}

                <div
                  className={`ee-field ${
                    errors.unitName
                      ? "is-error"
                      : ""
                  }`}
                >

                  <label htmlFor="unitName">
                    UNIT OF MEASUREMENT
                  </label>

                  <div className="ee-input-wrap">

                    <span className="ee-input-icon">
                      ◉
                    </span>

                    <input
                      id="unitName"
                      name="unitName"
                      type="text"
                      placeholder="Kg, Litre, Hour, Packet"
                      value={expense.unitName}
                      onChange={onChangeHandler}
                      className="ee-input"
                    />

                  </div>

                  {errors.unitName && (
                    <span className="ee-error">
                      {errors.unitName}
                    </span>
                  )}

                </div>


                {/* RATE */}

                <div
                  className={`ee-field ${
                    errors.ratePerUnit
                      ? "is-error"
                      : ""
                  }`}
                >

                  <label htmlFor="ratePerUnit">
                    RATE PER UNIT (₹)
                  </label>

                  <div className="ee-input-wrap">

                    <span className="ee-input-icon">
                      ₹
                    </span>

                    <input
                      id="ratePerUnit"
                      name="ratePerUnit"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 450"
                      value={expense.ratePerUnit}
                      onChange={onChangeHandler}
                      className="ee-input"
                    />

                  </div>

                  {errors.ratePerUnit && (
                    <span className="ee-error">
                      {errors.ratePerUnit}
                    </span>
                  )}

                </div>

              </div>


              {/* SECTION 02 */}

              <div className="ee-section-heading ee-section-heading-second">

                <div className="ee-section-number">
                  02
                </div>

                <div>

                  <h2>
                    Cost Summary
                  </h2>

                  <p>
                    Review your expense entry
                    before saving it.
                  </p>

                </div>

              </div>


              {/* SUMMARY */}

              <div className="ee-summary-card">

                <div className="ee-summary-item">

                  <span>
                    INPUT
                  </span>

                  <strong>
                    {expense.expenseName ||
                      "Not entered"}
                  </strong>

                </div>


                <div className="ee-summary-item">

                  <span>
                    UNIT
                  </span>

                  <strong>
                    {expense.unitName ||
                      "Not entered"}
                  </strong>

                </div>


                <div className="ee-summary-item ee-summary-rate">

                  <span>
                    UNIT RATE
                  </span>

                  <strong>
                    ₹
                    {expense.ratePerUnit
                      ? Number(
                          expense.ratePerUnit
                        ).toLocaleString(
                          "en-IN"
                        )
                      : "0"}
                  </strong>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="ee-actions">

                <button
                  type="button"
                  className="ee-reset-btn"
                  onClick={handleReset}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="ee-submit-btn"
                  disabled={
                    saving || loading
                  }
                >
                  {saving
                    ? "Saving Expense..."
                    : "Save Expense Item →"}
                </button>

              </div>

            </form>


            {/* SECURITY */}

            <div className="ee-security">
              🔒 Expense information is securely
              recorded
              <span>•</span>
              FarmVerse
            </div>

          </div>
        </section>

      </div>

    </div>
  );
};

export default ExpenseEntry;
;
