
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCropById } from "../../Services/CropService";
import { getFarmsByUsername } from "../../Services/FarmService";
import {
  getCropInputsById,
  addCropInputs,
  deleteCropInputsById,
} from "../../Services/CropInputsService";
import { predictExpense } from "../../Services/AIService";

import "./CropInputsView.css";

const CropInputsView = () => {
  const navigate = useNavigate();
  const { cid } = useParams();

  const [cropContext, setCropContext] = useState(null);
  const [farmDetails, setFarmDetails] = useState(null);
  const [resourceData, setResourceData] = useState(null);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const cropResponse = await getCropById(cid);
        const crop = cropResponse.data;

        setCropContext(crop);

        try {
          const farmsResponse = await getFarmsByUsername();
          const farms = farmsResponse.data || [];

          const matchedFarm = farms.find(
            (farm) =>
              String(farm.farmId) === String(crop.farmId)
          );

          if (matchedFarm) {
            setFarmDetails(matchedFarm);
          }
        } catch (farmError) {
          console.log(
            "Farm details loading notice:",
            farmError
          );
        }

        try {
          const inputResponse =
            await getCropInputsById(cid);

          if (
            inputResponse &&
            inputResponse.data
          ) {
            setResourceData(inputResponse.data);
            setSaved(true);
          }
        } catch (inputError) {
          console.log(
            "No saved crop input record."
          );

          setResourceData(null);
          setSaved(false);
        }
      } catch (cropError) {
        console.error(
          "Crop loading error:",
          cropError
        );

        setError(
          "Couldn't load crop input details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cid]);

  const generatePrediction = async () => {
    setPredicting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response =
        await predictExpense(cid);

      if (!response.data) {
        throw new Error(
          "Empty prediction response"
        );
      }

      setResourceData(response.data);
      setSaved(false);

      setSuccessMessage(
        "AI field input allocation calculated successfully."
      );
    } catch (predictionError) {
      console.error(
        "Prediction error:",
        predictionError
      );

      setResourceData(null);

      setError(
        "Couldn't generate input prediction. Verify backend service connection."
      );
    } finally {
      setPredicting(false);
    }
  };

  const savePrediction = async () => {
    if (!resourceData || !cropContext) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const soilValue =
        resourceData.soil ||
        farmDetails?.soil ||
        cropContext.soil ||
        "";

      const farmCropInputs = {
        cropId: cropContext.cropId,
        cropName: cropContext.cropName,
        cropArea: cropContext.cropArea,
        soil: soilValue,
        sownMonthYear:
          cropContext.sownMonthYear,
        harvestMonthYear:
          cropContext.harvestMonthYear,
        yield: cropContext.yield,

        waterGallon:
          resourceData.waterGallon ??
          resourceData.waterPerAcre ??
          resourceData.water ??
          0,

        fertilizer:
          resourceData.fertilizer ??
          resourceData.fertilizerPerAcre ??
          0,

        pesticides:
          resourceData.pesticides ??
          resourceData.pesticide ??
          resourceData.pesticidePerAcre ??
          0,

        tractorHour:
          resourceData.tractorHour ??
          resourceData.tractorUsage ??
          resourceData.tractorUsagePerAcre ??
          0,
      };

      await addCropInputs(
        farmCropInputs
      );

      setSaved(true);

      setSuccessMessage(
        "Input journal entry saved successfully."
      );
    } catch (saveError) {
      console.error(
        "Save error:",
        saveError
      );

      setError(
        "Couldn't save input journal entry."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSavedData = async () => {
    setDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteCropInputsById(cid);

      setSaved(false);
      setResourceData(null);

      setSuccessMessage(
        "Input journal entry deleted."
      );
    } catch (deleteError) {
      console.error(
        "Delete error:",
        deleteError
      );

      setError(
        "Couldn't delete input journal entry."
      );
    } finally {
      setDeleting(false);
    }
  };

  const cropName =
    cropContext?.cropName || "Crop";

  const cropId =
    cropContext?.cropId || cid || "—";

  const farmId =
    cropContext?.farmId || "—";

  const farmName =
    farmDetails?.farmName ||
    cropContext?.farmName ||
    "Farm";

  const cropArea =
    cropContext?.cropArea ?? "—";

  const soil =
    resourceData?.soil ||
    farmDetails?.soil ||
    cropContext?.soil ||
    "—";

  const sownMonth =
    cropContext?.sownMonthYear || "—";

  const harvestMonth =
    cropContext?.harvestMonthYear || "—";

  const yieldValue =
    cropContext?.yield ??
    resourceData?.yield ??
    "—";

  const water =
    resourceData?.waterGallon ??
    resourceData?.waterPerAcre ??
    resourceData?.water ??
    "—";

  const fertilizer =
    resourceData?.fertilizer ??
    resourceData?.fertilizerPerAcre ??
    "—";

  const pesticides =
    resourceData?.pesticides ??
    resourceData?.pesticide ??
    resourceData?.pesticidePerAcre ??
    "—";

  const tractor =
    resourceData?.tractorHour ??
    resourceData?.tractorUsage ??
    resourceData?.tractorUsagePerAcre ??
    "—";

  if (loading) {
    return (
      <div className="civ-page">
        <div className="civ-loading">
          <div className="civ-spinner" />

          <h2>
            Loading Crop Information
          </h2>

          <p>
            Preparing the field details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="civ-page">

      {/* HEADER */}
      <div className="civ-header">
        <div>
          <span className="civ-kicker">
            CROP INPUT INFORMATION
          </span>

          <h1>
            {cropName}
          </h1>

          <p>
            Crop profile and AI resource requirements
          </p>
        </div>

        <button
          type="button"
          className="civ-back"
          onClick={() => navigate("/crop-list")}
        >
          ← Back to Crops
        </button>
      </div>


      {/* ALERTS */}
      {error && (
        <div className="civ-alert civ-error">
          <span>⚠</span>

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="civ-alert civ-success">
          <span>✓</span>

          <span>{successMessage}</span>
        </div>
      )}


      {/* CROP PROFILE */}
      <section className="civ-card">

        <div className="civ-card-heading">

          <div>
            <span>
              CROP PROFILE
            </span>

            <h2>
              Field Information
            </h2>
          </div>

          <div className="civ-id-badge">
            CRP-{cropId}
          </div>

        </div>


        <div className="civ-info-grid">

          <div className="civ-info-box civ-farm-box">
            <span>FARM NAME</span>

            <strong>
              {farmName}
            </strong>
          </div>


          <div className="civ-info-box civ-id-box">
            <span>FARM ID</span>

            <strong>
              FLD-{farmId}
            </strong>
          </div>


          <div className="civ-info-box civ-soil-box">
            <span>SOIL TYPE</span>

            <strong>
              {soil}
            </strong>
          </div>


          <div className="civ-info-box civ-area-box">
            <span>LAND AREA</span>

            <strong>
              {cropArea} Acres
            </strong>
          </div>


          <div className="civ-info-box civ-yield-box">
            <span>EXPECTED YIELD</span>

            <strong>
              {yieldValue}
            </strong>

            <small>
              per acre
            </small>
          </div>


          <div className="civ-info-box civ-sown-box">
            <span>SOWN DATE</span>

            <strong>
              {sownMonth}
            </strong>
          </div>


          <div className="civ-info-box civ-harvest-box">
            <span>HARVEST DATE</span>

            <strong>
              {harvestMonth}
            </strong>
          </div>


          <div className="civ-info-box civ-crop-box">
            <span>CROP ID</span>

            <strong>
              #{cropId}
            </strong>
          </div>

        </div>
      </section>


      {/* AI INPUT REQUIREMENTS */}
      <section className="civ-card civ-resources">

        <div className="civ-card-heading">

          <div>
            <span>
              AI RESOURCE PLANNING
            </span>

            <h2>
              Input Requirements
            </h2>

            <p>
              Estimated resources required for this crop.
            </p>
          </div>

          <div className="civ-ai-badge">
            ✦ AI
          </div>

        </div>


        {predicting ? (
          <div className="civ-predicting">

            <div className="civ-spinner" />

            <h3>
              Calculating requirements...
            </h3>

            <p>
              AI is preparing resource information.
            </p>

          </div>
        ) : resourceData ? (

          <div className="civ-resource-grid">

            <div className="civ-resource-card civ-water-card">
              <div className="civ-resource-icon">
                💧
              </div>

              <span>
                IRRIGATION WATER
              </span>

              <strong>
                {water}
              </strong>

              <small>
                Gallons / Acre
              </small>
            </div>


            <div className="civ-resource-card civ-fertilizer-card">
              <div className="civ-resource-icon">
                🌿
              </div>

              <span>
                FERTILIZER
              </span>

              <strong>
                {fertilizer}
              </strong>

              <small>
                Kg / Acre
              </small>
            </div>


            <div className="civ-resource-card civ-tractor-card">
              <div className="civ-resource-icon">
                🚜
              </div>

              <span>
                TRACTOR HOURS
              </span>

              <strong>
                {tractor}
              </strong>

              <small>
                Hours
              </small>
            </div>


            <div className="civ-resource-card civ-pesticide-card">
              <div className="civ-resource-icon">
                🧪
              </div>

              <span>
                PESTICIDES
              </span>

              <strong>
                {pesticides}
              </strong>

              <small>
                Kg / Acre
              </small>
            </div>

          </div>

        ) : (

          <div className="civ-empty">

            <div>
              ✦
            </div>

            <h3>
              No AI Input Allocation
            </h3>

            <p>
              Generate the AI allocation to see
              required field resources.
            </p>

          </div>
        )}


        {/* ACTION BUTTONS */}
        <div className="civ-actions">

          <button
            type="button"
            className="civ-generate"
            onClick={generatePrediction}
            disabled={predicting}
          >
            {predicting
              ? "Calculating..."
              : resourceData
              ? "↻ Recalculate Inputs"
              : "✦ Generate AI Allocation"}
          </button>


          <button
            type="button"
            className="civ-save"
            onClick={savePrediction}
            disabled={
              saving ||
              predicting ||
              !resourceData
            }
          >
            {saving
              ? "Saving..."
              : "✓ Save Input Journal"}
          </button>


          {saved && (
            <button
              type="button"
              className="civ-delete"
              onClick={deleteSavedData}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : "Delete Entry"}
            </button>
          )}

        </div>

      </section>


      {/* MANAGEMENT STAGES */}
      <section className="civ-card">

        <div className="civ-card-heading">

          <div>
            <span>
              APPLICATION INFORMATION
            </span>

            <h2>
              Crop Management Stages
            </h2>
          </div>

        </div>


        <div className="civ-stage-grid">

          <div className="civ-stage-card civ-stage-one">
            <b>01</b>

            <div>
              <span>
                PRE-SOWING
              </span>

              <strong>
                Tractor Operations
              </strong>
            </div>
          </div>


          <div className="civ-stage-card civ-stage-two">
            <b>02</b>

            <div>
              <span>
                SOWING
              </span>

              <strong>
                Fertilizer Application
              </strong>
            </div>
          </div>


          <div className="civ-stage-card civ-stage-three">
            <b>03</b>

            <div>
              <span>
                GROWTH
              </span>

              <strong>
                Irrigation Management
              </strong>
            </div>
          </div>


          <div className="civ-stage-card civ-stage-four">
            <b>04</b>

            <div>
              <span>
                MID-SEASON
              </span>

              <strong>
                Crop Protection
              </strong>
            </div>
          </div>

        </div>

      </section>


      <footer className="civ-footer">
        🔒 Crop information securely recorded
        <span>•</span>
        FarmVerse
      </footer>

    </div>
  );
};

export default CropInputsView;
;