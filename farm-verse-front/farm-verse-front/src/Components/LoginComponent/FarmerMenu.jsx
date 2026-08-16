import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getFarmsByUsername } from "../../Services/FarmService";
import { getCropsByUsername } from "../../Services/CropService";
import { getAllExpense } from "../../Services/AgroExpenseService";

import "./FarmerMenu.css";

/* =========================================================
   FARMVERSE IMAGE ASSETS
========================================================= */

// Sidebar farmer image
const SIDEBAR_FARMER_IMAGE =
  "https://images.openai.com/static-rsc-4/JjCccoi--AokxDJGygcc0LcPwz8Lk_Tt_FTeCRg4RljEzgh2nMNP3SAdfCI1EilopPvGa8nnGJUO_v2bOwKjRDPMF2L5DpzuTsVWzqpCSR8g8WOml0B_zVp3mkEGX0vkvRLjAhURB4rVnchTeNOBjIEYnblk6g3ubfwYeg5fxzc?purpose=inline";

// Main hero - agricultural field
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90";

// Farm / land image
const LAND_IMAGE =
  "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1800&q=90";

// Crop / green crop field image
const CROP_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=90";

// Farm machinery / expense image
const EXPENSE_IMAGE =
  "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1800&q=90";


/* =========================================================
   COMPONENT
========================================================= */

const FarmerMenu = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLand: 0,
    activeCrops: 0,
    totalExpenses: 0,
    loading: true,
  });


  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          getFarmsByUsername(),
          getCropsByUsername(),
          getAllExpense(),
        ]);

        let farmList = [];
        let cropList = [];
        let expenseTotal = 0;


        /* -----------------------------------------------------
           FARMS
        ----------------------------------------------------- */

        if (
          results[0].status === "fulfilled" &&
          Array.isArray(results[0].value?.data)
        ) {
          farmList = results[0].value.data;
        }


        /* -----------------------------------------------------
           CROPS
        ----------------------------------------------------- */

        if (
          results[1].status === "fulfilled" &&
          Array.isArray(results[1].value?.data)
        ) {
          cropList = results[1].value.data;
        }


        /* -----------------------------------------------------
           EXPENSES
        ----------------------------------------------------- */

        if (
          results[2].status === "fulfilled" &&
          Array.isArray(results[2].value?.data)
        ) {
          expenseTotal = results[2].value.data.reduce(
            (total, item) => {
              return (
                total +
                (
                  Number(item.ratePerUnit) ||
                  Number(item.cost) ||
                  Number(item.amount) ||
                  0
                )
              );
            },
            0
          );
        }


        /* -----------------------------------------------------
           TOTAL LAND
        ----------------------------------------------------- */

        const totalLand = farmList.reduce(
          (total, farm) =>
            total +
            (Number(farm.area) || 0),
          0
        );


        setStats({
          totalLand,
          activeCrops: cropList.length,
          totalExpenses: expenseTotal,
          loading: false,
        });

      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setStats((previous) => ({
          ...previous,
          loading: false,
        }));
      }
    };


    loadDashboardData();

  }, []);


  /* =========================================================
     GREETING
  ========================================================= */

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning.";
    }

    if (hour < 17) {
      return "Good afternoon.";
    }

    return "Good evening.";
  };


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    navigate(path);
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="fcc-shell">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="fcc-sidebar">

        {/* FIXED SIDEBAR IMAGE */}

        <div
          className="fcc-sidebar-image"
          style={{
            backgroundImage:
              `url("${SIDEBAR_FARMER_IMAGE}")`,
          }}
        />

        <div className="fcc-sidebar-shade" />

        <div className="fcc-sidebar-glow" />


        <div className="fcc-sidebar-content">


          {/* =================================================
              BRAND
          ================================================= */}

          <div className="fcc-sidebar-brand">

            <div className="fcc-sidebar-logo">
              🌱
            </div>

            <div>

              <div className="fcc-sidebar-name">
                FarmVerse
              </div>

              <div className="fcc-sidebar-tagline">
                PRECISION AGRICULTURE
              </div>

            </div>

          </div>


          {/* =================================================
              MAIN MENU
          ================================================= */}

          <div className="fcc-nav-section">

            <span className="fcc-nav-label">
              MAIN MENU
            </span>


            {/* OVERVIEW */}

            <button
              type="button"
              className="fcc-nav-item is-active"
              onClick={() =>
                goTo("/farmer-menu")
              }
            >

              <span className="fcc-nav-symbol">
                ▦
              </span>

              <span>
                Overview
              </span>

            </button>


            {/* FARM */}

            <button
              type="button"
              className="fcc-nav-item"
              onClick={() =>
                goTo("/farm-list")
              }
            >

              <span className="fcc-nav-symbol">
                ◈
              </span>

              <span>
                Farm Landscape
              </span>

            </button>


            {/* CROPS */}

            <button
              type="button"
              className="fcc-nav-item"
              onClick={() =>
                goTo("/crop-list")
              }
            >

              <span className="fcc-nav-symbol">
                🌾
              </span>

              <span>
                Crop Journal
              </span>

            </button>


            {/* ECONOMICS */}

            <button
              type="button"
              className="fcc-nav-item"
              onClick={() =>
                goTo("/expense-list")
              }
            >

              <span className="fcc-nav-symbol">
                ₹
              </span>

              <span>
                Farm Economics
              </span>

            </button>

          </div>


          {/* =================================================
              OPERATIONS
          ================================================= */}

          <div className="fcc-operation-area">

            <span className="fcc-nav-label">
              OPERATIONS
            </span>


            {/* REGISTER FARM */}

            <button
              type="button"
              className="fcc-operation-btn"
              onClick={() =>
                goTo("/farm-add")
              }
            >

              <span>
                +
              </span>

              Register Farm Plot

            </button>


            {/* ADD CROP */}

            <button
              type="button"
              className="fcc-operation-btn"
              onClick={() =>
                goTo("/crop-add")
              }
            >

              <span>
                🌱
              </span>

              Log Crop Planting

            </button>


            {/* EXPENSE */}

            <button
              type="button"
              className="fcc-operation-btn"
              onClick={() =>
                goTo("/expense-entry")
              }
            >

              <span>
                ₹
              </span>

              Record Expense

            </button>

          </div>


          {/* =================================================
              SIDEBAR FOOTER
          ================================================= */}

          <div className="fcc-sidebar-footer">

            <div className="fcc-farmer-status">

              <div className="fcc-farmer-photo">
                👨‍🌾
              </div>

              <div>

                <strong>
                  Farmer Node
                </strong>

                <span>
                  Farm Management Network
                </span>

              </div>

            </div>


            <button
              type="button"
              className="fcc-signout"
              onClick={() =>
                goTo("/login")
              }
            >

              <span>
                ↪
              </span>

              <span>
                Sign Out
              </span>

            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="fcc-main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="fcc-topbar">

          <div>

            <span className="fcc-top-kicker">
              FARMVERSE • PRECISION FARM VIEW
            </span>

            <h1>
              Grow with purpose.
            </h1>

            <p>
              Farm smarter today, harvest better tomorrow.
            </p>

          </div>


          <div className="fcc-top-status">

            <span className="fcc-status-dot" />

            <span>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                }
              )}
            </span>

            <span>
              •
            </span>

            <span>
              Farm Active
            </span>

            <span>
              •
            </span>

            <span>
              Soil Ready
            </span>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="fcc-content">


          {/* =================================================
              HERO
          ================================================= */}

          <section
            className="fcc-hero"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(3,48,31,0.97) 0%,
                  rgba(6,68,42,0.84) 42%,
                  rgba(28,72,42,0.35) 72%,
                  rgba(111,80,24,0.10) 100%
                ),
                url("${HERO_IMAGE}")
              `,
            }}
          >

            <div className="fcc-hero-content">

              <span className="fcc-hero-pill">
                🌾 PRECISION AGRICULTURE
              </span>

              <h2>

                {getGreeting()}

                <br />

                <span>
                  Every field has a story worth growing.
                </span>

              </h2>

              <p>
                Keep your land, crops, planting activity,
                harvest plans and farm economics together
                in one focused agricultural workspace.
              </p>

            </div>


            <div className="fcc-hero-sun" />

          </section>


          {/* =================================================
              FARM PULSE
          ================================================= */}

          <section className="fcc-pulse">

            <div className="fcc-section-head">

              <div className="fcc-section-head-left">

                <div className="fcc-section-icon">
                  ✦
                </div>

                <div>

                  <h2>
                    Farm Pulse
                  </h2>

                  <p>
                    A quick view of your current
                    agricultural activity.
                  </p>

                </div>

              </div>


              <span className="fcc-live-pill">
                ● LIVE
              </span>

            </div>


            <div className="fcc-pulse-grid">


              {/* =================================================
                  FARM CARD
              ================================================= */}

              <button
                type="button"
                className="fcc-pulse-card fcc-land-card"
                onClick={() =>
                  goTo("/farm-list")
                }
                style={{
                  backgroundImage: `
                    linear-gradient(
                      180deg,
                      rgba(16,74,43,0.02),
                      rgba(3,48,31,0.80)
                    ),
                    url("${LAND_IMAGE}")
                  `,
                }}
              >

                <div className="fcc-pulse-card-icon land">
                  ◈
                </div>

                <div className="fcc-pulse-bottom">

                  <span>
                    LAND UNDER CARE
                  </span>

                  <strong>

                    {stats.loading
                      ? "..."
                      : stats.totalLand.toFixed(1)
                    }

                    <small>
                      ACRES
                    </small>

                  </strong>

                  <p>
                    Explore your farm landscape →
                  </p>

                </div>

              </button>


              {/* =================================================
                  CROP CARD
              ================================================= */}

              <button
                type="button"
                className="fcc-pulse-card fcc-crop-card"
                onClick={() =>
                  goTo("/crop-list")
                }
                style={{
                  backgroundImage: `
                    linear-gradient(
                      180deg,
                      rgba(48,78,16,0.02),
                      rgba(28,58,14,0.74)
                    ),
                    url("${CROP_IMAGE}")
                  `,
                }}
              >

                <div className="fcc-pulse-card-icon crop">
                  🌾
                </div>

                <div className="fcc-pulse-bottom">

                  <span>
                    CROP PLANS
                  </span>

                  <strong>
                    {stats.loading
                      ? "..."
                      : stats.activeCrops
                    }
                  </strong>

                  <p>
                    View your crop records →
                  </p>

                </div>

              </button>


              {/* =================================================
                  EXPENSE CARD
              ================================================= */}

              <button
                type="button"
                className="fcc-pulse-card fcc-expense-card"
                onClick={() =>
                  goTo("/expense-list")
                }
                style={{
                  backgroundImage: `
                    linear-gradient(
                      180deg,
                      rgba(86,60,20,0.02),
                      rgba(54,34,15,0.78)
                    ),
                    url("${EXPENSE_IMAGE}")
                  `,
                }}
              >

                <div className="fcc-pulse-card-icon expense">
                  ₹
                </div>

                <div className="fcc-pulse-bottom">

                  <span>
                    FARM ECONOMICS
                  </span>

                  <strong className="expense-value">

                    {stats.loading
                      ? "..."
                      : `₹${stats.totalExpenses.toLocaleString(
                          "en-IN"
                        )}`
                    }

                  </strong>

                  <p>
                    Track farm expenditure →
                  </p>

                </div>

              </button>

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="fcc-quick">

            <div className="fcc-section-head">

              <div className="fcc-section-head-left">

                <div className="fcc-section-icon">
                  ⚡
                </div>

                <div>

                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Start your next farm operation.
                  </p>

                </div>

              </div>

            </div>


            <div className="fcc-quick-grid">


              {/* FARM */}

              <button
                type="button"
                className="fcc-quick-card farm-action"
                onClick={() =>
                  goTo("/farm-add")
                }
              >

                <div className="fcc-quick-icon">
                  +
                </div>

                <div>

                  <strong>
                    Register Farm Plot
                  </strong>

                  <span>
                    Add an agricultural field
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>


              {/* CROP */}

              <button
                type="button"
                className="fcc-quick-card crop-action"
                onClick={() =>
                  goTo("/crop-add")
                }
              >

                <div className="fcc-quick-icon">
                  🌱
                </div>

                <div>

                  <strong>
                    Log Crop Planting
                  </strong>

                  <span>
                    Record crop information
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>


              {/* EXPENSE */}

              <button
                type="button"
                className="fcc-quick-card expense-action"
                onClick={() =>
                  goTo("/expense-entry")
                }
              >

                <div className="fcc-quick-icon">
                  ₹
                </div>

                <div>

                  <strong>
                    Record Expense
                  </strong>

                  <span>
                    Add farm expenditure
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>

            </div>

          </section>


          {/* =================================================
              QUOTE
          ================================================= */}

          <section className="fcc-quote-section">

            <div className="fcc-quote-mark">
              “
            </div>

            <div className="fcc-quote-content">

              <span>
                FARMVERSE FARM THOUGHT
              </span>

              <h2>
                Healthy soil, thoughtful farming,
                and consistent care turn every field
                into tomorrow's harvest.
              </h2>

              <p>
                Your farm is more than land —
                it is a living system.
              </p>

            </div>

            <div className="fcc-quote-leaf">
              🌾
            </div>

          </section>


          {/* =================================================
              BOTTOM STRIP
          ================================================= */}

          <section className="fcc-bottom-strip">

            <div>

              <span>
                TODAY'S FARM FOCUS
              </span>

              <strong>
                Observe. Plan. Grow.
              </strong>

            </div>


            <div className="fcc-bottom-line">

              <span />
              <span />
              <span />
              <span />
              <span />

            </div>


            <p>
              Better farm decisions begin
              with better information.
            </p>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="fcc-footer">

            🔒 Farm information securely managed

            <span>
              •
            </span>

            FarmVerse Precision Agriculture

          </div>

        </div>

      </main>

    </div>
  );
};


export default FarmerMenu;