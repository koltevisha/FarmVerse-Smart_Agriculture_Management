
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getExpectedYield } from "../../Services/AIService";

import "./FarmCropReport.css";

/* ============================================================
   ICONS
============================================================ */

const IconArrowLeft = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </svg>
);

const IconLeaf = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 4C12 4 6 7 6 13c0 4 3 7 7 7 6 0 8-8 7-16Z" />
    <path d="M5 20c2-4 5-7 11-10" />
  </svg>
);

const IconSpark = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3.4" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconRuler = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 19 14-14" />
    <path d="m7 17 2 2" />
    <path d="m10 14 2 2" />
    <path d="m13 11 2 2" />
    <path d="m16 8 2 2" />
  </svg>
);

const IconMap = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const IconSoil = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 18h16" />
    <path d="M5 14h14" />
    <path d="M7 10h10" />
    <path d="M9 6h6" />
  </svg>
);

const IconArrowUp = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);


/* ============================================================
   HELPERS
============================================================ */

function parseFlexibleDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}


function getTimelineProgress(sownRaw, harvestRaw) {
  const sown = parseFlexibleDate(sownRaw);
  const harvest = parseFlexibleDate(harvestRaw);

  if (!sown || !harvest || harvest <= sown) {
    return {
      progress: 50,
      daysLeft: null,
    };
  }

  const now = new Date();

  const total = harvest - sown;
  const elapsed = now - sown;

  const progress = Math.min(
    100,
    Math.max(
      0,
      (elapsed / total) * 100
    )
  );

  const daysLeft = Math.ceil(
    (harvest - now) /
      (1000 * 60 * 60 * 24)
  );

  return {
    progress,
    daysLeft,
  };
}


function useCountUp(target, durationMs = 950) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const numericTarget = Number(target) || 0;

    const startValue = performance.now();

    const tick = (now) => {
      const progress = Math.min(
        1,
        (now - startValue) / durationMs
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setValue(
        numericTarget * eased
      );

      if (progress < 1) {
        frameRef.current =
          requestAnimationFrame(tick);
      }
    };

    frameRef.current =
      requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, [target, durationMs]);

  return value;
}


/* ============================================================
   COMPONENT
============================================================ */

const FarmCropReport = () => {
  const navigate = useNavigate();
  const { cid } = useParams();

  const [farmCrop, setFarmCrop] = useState({
    farmId: 0,
    farmName: "",
    soil: "",
    cropId: "",
    cropName: "",
    cropArea: 0,
    sownMonthYear: "",
    harvestMonthYear: "",
    yield: 0,
    comments: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [timelineReady, setTimelineReady] =
    useState(false);


  /* ==========================================================
     LOAD DATA
  ========================================================== */

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    getExpectedYield(cid)
      .then((response) => {
        setFarmCrop(
          response.data || {}
        );
      })
      .catch((error) => {
        console.error(
          "Farm crop report error:",
          error
        );

        setErrorMessage(
          "Unable to generate the crop report."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cid]);


  /* ==========================================================
     TIMELINE ANIMATION
  ========================================================== */

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setTimelineReady(true),
      350
    );

    return () =>
      clearTimeout(timeoutId);
  }, []);


  const animatedYield = useCountUp(
    farmCrop.yield
  );


  const {
    progress,
    daysLeft,
  } = getTimelineProgress(
    farmCrop.sownMonthYear,
    farmCrop.harvestMonthYear
  );


  const displayedProgress =
    timelineReady ? progress : 0;


  const cropArea =
    Number(farmCrop.cropArea || 0);


  const expectedYield =
    Number(farmCrop.yield || 0);


  const estimatedTotal =
    cropArea * expectedYield;


  /* ==========================================================
     RETURN
  ========================================================== */

  const returnBack = () => {
    navigate("/crop-list");
  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="fcr-page">
        <div className="fcr-loading-card">
          <div className="fcr-loader"></div>

          <h2>
            Preparing Crop Report
          </h2>

          <p>
            AI is processing your crop information...
          </p>
        </div>
      </div>
    );
  }


  /* ==========================================================
     ERROR
  ========================================================== */

  if (errorMessage) {
    return (
      <div className="fcr-page">
        <div className="fcr-error-card">

          <div className="fcr-error-icon">
            !
          </div>

          <h2>
            Crop Report Unavailable
          </h2>

          <p>
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={returnBack}
            className="fcr-back-primary"
          >
            ← Back to Crops
          </button>

        </div>
      </div>
    );
  }


  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <div className="fcr-page">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="fcr-topbar">

        <button
          type="button"
          className="fcr-back-button"
          onClick={returnBack}
        >
          <IconArrowLeft />
          Back to Crops
        </button>

        <div className="fcr-topbar-label">
          AI AGRICULTURE REPORT
        </div>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <main className="fcr-container">

        <section className="fcr-hero">

          <div className="fcr-hero-left">

            <div className="fcr-ai-pill">
              <IconSpark />
              AI Yield Intelligence
            </div>

            <span className="fcr-overline">
              CROP REPORT · #{farmCrop.cropId}
            </span>

            <h1>
              {farmCrop.cropName ||
                "Crop"}
            </h1>

            <p className="fcr-hero-description">
              AI-powered production analysis for your
              agricultural field.
            </p>


            <div className="fcr-farm-chip">

              <span className="fcr-chip-icon">
                <IconMap />
              </span>

              <div>
                <span>
                  FARM
                </span>

                <strong>
                  {farmCrop.farmName ||
                    "—"}
                </strong>
              </div>

            </div>

          </div>


          {/* Yield hero */}

          <div className="fcr-yield-panel">

            <div className="fcr-yield-glow"></div>

            <span className="fcr-yield-label">
              EXPECTED YIELD
            </span>

            <div className="fcr-yield-number">
              {animatedYield.toFixed(2)}
            </div>

            <span className="fcr-yield-unit">
              units per acre
            </span>

            <div className="fcr-yield-indicator">
              <IconArrowUp />
              AI prediction
            </div>

          </div>

        </section>


        {/* ===================================================
            QUICK STATS
        ==================================================== */}

        <section className="fcr-stats">

          <div className="fcr-stat-card">

            <div className="fcr-stat-icon">
              <IconSoil />
            </div>

            <div>
              <span>
                SOIL TYPE
              </span>

              <strong>
                {farmCrop.soil || "—"}
              </strong>
            </div>

          </div>


          <div className="fcr-stat-card">

            <div className="fcr-stat-icon">
              <IconRuler />
            </div>

            <div>
              <span>
                CROP AREA
              </span>

              <strong>
                {cropArea.toFixed(2)} acres
              </strong>
            </div>

          </div>


          <div className="fcr-stat-card">

            <div className="fcr-stat-icon">
              <IconLeaf />
            </div>

            <div>
              <span>
                CROP ID
              </span>

              <strong>
                #{farmCrop.cropId || "—"}
              </strong>
            </div>

          </div>


          <div className="fcr-stat-card">

            <div className="fcr-stat-icon">
              <IconCalendar />
            </div>

            <div>
              <span>
                TOTAL ESTIMATE
              </span>

              <strong>
                {estimatedTotal.toFixed(2)}
              </strong>
            </div>

          </div>

        </section>


        {/* ===================================================
            GROWTH TIMELINE
        ==================================================== */}

        <section className="fcr-panel">

          <div className="fcr-panel-header">

            <div>
              <span className="fcr-panel-kicker">
                CROP LIFECYCLE
              </span>

              <h2>
                Growth Timeline
              </h2>
            </div>

            {daysLeft !== null && (
              <div className="fcr-days-badge">
                {daysLeft > 0
                  ? `${daysLeft} days remaining`
                  : "Ready for harvest"}
              </div>
            )}

          </div>


          <div className="fcr-timeline">

            <div className="fcr-track">

              <span
                className="fcr-track-fill"
                style={{
                  width: `${displayedProgress}%`,
                }}
              />

              <span
                className="fcr-track-marker"
                style={{
                  left: `${displayedProgress}%`,
                }}
              >
                <IconLeaf />
              </span>

            </div>


            <div className="fcr-timeline-points">

              <div>
                <span>
                  SOWN
                </span>

                <strong>
                  {farmCrop.sownMonthYear ||
                    "—"}
                </strong>
              </div>


              <div className="fcr-progress-text">
                {Math.round(progress)}%
              </div>


              <div className="fcr-timeline-end">
                <span>
                  HARVEST
                </span>

                <strong>
                  {farmCrop.harvestMonthYear ||
                    "—"}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            AI INSIGHTS
        ==================================================== */}

        <section className="fcr-insight">

          <div className="fcr-insight-icon">
            <IconSpark />
          </div>

          <div className="fcr-insight-content">

            <span className="fcr-insight-label">
              AI INSIGHT
            </span>

            <h3>
              Production outlook
            </h3>

            <p>
              {farmCrop.comments ||
                "The AI model has generated the expected yield shown above based on the available crop information."}
            </p>

          </div>

        </section>


        {/* ===================================================
            DETAILS
        ==================================================== */}

        <section className="fcr-details">

          <div className="fcr-details-heading">

            <span>
              CROP PROFILE
            </span>

            <h2>
              Field Information
            </h2>

          </div>


          <div className="fcr-details-grid">

            <div>
              <span>
                FARM NAME
              </span>

              <strong>
                {farmCrop.farmName || "—"}
              </strong>
            </div>


            <div>
              <span>
                SOIL
              </span>

              <strong>
                {farmCrop.soil || "—"}
              </strong>
            </div>


            <div>
              <span>
                SOWN
              </span>

              <strong>
                {farmCrop.sownMonthYear ||
                  "—"}
              </strong>
            </div>


            <div>
              <span>
                HARVEST
              </span>

              <strong>
                {farmCrop.harvestMonthYear ||
                  "—"}
              </strong>
            </div>

          </div>

        </section>


        <footer className="fcr-footer">
          <span>
            FarmVerse
          </span>

          <span>
            AI-powered agricultural insights
          </span>
        </footer>

      </main>
    </div>
  );
};

export default FarmCropReport;
;