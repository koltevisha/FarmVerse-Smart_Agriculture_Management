import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCropsByUsername,
  deleteCropById,
} from "../../Services/CropService";
import "./CropList.css";


/* =========================================================
   GREEN BAND COLORS
   ========================================================= */

const BAND_COLORS = [
  "#176B4E",
  "#23865F",
  "#29965C",
  "#54A820",
  "#3C8D20",
  "#0F513D",
];


const bandColorFor = (seed) => {
  if (!seed) {
    return BAND_COLORS[0];
  }

  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash =
      seed.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return BAND_COLORS[
    Math.abs(hash) % BAND_COLORS.length
  ];
};


/* =========================================================
   SEARCH ICON
   ========================================================= */

const SearchIcon = () => (
  <svg
    className="cl-search-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle
      cx="11"
      cy="11"
      r="7"
    />

    <path
      d="M21 21l-4.3-4.3"
      strokeLinecap="round"
    />
  </svg>
);


/* =========================================================
   CROP LIST
   ========================================================= */

const CropList = () => {
  const navigate = useNavigate();


  /* =======================================================
     STATE
     ======================================================= */

  const [crops, setCrops] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [query, setQuery] =
    useState("");

  const [pendingDeleteId, setPendingDeleteId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);


  /* =======================================================
     LOAD CROPS
     ======================================================= */

  useEffect(() => {
    let active = true;

    setLoading(true);

    getCropsByUsername()
      .then((response) => {
        if (active) {
          setCrops(response.data || []);
        }
      })
      .catch((err) => {
        console.error(
          "Could not load crop records:",
          err
        );

        if (active) {
          setError(
            "Could not load crop journal records."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);


  /* =======================================================
     SEARCH / FILTER
     ======================================================= */

  const filteredCrops = useMemo(() => {
    const q =
      query.trim().toLowerCase();

    if (!q) {
      return crops;
    }

    return crops.filter((crop) => {
      const cropName =
        String(
          crop.cropName || ""
        ).toLowerCase();

      const farmId =
        String(
          crop.farmId || ""
        ).toLowerCase();

      const cropId =
        String(
          crop.cropId || ""
        ).toLowerCase();

      return (
        cropName.includes(q) ||
        farmId.includes(q) ||
        cropId.includes(q)
      );
    });
  }, [crops, query]);


  /* =======================================================
     DELETE CROP
     ======================================================= */

  const removeCrop = (id) => {
    setDeletingId(id);

    deleteCropById(id)
      .then(() => {
        setCrops((prev) =>
          prev.filter(
            (crop) =>
              crop.cropId !== id
          )
        );
      })
      .catch((err) => {
        console.error(
          "Could not delete crop:",
          err
        );

        setError(
          "Could not delete crop record."
        );
      })
      .finally(() => {
        setDeletingId(null);
        setPendingDeleteId(null);
      });
  };


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="cl-page">

      <div className="cl-container">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          className="cl-back-btn"
          onClick={() => navigate(-1)}
        >
          <span className="cl-back-arrow">
            ←
          </span>

          <span>
            Back
          </span>
        </button>


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="cl-page-header">

          <div className="cl-heading-area">

            <h1 className="cl-page-title">
              Crop Journal
            </h1>

            <p className="cl-page-subtitle">
              Living agricultural crop records,
              growth timelines, input logs,
              and AI yield forecasts.
            </p>

          </div>


          <div className="cl-record-badge">
            ● Crop Records
          </div>

        </div>


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="cl-toolbar">

          <div className="cl-search-box">

            <SearchIcon />

            <input
              type="text"
              className="cl-search-input"
              placeholder="Search by crop, farm parcel, or ID..."
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="cl-add-btn"
            onClick={() =>
              navigate("/crop-add")
            }
          >
            + Log New Crop Planting
          </button>

        </div>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="cl-banner-error">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
            >
              ✕
            </button>

          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="cl-grid">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  className="cl-card cl-skeleton"
                  key={item}
                />
              )
            )}

          </div>

        ) : filteredCrops.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="cl-empty-state">

            <span className="cl-empty-icon">
              🌾
            </span>

            <h3>
              No Crop Journal Entries
            </h3>

            <p>
              {crops.length === 0
                ? "Record your field plantings to track sowing and harvest timelines."
                : `No crop journal entries matching "${query}".`}
            </p>

            <button
              type="button"
              className="cl-add-btn"
              onClick={() =>
                navigate("/crop-add")
              }
            >
              + Log Crop Entry
            </button>

          </div>

        ) : (

          /* =================================================
             CROP GRID
          ================================================= */

          <div className="cl-grid">

            {filteredCrops.map((crop) => {

              const bandColor =
                bandColorFor(
                  crop.cropName
                );

              return (

                <article
                  className="cl-card"
                  key={crop.cropId}
                >


                  {/* =========================================
                      CARD HEADER
                  ========================================== */}

                  <div
                    className="cl-card-header"
                    style={{
                      borderLeftColor:
                        bandColor,
                    }}
                  >

                    <div className="cl-header-meta">

                      <span className="cl-crop-id">
                        CRP-{crop.cropId}
                      </span>

                      <span className="cl-farm-tag">
                        Farm FLD-{crop.farmId}
                      </span>

                    </div>


                    <h2 className="cl-crop-name">
                      {crop.cropName}
                    </h2>

                  </div>


                  {/* =========================================
                      CARD BODY
                  ========================================== */}

                  <div className="cl-card-body">


                    {/* =======================================
                        LIFECYCLE
                    ======================================== */}

                    <div className="cl-growth-timeline">

                      <span className="cl-timeline-label">
                        Crop Lifecycle Stage
                      </span>


                      <div className="cl-timeline-track">

                        <div className="cl-stage is-done">
                          Planning
                        </div>

                        <div className="cl-stage is-done">
                          Planting
                        </div>

                        <div className="cl-stage is-active">
                          Growing
                        </div>

                        <div className="cl-stage">
                          Maturity
                        </div>

                        <div className="cl-stage">
                          Harvest
                        </div>

                      </div>

                    </div>


                    {/* =======================================
                        CROP INFORMATION
                    ======================================== */}

                    <div className="cl-specs-grid">


                      {/* LAND AREA */}

                      <div className="cl-spec-item">

                        <span className="cl-spec-label">
                          Land Area
                        </span>

                        <span className="cl-spec-val">
                          {crop.cropArea
                            ? `${crop.cropArea} Acres`
                            : "N/A"}
                        </span>

                      </div>


                      {/* RECORDED YIELD */}

                      <div className="cl-spec-item">

                        <span className="cl-spec-label">
                          Recorded Yield
                        </span>

                        <span className="cl-spec-val">
                          {crop.yield
                            ? `${crop.yield} Qtl`
                            : "Pending"}
                        </span>

                      </div>


                      {/* SOWN MONTH */}

                      <div className="cl-spec-item">

                        <span className="cl-spec-label">
                          Sown Month
                        </span>

                        <span className="cl-spec-val">
                          {crop.sownMonthYear ||
                            "N/A"}
                        </span>

                      </div>


                      {/* ESTIMATED HARVEST */}

                      <div className="cl-spec-item">

                        <span className="cl-spec-label">
                          Est. Harvest
                        </span>

                        <span className="cl-spec-val">
                          {crop.harvestMonthYear ||
                            "N/A"}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      CARD FOOTER
                  ========================================== */}

                  <div className="cl-card-footer">


                    {pendingDeleteId ===
                    crop.cropId ? (


                      /* =====================================
                         DELETE CONFIRMATION
                      ====================================== */

                      <div className="cl-del-confirm">

                        <span>
                          Delete crop record?
                        </span>


                        <button
                          type="button"
                          className="cl-btn-confirm-yes"
                          onClick={() =>
                            removeCrop(
                              crop.cropId
                            )
                          }
                          disabled={
                            deletingId ===
                            crop.cropId
                          }
                        >
                          {deletingId ===
                          crop.cropId
                            ? "Deleting..."
                            : "Yes"}
                        </button>


                        <button
                          type="button"
                          className="cl-btn-confirm-no"
                          onClick={() =>
                            setPendingDeleteId(
                              null
                            )
                          }
                        >
                          No
                        </button>

                      </div>


                    ) : (


                      /* =====================================
                         NORMAL ACTIONS
                      ====================================== */

                      <>

                        {/* AI YIELD */}

                        <Link
                          to={`/farm-crop/${crop.cropId}`}
                          className="cl-link-ai"
                        >
                          AI YIELD
                        </Link>


                        {/* CROP INPUT JOURNAL */}

                        <Link
                          to={`/crop-input/${crop.cropId}`}
                          className="cl-link-journal"
                        >
                          CROP INPUT JOURNAL
                        </Link>


                        {/* DELETE */}

                        <button
                          type="button"
                          className="cl-btn-del"
                          onClick={() =>
                            setPendingDeleteId(
                              crop.cropId
                            )
                          }
                        >
                          Delete
                        </button>

                      </>

                    )}

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </div>

    </main>
  );
};


export default CropList;