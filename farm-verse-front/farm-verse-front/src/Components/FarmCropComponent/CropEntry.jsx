import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  addCrop,
  generateCropId,
} from "../../Services/CropService";

import {
  getAllFarmIdsByUser,
} from "../../Services/FarmService";

import "./CropEntry.css";

/* ============================================================
   CROP IMAGE
   ============================================================ */

const CROP_FIELD_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=85";

/* ============================================================
   INITIAL CROP
   ============================================================ */

const initialCrop = {
  cropId: "",
  farmId: "",
  username: "abcd",
  cropName: "",
  cropArea: "",
  sownMonthYear: "",
  harvestMonthYear: "",
  yield: 0.0,
};

/* ============================================================
   MONTH LABELS
   ============================================================ */

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ============================================================
   COMPONENT
   ============================================================ */

const CropEntry = () => {
  const navigate = useNavigate();

  const [crop, setCrop] = useState(initialCrop);
  const [errors, setErrors] = useState({});
  const [newId, setNewId] = useState("");
  const [farmIds, setFarmIds] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  /* ==========================================================
     LOAD CROP ID AND FARM IDS
     ========================================================== */

  useEffect(() => {
    let active = true;

    setLoadingMeta(true);

    Promise.all([
      generateCropId(),
      getAllFarmIdsByUser(),
    ])
      .then(([idResponse, farmResponse]) => {
        if (!active) return;

        setNewId(idResponse.data);
        setFarmIds(farmResponse.data || []);
      })
      .catch(() => {
        if (!active) return;

        setStatus({
          type: "error",
          message:
            "Couldn't load crop metadata or farm IDs. Please refresh.",
        });
      })
      .finally(() => {
        if (active) {
          setLoadingMeta(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* ==========================================================
     INPUT CHANGE
     ========================================================== */

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setCrop((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const updated = {
        ...previous,
      };

      delete updated[name];

      return updated;
    });
  };

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validate = () => {
    const tempErrors = {};

    if (!crop.farmId) {
      tempErrors.farmId =
        "Select the farm parcel where this crop is planted.";
    }

    if (!crop.cropName.trim()) {
      tempErrors.cropName =
        "Crop name is required.";
    }

    const area = parseFloat(crop.cropArea);

    if (
      crop.cropArea === "" ||
      Number.isNaN(area) ||
      area <= 0
    ) {
      tempErrors.cropArea =
        "Enter a valid crop area greater than 0.";
    }

    if (!crop.sownMonthYear) {
      tempErrors.sownMonthYear =
        "Sowing month & year is required.";
    }

    if (
      crop.sownMonthYear &&
      crop.harvestMonthYear &&
      crop.harvestMonthYear < crop.sownMonthYear
    ) {
      tempErrors.harvestMonthYear =
        "Harvest date cannot precede sowing date.";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    setStatus(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      ...crop,
      cropId: newId,
      cropArea: parseFloat(crop.cropArea),
    };

    addCrop(payload)
      .then((response) => {
        if (
          response.data ===
          "Total crop area cannot exceed the farm area."
        ) {
          setStatus({
            type: "error",
            message: response.data,
          });

          return;
        }

        setStatus({
          type: "success",
          message:
            `Crop entry CRP-${newId} saved successfully!`,
        });

        setCrop({
          ...initialCrop,
          farmId: crop.farmId,
        });

        generateCropId().then((res) => {
          setNewId(res.data);
        });
      })
      .catch(() => {
        setStatus({
          type: "error",
          message:
            "Error saving crop entry. Please check network connection.",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  /* ==========================================================
     RESET
     ========================================================== */

  const handleReset = () => {
    setCrop((previous) => ({
      ...initialCrop,
      farmId: previous.farmId,
    }));

    setErrors({});
    setStatus(null);
  };

  /* ==========================================================
     MONTH NUMBERS
     ========================================================== */

  const sownMonthNum = crop.sownMonthYear
    ? parseInt(
        crop.sownMonthYear.split("-")[1],
        10
      )
    : null;

  const harvestMonthNum = crop.harvestMonthYear
    ? parseInt(
        crop.harvestMonthYear.split("-")[1],
        10
      )
    : null;

  /* ==========================================================
     ACTIVE MONTHS
     ========================================================== */

  const activeMonths = useMemo(() => {
    if (!sownMonthNum || !harvestMonthNum) {
      return new Set();
    }

    const months = new Set([
      sownMonthNum,
    ]);

    let currentMonth = sownMonthNum;
    let guard = 0;

    while (
      currentMonth !== harvestMonthNum &&
      guard < 12
    ) {
      currentMonth =
        currentMonth === 12
          ? 1
          : currentMonth + 1;

      months.add(currentMonth);

      guard++;
    }

    return months;
  }, [
    sownMonthNum,
    harvestMonthNum,
  ]);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="crop-page">

      <div className="crop-card">

        {/* ====================================================
            LEFT IMAGE
            ==================================================== */}

        <section className="crop-image-side">

          <div
            className="crop-image-inner"
            style={{
              backgroundImage: `
                linear-gradient(
                  180deg,
                  rgba(10, 58, 39, 0.08) 0%,
                  rgba(7, 48, 32, 0.35) 45%,
                  rgba(5, 37, 25, 0.95) 100%
                ),
                url("${CROP_FIELD_IMAGE}")
              `,
            }}
          >

            {/* BRAND */}

            <div className="crop-brand">

              <div className="crop-brand-icon">
                🌱
              </div>

              <div>

                <div className="crop-brand-name">
                  FarmVerse
                </div>

                <div className="crop-brand-subtitle">
                  PRECISION AGRICULTURE
                </div>

              </div>

            </div>

            {/* IMAGE CONTENT */}

            <div className="crop-image-bottom">

              <div className="crop-image-tag">
                CROP MANAGEMENT
              </div>

              <h1>
                Grow better.
                <br />
                Track smarter.
              </h1>

              <p>
                Organize your crops, planting schedules,
                and harvest timelines in one simple place.
              </p>

              <div className="crop-image-line"></div>

              <div className="crop-image-stats">

                <div>
                  <strong>01</strong>
                  <span>CROP DETAILS</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>GROWTH PERIOD</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>HARVEST PLAN</span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            RIGHT FORM
            ==================================================== */}

        <section className="crop-form-side">

          <div className="crop-form-wrapper">

            {/* HEADER */}

            <div className="crop-top-header">

              <div>

                <div className="crop-record-badge">
                  CROP RECORD
                </div>

                {/* ONE LINE */}
                <h2>
                  Add Your Crop
                </h2>

                <p>
                  Enter the details of your crop below.
                </p>

              </div>

              <button
                type="button"
                className="crop-back-button"
                onClick={() =>
                  navigate("/crop-list")
                }
              >
                <span>←</span>
                Back
              </button>

            </div>

            <div className="crop-divider"></div>

            {/* STATUS */}

            {status && (
              <div
                className={
                  `crop-alert crop-alert-${status.type}`
                }
              >

                <span>
                  {status.message}
                </span>

                {status.type === "success" && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/crop-list")
                    }
                  >
                    View Journal
                  </button>
                )}

              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="crop-form"
            >

              {/* =================================================
                  SECTION 01
                  ================================================= */}

              <div className="crop-section">

                <div className="crop-section-heading">

                  <div className="crop-section-number">
                    01
                  </div>

                  <div>

                    <h3>
                      Crop Information
                    </h3>

                    <p>
                      Basic information about your crop.
                    </p>

                  </div>

                </div>

                <div className="crop-fields-grid">

                  {/* FARM */}

                  <div
                    className={
                      `crop-field ${
                        errors.farmId
                          ? "has-error"
                          : ""
                      }`
                    }
                  >

                    <label htmlFor="farmId">
                      Target Farm Parcel
                    </label>

                    <select
                      id="farmId"
                      name="farmId"
                      value={crop.farmId}
                      onChange={onChangeHandler}
                      className="crop-input"
                      disabled={loadingMeta}
                    >

                      <option value="">
                        {
                          loadingMeta
                            ? "Loading farm list..."
                            : "Select Farm Parcel"
                        }
                      </option>

                      {farmIds.map((id) => (
                        <option
                          key={id}
                          value={id}
                        >
                          Farm FLD-{id}
                        </option>
                      ))}

                    </select>

                    {errors.farmId && (
                      <span className="crop-error">
                        {errors.farmId}
                      </span>
                    )}

                  </div>

                  {/* CROP NAME */}

                  <div
                    className={
                      `crop-field ${
                        errors.cropName
                          ? "has-error"
                          : ""
                      }`
                    }
                  >

                    <label htmlFor="cropName">
                      Crop Variety / Species
                    </label>

                    <input
                      id="cropName"
                      name="cropName"
                      type="text"
                      placeholder="e.g. Basmati Rice"
                      value={crop.cropName}
                      onChange={onChangeHandler}
                      className="crop-input"
                    />

                    {errors.cropName && (
                      <span className="crop-error">
                        {errors.cropName}
                      </span>
                    )}

                  </div>

                  {/* AREA */}

                  <div
                    className={
                      `crop-field ${
                        errors.cropArea
                          ? "has-error"
                          : ""
                      }`
                    }
                  >

                    <label htmlFor="cropArea">
                      Planted Area (Acres)
                    </label>

                    <input
                      id="cropArea"
                      name="cropArea"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 3.25"
                      value={crop.cropArea}
                      onChange={onChangeHandler}
                      className="crop-input"
                    />

                    {errors.cropArea && (
                      <span className="crop-error">
                        {errors.cropArea}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  SECTION 02
                  ================================================= */}

              <div className="crop-section">

                <div className="crop-section-heading">

                  <div className="crop-section-number">
                    02
                  </div>

                  <div>

                    <h3>
                      Crop Timeline
                    </h3>

                    <p>
                      Set the growing and harvesting period.
                    </p>

                  </div>

                </div>

                <div className="crop-fields-grid">

                  {/* SOWING */}

                  <div
                    className={
                      `crop-field ${
                        errors.sownMonthYear
                          ? "has-error"
                          : ""
                      }`
                    }
                  >

                    <label htmlFor="sownMonthYear">
                      Sowing Month & Year
                    </label>

                    <input
                      id="sownMonthYear"
                      name="sownMonthYear"
                      type="month"
                      value={crop.sownMonthYear}
                      onChange={onChangeHandler}
                      className="crop-input"
                    />

                    {errors.sownMonthYear && (
                      <span className="crop-error">
                        {errors.sownMonthYear}
                      </span>
                    )}

                  </div>

                  {/* HARVEST */}

                  <div
                    className={
                      `crop-field ${
                        errors.harvestMonthYear
                          ? "has-error"
                          : ""
                      }`
                    }
                  >

                    <label htmlFor="harvestMonthYear">
                      Estimated Harvest
                    </label>

                    <input
                      id="harvestMonthYear"
                      name="harvestMonthYear"
                      type="month"
                      value={crop.harvestMonthYear}
                      onChange={onChangeHandler}
                      className="crop-input"
                    />

                    {errors.harvestMonthYear && (
                      <span className="crop-error">
                        {errors.harvestMonthYear}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  GROWTH PREVIEW
                  ================================================= */}

              <div className="crop-season-preview">

                <span className="crop-season-title">
                  Growth Season Preview
                </span>

                <div className="crop-month-bar">

                  {MONTH_LABELS.map(
                    (month, index) => {

                      const monthNumber =
                        index + 1;

                      const isActive =
                        activeMonths.has(
                          monthNumber
                        );

                      const isStart =
                        monthNumber ===
                        sownMonthNum;

                      const isEnd =
                        monthNumber ===
                        harvestMonthNum;

                      return (
                        <div
                          key={month}
                          className={`
                            crop-month-chip
                            ${
                              isActive
                                ? "is-active"
                                : ""
                            }
                            ${
                              isStart
                                ? "is-start"
                                : ""
                            }
                            ${
                              isEnd
                                ? "is-end"
                                : ""
                            }
                          `}
                        >
                          {month}
                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <div className="crop-actions">

                <button
                  type="button"
                  className="crop-reset-button"
                  onClick={handleReset}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="crop-submit-button"
                  disabled={
                    submitting ||
                    loadingMeta
                  }
                >
                  {
                    submitting
                      ? "Saving Entry..."
                      : "Save Crop Record →"
                  }
                </button>

              </div>

              {/* FOOTER */}

              <div className="crop-footer">

                <span>
                  🔒 Your crop information is securely
                  recorded
                </span>

                <b>•</b>

                <span>
                  FarmVerse
                </span>

              </div>

            </form>

          </div>

        </section>

      </div>

    </div>
  );
};

export default CropEntry;