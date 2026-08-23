import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CropExpenseReport.css";

const CropExpenseReport = () => {
  const { cropId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.post(
          `http://localhost:9696/farmverse/predict/${cropId}`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("Expense Prediction Response:", response.data);
        setReport(response.data);
      } catch (err) {
        console.error("Could not load crop expense report:", err);
        console.error("Backend response:", err.response?.data);

        setError(
          err.response?.data ||
            "Could not load crop expense report. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (cropId) {
      loadReport();
    } else {
      setLoading(false);
      setError("Crop ID was not provided.");
    }
  }, [cropId]);

  const formatValue = (value, suffix = "") => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    return `${value}${suffix}`;
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "₹0.00";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "₹0.00";
    }

    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <main className="cer-page">
        <div className="cer-container">
          <div className="cer-loading-card">
            <div className="cer-loading-icon">🌾</div>
            <h2>Preparing Crop Expense Report...</h2>
            <p>Calculating crop input expenses.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="cer-page">
        <div className="cer-container">
          <div className="cer-error-card">
            <div className="cer-error-icon">⚠</div>
            <h2>Crop Expense Report Unavailable</h2>
            <p>
              {error ||
                "No expense information was returned for this crop."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cer-page">
      <div className="cer-container">

        {/* HEADER */}
        <section className="cer-report-header">
          <div className="cer-title-area">
            <div className="cer-title-icon">🌾</div>

            <div>
              <div className="cer-small-heading">
                FARMVERSE · EXPENSE ANALYSIS
              </div>

              <h1>Crop Expense Report</h1>

              <p>
                Detailed crop input usage and expenditure report
              </p>
            </div>
          </div>

          <div className="cer-crop-badge">
            <span>Crop ID</span>
            <strong>{report.cropId || cropId}</strong>
          </div>
        </section>

        {/* CROP & FARM INFORMATION */}
        <section className="cer-section">
          <div className="cer-section-heading">
            <div className="cer-section-number">01</div>

            <div>
              <h2>Crop & Farm Information</h2>
              <p>
                Basic information about the selected crop and farm parcel.
              </p>
            </div>
          </div>

          <div className="cer-info-grid">

            <div className="cer-info-card">
              <span>Crop ID</span>
              <strong>{report.cropId || cropId || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Crop Name</span>
              <strong>{report.cropName || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Farm ID</span>
              <strong>
                {report.farmId !== null &&
                report.farmId !== undefined
                  ? `FLD-${report.farmId}`
                  : "N/A"}
              </strong>
            </div>

            <div className="cer-info-card">
              <span>Farm Name</span>
              <strong>{report.farmName || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Soil Type</span>
              <strong>{report.soil || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Crop Area</span>
              <strong>
                {formatValue(report.cropArea, " Acres")}
              </strong>
            </div>

            <div className="cer-info-card">
              <span>Sown Month</span>
              <strong>{report.sownMonthYear || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Harvest Month</span>
              <strong>{report.harvestMonthYear || "N/A"}</strong>
            </div>

            <div className="cer-info-card">
              <span>Expected / Recorded Yield</span>
              <strong>
                {formatValue(report.yield, " Qtl")}
              </strong>
            </div>

          </div>
        </section>

        {/* INPUT USAGE */}
        <section className="cer-section">
          <div className="cer-section-heading">
            <div className="cer-section-number">02</div>

            <div>
              <h2>Crop Input Usage</h2>
              <p>Resources used for the selected crop.</p>
            </div>
          </div>

          <div className="cer-input-table">

            <div className="cer-table-header">
              <span>Input</span>
              <span>Usage / Area</span>
              <span>Unit</span>
            </div>

            <div className="cer-table-row">
              <div className="cer-input-name">
                <span className="cer-input-icon">💧</span>
                <strong>Water</strong>
              </div>

              <strong>{report.water ?? "N/A"}</strong>
              <span>Gallons</span>
            </div>

            <div className="cer-table-row">
              <div className="cer-input-name">
                <span className="cer-input-icon">🌱</span>
                <strong>Fertilizer</strong>
              </div>

              <strong>{report.fertilizer ?? "N/A"}</strong>
              <span>kg</span>
            </div>

            <div className="cer-table-row">
              <div className="cer-input-name">
                <span className="cer-input-icon">🛡️</span>
                <strong>Pesticides</strong>
              </div>

              <strong>{report.pesticides ?? "N/A"}</strong>
              <span>kg</span>
            </div>

            <div className="cer-table-row">
              <div className="cer-input-name">
                <span className="cer-input-icon">🚜</span>
                <strong>Tractor Usage</strong>
              </div>

              <strong>{report.tractorHour ?? "N/A"}</strong>
              <span>Hours</span>
            </div>

            <div className="cer-table-row">
              <div className="cer-input-name">
                <span className="cer-input-icon">🔧</span>
                <strong>Agro Tools</strong>
              </div>

              <strong>{report.agroTools ?? "N/A"}</strong>
              <span>Units</span>
            </div>

          </div>
        </section>

        {/* EXPENSE BREAKDOWN */}
        <section className="cer-section">
          <div className="cer-section-heading">
            <div className="cer-section-number">03</div>

            <div>
              <h2>Expense Breakdown</h2>
              <p>
                Estimated expenditure calculated using the configured
                input rates.
              </p>
            </div>
          </div>

          <div className="cer-expense-table">

            <div className="cer-expense-header">
              <span>Expense Category</span>
              <span>Input Usage</span>
              <span>Expenditure</span>
            </div>

            <div className="cer-expense-row">
              <div className="cer-expense-name">
                <span className="cer-expense-dot">💧</span>

                <div>
                  <strong>Water</strong>
                  <small>Irrigation / water consumption</small>
                </div>
              </div>

              <span>{report.water ?? 0} Gallons</span>

              <strong className="cer-money">
                {formatMoney(report.waterExp)}
              </strong>
            </div>

            <div className="cer-expense-row">
              <div className="cer-expense-name">
                <span className="cer-expense-dot">🌱</span>

                <div>
                  <strong>Fertilizer</strong>
                  <small>Fertilizer consumption</small>
                </div>
              </div>

              <span>{report.fertilizer ?? 0} kg</span>

              <strong className="cer-money">
                {formatMoney(report.fertilizerExp)}
              </strong>
            </div>

            <div className="cer-expense-row">
              <div className="cer-expense-name">
                <span className="cer-expense-dot">🛡️</span>

                <div>
                  <strong>Pesticides</strong>
                  <small>Crop protection inputs</small>
                </div>
              </div>

              <span>{report.pesticides ?? 0} kg</span>

              <strong className="cer-money">
                {formatMoney(report.pesticidesExp)}
              </strong>
            </div>

            <div className="cer-expense-row">
              <div className="cer-expense-name">
                <span className="cer-expense-dot">🚜</span>

                <div>
                  <strong>Tractor</strong>
                  <small>Tractor operation</small>
                </div>
              </div>

              <span>{report.tractorHour ?? 0} Hours</span>

              <strong className="cer-money">
                {formatMoney(report.tractorExp)}
              </strong>
            </div>

            <div className="cer-expense-row">
              <div className="cer-expense-name">
                <span className="cer-expense-dot">🔧</span>

                <div>
                  <strong>Agro Tools</strong>
                  <small>Agricultural tools and equipment</small>
                </div>
              </div>

              <span>{report.agroTools ?? 0} Units</span>

              <strong className="cer-money">
                {formatMoney(report.agroToolsExp)}
              </strong>
            </div>

          </div>
        </section>

        {/* TOTAL */}
        <section className="cer-total-section">
          <div className="cer-total-left">
            <div className="cer-total-icon">₹</div>

            <div>
              <span>TOTAL EXPENDITURE / AREA</span>

              <p>
                Combined cost of water, fertilizer, pesticides,
                tractor usage and agro tools.
              </p>
            </div>
          </div>

          <div className="cer-total-value">
            {formatMoney(report.total)}
          </div>
        </section>

        {/* SUMMARY */}
        <section className="cer-summary">

          <div className="cer-summary-item">
            <span>Crop</span>
            <strong>{report.cropName || "N/A"}</strong>
          </div>

          <div className="cer-summary-item">
            <span>Area</span>
            <strong>
              {formatValue(report.cropArea, " Acres")}
            </strong>
          </div>

          <div className="cer-summary-item">
            <span>Farm</span>
            <strong>{report.farmName || "N/A"}</strong>
          </div>

          <div className="cer-summary-item">
            <span>Report ID</span>
            <strong>
              EXP-{report.cropId || cropId}
            </strong>
          </div>

        </section>

      </div>
    </main>
  );
};

export default CropExpenseReport;