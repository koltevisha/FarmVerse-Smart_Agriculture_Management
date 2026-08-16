import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../Services/LoginService";
import "./AppLayout.css";

/* =========================================================
   ICONS
   ========================================================= */

const IconBrand = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconOverview = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconLandscape = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
    <path d="M3 21h18" />
  </svg>
);

const IconCrops = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M12 21V10" />
    <path d="M12 10C12 6 8 4 4 4C4 9 7 11 12 10Z" />
    <path d="M12 13C12 9 16 7 20 7C20 12 17 14 12 13Z" />
  </svg>
);

const IconEconomics = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconAI = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1" />
    <path d="M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);

const IconPlus = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconLogout = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


/* =========================================================
   APP LAYOUT
   ========================================================= */

const AppLayout = ({ children, pageTitle, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);


  /* Close mobile menu whenever route changes */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);


  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      })
      .catch(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      });
  };


  /* =======================================================
     MAIN NAVIGATION
     ======================================================= */

  const navItems = [
    {
      label: "Overview",
      path: "/farmer-menu",
      icon: IconOverview,
    },
    {
      label: "Farm Landscape",
      path: "/farm-list",
      icon: IconLandscape,
    },
    {
      label: "Crop Journal",
      path: "/crop-list",
      icon: IconCrops,
    },
    {
      label: "Farm Economics",
      path: "/expense-list",
      icon: IconEconomics,
    },
    {
      label: "Farm Intelligence",
      path: "/crop-list",
      icon: IconAI,
    },
  ];


  /* =======================================================
     QUICK ACTIONS
     ======================================================= */

  const actionItems = [
    {
      label: "Register Farm Plot",
      path: "/farm-add",
    },
    {
      label: "Log Crop Planting",
      path: "/crop-add",
    },
    {
      label: "Record Expense",
      path: "/expense-entry",
    },
  ];


  /* =======================================================
     DATE
     ======================================================= */

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });


  return (
    <div className="al-shell">

      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <aside
        className={`al-sidebar ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
      >

        {/* ===============================================
            LOGO
            =============================================== */}

        <div className="al-sidebar-top">

          <div
            className="al-logo"
            onClick={() => navigate("/farmer-menu")}
          >

            <div className="al-logo-icon">
              <IconBrand className="al-brand-svg" />
            </div>

            <div className="al-logo-text">

              <span className="al-brand-name">
                FarmVerse
              </span>

              <span className="al-brand-tag">
                Precision Agriculture
              </span>

            </div>

          </div>


          {/* Mobile close button */}

          <button
            type="button"
            className="al-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <IconClose className="al-icon" />
          </button>

        </div>


        {/* ===============================================
            NAVIGATION
            =============================================== */}

        <nav className="al-nav">

          {/* MAIN NAVIGATION */}

          <div className="al-nav-section">

            <span className="al-section-title">
              Farm Management
            </span>

            {navItems.map((item) => {

              const IconComp = item.icon;

              const isActive =
                location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`al-nav-link ${
                    isActive ? "is-active" : ""
                  }`}
                >

                  <IconComp className="al-nav-icon" />

                  <span className="al-nav-label">
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="al-active-indicator" />
                  )}

                </Link>
              );
            })}

          </div>


          {/* =============================================
              OPERATIONS
              ============================================= */}

          <div className="al-nav-section">

            <span className="al-section-title">
              Quick Operations
            </span>

            {actionItems.map((item) => {

              const isActive =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`al-nav-action-link ${
                    isActive ? "is-active" : ""
                  }`}
                >

                  <IconPlus className="al-action-icon" />

                  <span>
                    {item.label}
                  </span>

                </Link>
              );
            })}

          </div>

        </nav>


        {/* ===============================================
            SIDEBAR FOOTER
            =============================================== */}

        <div className="al-sidebar-footer">

          <div className="al-user-info">

            <div className="al-user-avatar">
              👨‍🌾
            </div>

            <div className="al-user-meta">

              <span className="al-user-role">
                Farm Operator
              </span>

              <span className="al-user-status">
                ● Farm System Active
              </span>

            </div>

          </div>


          {/* Logout */}

          <button
            type="button"
            className="al-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >

            <IconLogout className="al-logout-icon" />

            <span>
              Sign Out
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          MOBILE BACKDROP
          ================================================= */}

      {mobileOpen && (
        <div
          className="al-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}


      {/* =================================================
          MAIN CONTENT AREA
          ================================================= */}

      <div className="al-main-wrap">


        {/* ===============================================
            HEADER
            =============================================== */}

        <header className="al-header">

          <div className="al-header-left">

            {/* Mobile menu */}

            <button
              type="button"
              className="al-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <IconMenu className="al-icon" />
            </button>


            <div>

              <h1 className="al-page-title">
                {pageTitle ||
                  "Digital Farm Command Center"}
              </h1>

              {subtitle && (
                <p className="al-page-subtitle">
                  {subtitle}
                </p>
              )}

            </div>

          </div>


          {/* =============================================
              HEADER RIGHT
              ============================================= */}

          <div className="al-header-right">

            <div className="al-weather-chip">

              <span className="al-pulse-dot" />

              <span>
                {todayStr} • Clear 28°C • Soil Moist
              </span>

            </div>

          </div>

        </header>


        {/* ===============================================
            PAGE CONTENT
            =============================================== */}

        <main className="al-content-body contour-bg">
          {children}
        </main>

      </div>

    </div>
  );
};


export default AppLayout;