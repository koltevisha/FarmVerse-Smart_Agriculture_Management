import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addFarm, generateFarmId } from "../../Services/FarmService";
import { LOGIN_CROP_FIELD_IMAGE } from "../../utils/cropAssets";

import "./FarmEntry.css";

const SOIL_THEMES = {
  Alluvial: {
    accent: "#D7A62E",
    icon: "🌾",
    label: "Alluvial Soil",
    description: "Fertile river soil",
  },
  Black: {
    accent: "#6B4226",
    icon: "🌱",
    label: "Black Soil",
    description: "Rich cotton soil",
  },
  Red: {
    accent: "#C65D3F",
    icon: "🍂",
    label: "Red Soil",
    description: "Iron-rich soil",
  },
  Laterite: {
    accent: "#C97932",
    icon: "🌿",
    label: "Laterite Soil",
    description: "Tropical soil",
  },
  "Peaty and Marshy": {
    accent: "#467653",
    icon: "🌱",
    label: "Peaty & Marshy",
    description: "Organic wet soil",
  },
};

const SOIL_NAMES = Object.keys(SOIL_THEMES);

const FarmEntry = () => {
  const navigate = useNavigate();

  const [farm, setFarm] = useState({
    farmId: 0,
    farmName: "",
    area: "",
    soil: "",
    username: "abcd",
  });

  const [errors, setErrors] = useState({});
  const [newId, setNewId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    generateFarmId()
      .then((response) => {
        setNewId(response.data);
      })
      .catch(() => {
        setNewId(Math.floor(Math.random() * 9000) + 1000);
      });
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setFarm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      form: "",
    }));

    setSuccess(false);
  };

  const selectSoil = (soilName) => {
    setFarm((previous) => ({
      ...previous,
      soil: soilName,
    }));

    setErrors((previous) => ({
      ...previous,
      soil: "",
      form: "",
    }));

    setSuccess(false);
  };

  const saveFarm = () => {
    const payload = {
      ...farm,
      farmId: newId,
    };

    setSaving(true);

    addFarm(payload)
      .then(() => {
        setSuccess(true);
        setErrors({});
      })
      .catch((error) => {
        setErrors({
          form:
            "Unable to register the farm. " +
            String(error?.message || error),
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleValidation = (event) => {
    event.preventDefault();

    const tempErrors = {};
    let valid = true;

    if (!farm.farmName || farm.farmName.trim() === "") {
      tempErrors.farmName = "Farm name is required";
      valid = false;
    }

    if (farm.area === "" || farm.area === null) {
      tempErrors.area = "Land area is required";
      valid = false;
    } else if (Number(farm.area) <= 0) {
      tempErrors.area = "Area must be greater than 0";
      valid = false;
    }

    if (!farm.soil || farm.soil.trim() === "") {
      tempErrors.soil = "Please select a soil type";
      valid = false;
    }

    setErrors(tempErrors);

    if (valid) {
      saveFarm();
    }
  };

  const resetForm = () => {
    setFarm({
      farmId: 0,
      farmName: "",
      area: "",
      soil: "",
      username: "abcd",
    });

    setErrors({});
    setSuccess(false);

    generateFarmId()
      .then((response) => {
        setNewId(response.data);
      })
      .catch(() => {
        setNewId(Math.floor(Math.random() * 9000) + 1000);
      });
  };

  return (
    <div className="fe-page">

      <div className="fe-main-card">

        {/* =====================================================
            LEFT FARM IMAGE
        ===================================================== */}

        <section
          className="fe-visual"
          style={{
            backgroundImage: `url("${LOGIN_CROP_FIELD_IMAGE}")`,
          }}
        >
          <div className="fe-visual-overlay"></div>

          <div className="fe-visual-content">

            <div className="fe-brand">
              <div className="fe-brand-icon">
                🌱
              </div>

              <div>
                <div className="fe-brand-name">
                  FarmVerse
                </div>

                <div className="fe-brand-tagline">
                  PRECISION AGRICULTURE
                </div>
              </div>
            </div>

            <div className="fe-visual-bottom">

              <span className="fe-visual-label">
                FARM MANAGEMENT
              </span>

              <h1>
                Grow your farm.
                <br />
                <span>Manage it smarter.</span>
              </h1>

              <p>
                Organize your land, soil and farming
                information in one simple place.
              </p>

              <div className="fe-visual-line"></div>

              <div className="fe-stat-row">

                <div>
                  <strong>01</strong>
                  <span>FARM DETAILS</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>LAND AREA</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>SOIL TYPE</span>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            RIGHT FORM
        ===================================================== */}

        <section className="fe-form-area">

          <div className="fe-form-inner">

            {/* HEADER */}

            <div className="fe-top-row">

              <div className="fe-id-badge">
                FARM ID&nbsp; • &nbsp;
                FLD-{newId || "..."}
              </div>

              <button
                type="button"
                className="fe-back-button"
                onClick={() => navigate("/farm-list")}
              >
                ← Back
              </button>

            </div>


            <div className="fe-heading">

              <h2>
                Register Your Farm
              </h2>

              <p>
                Add your farm details to start managing
                your agricultural activities.
              </p>

            </div>


            {/* SUCCESS */}

            {success && (
              <div className="fe-success">

                <div className="fe-success-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Farm registered successfully
                  </strong>

                  <span>
                    Your farm has been added to FarmVerse.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/farm-list")}
                >
                  View Farms →
                </button>

              </div>
            )}


            {/* ERROR */}

            {errors.form && (
              <div className="fe-form-error">
                {errors.form}
              </div>
            )}


            <form
              onSubmit={handleValidation}
              noValidate
              className="fe-form"
            >

              {/* =================================================
                  SECTION 01
              ================================================= */}

              <div className="fe-section">

                <div className="fe-section-heading">

                  <div className="fe-number">
                    01
                  </div>

                  <div>
                    <h3>
                      Farm Information
                    </h3>

                    <p>
                      Tell us about your agricultural land.
                    </p>
                  </div>

                </div>


                <div className="fe-input-grid">

                  {/* FARM NAME */}

                  <div
                    className={`fe-field ${
                      errors.farmName ? "has-error" : ""
                    }`}
                  >

                    <label htmlFor="farmName">
                      FARM NAME
                    </label>

                    <div className="fe-input-box">

                      <span className="fe-input-symbol">
                        🌿
                      </span>

                      <input
                        id="farmName"
                        name="farmName"
                        type="text"
                        value={farm.farmName}
                        onChange={onChangeHandler}
                        placeholder="Enter your farm name"
                      />

                    </div>

                    {errors.farmName && (
                      <span className="fe-error-text">
                        {errors.farmName}
                      </span>
                    )}

                  </div>


                  {/* AREA */}

                  <div
                    className={`fe-field ${
                      errors.area ? "has-error" : ""
                    }`}
                  >

                    <label htmlFor="area">
                      LAND AREA
                    </label>

                    <div className="fe-input-box">

                      <span className="fe-input-symbol">
                        📐
                      </span>

                      <input
                        id="area"
                        name="area"
                        type="number"
                        min="0"
                        step="0.01"
                        value={farm.area}
                        onChange={onChangeHandler}
                        placeholder="Enter land area"
                      />

                      <span className="fe-unit">
                        ACRES
                      </span>

                    </div>

                    {errors.area && (
                      <span className="fe-error-text">
                        {errors.area}
                      </span>
                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  SECTION 02
              ================================================= */}

              <div className="fe-section">

                <div className="fe-section-heading">

                  <div className="fe-number">
                    02
                  </div>

                  <div>
                    <h3>
                      Soil Classification
                    </h3>

                    <p>
                      Select the primary soil type of your farm.
                    </p>
                  </div>

                </div>


                <div
                  className={`fe-soil-grid ${
                    errors.soil ? "soil-error" : ""
                  }`}
                >

                  {SOIL_NAMES.map((name) => {

                    const soil = SOIL_THEMES[name];

                    const selected =
                      farm.soil === name;

                    return (
                      <button
                        type="button"
                        key={name}
                        className={`fe-soil-card ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => selectSoil(name)}
                        style={{
                          "--soil-accent": soil.accent,
                        }}
                      >

                        <div className="fe-soil-icon">
                          {soil.icon}
                        </div>

                        <div className="fe-soil-details">

                          <strong>
                            {soil.label}
                          </strong>

                          <span>
                            {selected
                              ? "Selected"
                              : soil.description}
                          </span>

                        </div>

                        <span className="fe-soil-dot"></span>

                      </button>
                    );
                  })}

                </div>

                {errors.soil && (
                  <span className="fe-error-text soil-error-text">
                    {errors.soil}
                  </span>
                )}

              </div>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="fe-actions">

                <button
                  type="button"
                  className="fe-reset"
                  onClick={resetForm}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="fe-submit"
                  disabled={saving}
                >
                  {saving
                    ? "Registering..."
                    : "Register Farm  →"}
                </button>

              </div>


              {/* SECURITY */}

              <div className="fe-security">

                <span>🔒</span>

                Your farm information is securely recorded

                <span className="fe-security-dot">
                  •
                </span>

                FarmVerse

              </div>

            </form>

          </div>

        </section>

      </div>

    </div>
  );
};

export default FarmEntry;