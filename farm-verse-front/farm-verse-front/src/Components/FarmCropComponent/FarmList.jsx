import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFarmsByUsername,
  deleteFarmById,
} from "../../Services/FarmService";
import "./FarmList.css";

const BAND_COLORS = [
  "#4E7842",
  "#BD9650",
  "#B8583B",
  "#362217",
  "#5E685F",
  "#7CA064",
];

const bandColorFor = (seed) => {
  if (!seed) return BAND_COLORS[0];

  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return BAND_COLORS[Math.abs(hash) % BAND_COLORS.length];
};

const FarmList = () => {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadFarms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFarmsByUsername();

        if (active) {
          setFarms(response?.data || []);
        }
      } catch (err) {
        if (active) {
          setError("Could not load registered farms.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFarms();

    return () => {
      active = false;
    };
  }, []);

  const totalAcres = useMemo(() => {
    return farms.reduce((total, farm) => {
      const area = Number(
        farm?.landArea ??
        farm?.farmArea ??
        farm?.cropArea ??
        farm?.area ??
        0
      );

      return total + (Number.isNaN(area) ? 0 : area);
    }, 0);
  }, [farms]);

  const handleDelete = async (farmId) => {
    try {
      setDeletingId(farmId);

      await deleteFarmById(farmId);

      setFarms((previous) =>
        previous.filter((farm) => farm.farmId !== farmId)
      );

      setPendingDeleteId(null);
    } catch (err) {
      setError("Could not remove farm.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fl-page">

      <main className="fl-main">

        {/* =====================================================
            TOP BAR
        ===================================================== */}
        <div className="fl-top-bar">

          <button
            type="button"
            className="fl-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <header className="fl-header">

          <div className="fl-eyebrow">
            FARM MANAGEMENT
          </div>

          <h1 className="fl-title">
            Registered Farms
          </h1>

          <p className="fl-subtitle">
            View and manage your agricultural farms.
          </p>

        </header>

        {/* =====================================================
            ERROR
        ===================================================== */}
        {error && (
          <div className="fl-error">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              ✕
            </button>

          </div>
        )}

        {/* =====================================================
            SUMMARY
        ===================================================== */}
        <section className="fl-summary">

          <div className="fl-summary-left">

            <div className="fl-summary-number">
              {farms.length}
            </div>

            <div>

              <div className="fl-summary-title">
                Registered Farms
              </div>

              <div className="fl-summary-text">
                {farms.length === 1
                  ? "1 farm ready"
                  : `${farms.length} farms ready`}
              </div>

            </div>

          </div>

          <button
            type="button"
            className="fl-register-btn"
            onClick={() => navigate("/farm-add")}
          >
            + Register Farm →
          </button>

        </section>

        {/* =====================================================
            SECTION TITLE
        ===================================================== */}
        <section className="fl-section">

          <div className="fl-section-label">
            YOUR FARMS
          </div>

          <h2 className="fl-section-title">
            Farm Information
          </h2>

        </section>

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading ? (

          <div className="fl-grid">

            {[1, 2].map((item) => (
              <div
                className="fl-farm-card fl-skeleton"
                key={item}
              >
                <div className="fl-skeleton-line large" />
                <div className="fl-skeleton-line" />
                <div className="fl-skeleton-box" />
              </div>
            ))}

          </div>

        ) : farms.length === 0 ? (

          /* ===================================================
             EMPTY STATE
          =================================================== */
          <div className="fl-empty">

            <div className="fl-empty-icon">
              🌾
            </div>

            <h3>
              No Registered Farms
            </h3>

            <p>
              Register your agricultural land to start
              managing farm and soil information.
            </p>

            <button
              type="button"
              className="fl-register-btn"
              onClick={() => navigate("/farm-add")}
            >
              + Register Farm →
            </button>

          </div>

        ) : (

          /* ===================================================
             FARM CARDS
          =================================================== */
          <div className="fl-grid">

            {farms.map((farm, index) => {

              const farmName =
                farm?.farmName ||
                farm?.name ||
                "Unnamed Farm";

              const farmId =
                farm?.farmId ??
                farm?.id ??
                "";

              const landArea =
                farm?.landArea ??
                farm?.farmArea ??
                farm?.area ??
                0;

              /*
               * Soil type:
               * Supports soilType, soil and soil_type
               */
              const soilType =
                farm?.soilType ||
                farm?.soil ||
                farm?.soil_type ||
                "Not specified";

              const bandColor =
                bandColorFor(farmName);

              return (

                <article
                  className="fl-farm-card"
                  key={farmId || index}
                  style={{
                    "--farm-band-color": bandColor,
                  }}
                >

                  {/* CARD TOP */}
                  <div className="fl-card-top">

                    <span className="fl-field-badge">
                      FIELD{" "}
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="fl-status">

                      <span className="fl-status-dot" />

                      Active

                    </span>

                  </div>

                  {/* CARD CONTENT */}
                  <div className="fl-card-content">

                    <span className="fl-small-label">
                      FARM NAME
                    </span>

                    <h3 className="fl-farm-name">
                      {farmName}
                    </h3>

                    <div className="fl-farm-id">
                      FLD-{farmId}
                    </div>

                    {/* INFORMATION */}
                    <div className="fl-info-grid">

                      {/* LAND AREA */}
                      <div className="fl-info-box">

                        <span className="fl-info-label">
                          LAND AREA
                        </span>

                        <span className="fl-info-value">
                          {landArea} Acres
                        </span>

                      </div>

                      {/* SOIL TYPE */}
                      <div className="fl-info-box">

                        <span className="fl-info-label">
                          SOIL TYPE
                        </span>

                        <span className="fl-info-value fl-soil-value">
                          {soilType}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* CARD FOOTER */}
                  <div className="fl-card-footer">

                    {pendingDeleteId === farmId ? (

                      <div className="fl-delete-confirm">

                        <span>
                          Remove farm?
                        </span>

                        <button
                          type="button"
                          className="fl-confirm-yes"
                          disabled={
                            deletingId === farmId
                          }
                          onClick={() =>
                            handleDelete(farmId)
                          }
                        >
                          {deletingId === farmId
                            ? "Removing..."
                            : "Yes"}
                        </button>

                        <button
                          type="button"
                          className="fl-confirm-no"
                          onClick={() =>
                            setPendingDeleteId(null)
                          }
                        >
                          No
                        </button>

                      </div>

                    ) : (

                      <>
                        <span className="fl-footer-text">
                          Farm Information
                        </span>

                        <button
                          type="button"
                          className="fl-remove-btn"
                          onClick={() =>
                            setPendingDeleteId(farmId)
                          }
                        >
                          Remove
                        </button>
                      </>

                    )}

                  </div>

                </article>

              );
            })}

          </div>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}
        {!loading && farms.length > 0 && (

          <footer className="fl-page-footer">

            <span>
              🔒 Farm information securely recorded • FarmVerse
            </span>

            <span>
              {farms.length} Farms •{" "}
              {totalAcres.toFixed(1)} Acres
            </span>

          </footer>

        )}

      </main>

    </div>
  );
};

export default FarmList;