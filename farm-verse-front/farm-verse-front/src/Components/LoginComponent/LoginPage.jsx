import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../../Services/LoginService";

import "./LoginPage.css";

// ============================================================
// FARMER IMAGE
// ============================================================

const FARMER_LOGIN_IMAGE =
  "https://images.openai.com/static-rsc-4/JjCccoi--AokxDJGygcc0LcPwz8Lk_Tt_FTeCRg4RljEzgh2nMNP3SAdfCI1EilopPvGa8nnGJUO_v2bOwKjRDPMF2L5DpzuTsVWzqpCSR8g8WOml0B_zVp3mkEGX0vkvRLjAhURB4rVnchTeNOBjIEYnblk6g3ubfwYeg5fxzc?purpose=inline";


// ============================================================
// LEAF PARTICLES
// ============================================================

const LEAF_PARTICLES = [
  {
    top: "12%",
    left: "8%",
    size: 18,
    delay: "0s",
    duration: "8s",
  },
  {
    top: "25%",
    left: "88%",
    size: 13,
    delay: "1s",
    duration: "7s",
  },
  {
    top: "55%",
    left: "7%",
    size: 15,
    delay: "2s",
    duration: "9s",
  },
  {
    top: "76%",
    left: "90%",
    size: 18,
    delay: "1.5s",
    duration: "8s",
  },
  {
    top: "42%",
    left: "52%",
    size: 11,
    delay: "3s",
    duration: "7s",
  },
];


// ============================================================
// LEAF COMPONENT
// ============================================================

const Leaf = ({ style }) => {
  return (
    <svg
      className="fp-leaf"
      viewBox="0 0 24 24"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 21V9C12 5 8 4 4 4C4 8 5 12 9 13.5C10 13.9 11 14.4 12 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


// ============================================================
// LOGIN PAGE
// ============================================================

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const validateLogin = (event) => {
    event.preventDefault();

    setSubmitting(true);

    validateUser(
      loginData.username,
      loginData.password
    )
      .then((response) => {
        const reply = String(response.data);

        if (
          reply === "True" ||
          reply === "true"
        ) {
          if (rememberMe) {
            localStorage.setItem(
              "fv_remember_username",
              loginData.username
            );
          } else {
            localStorage.removeItem(
              "fv_remember_username"
            );
          }

          navigate("/farmer-menu");
        } else {
          setFlag(false);
        }
      })
      .catch(() => {
        setFlag(false);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const onChangeHandler = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFlag(true);

    setLoginData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };


  // ==========================================================
  // VALIDATION
  // ==========================================================

  const handleValidation = (event) => {
    event.preventDefault();

    const tempErrors = {};
    let valid = true;

    if (!loginData.username.trim()) {
      tempErrors.username =
        "Username is required";

      valid = false;
    }

    if (!loginData.password.trim()) {
      tempErrors.password =
        "Password is required";

      valid = false;
    }

    setErrors(tempErrors);

    if (valid) {
      validateLogin(event);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="fp-page">

      {/* ====================================================
          LEFT FARMER IMAGE SECTION
      ==================================================== */}

      <section className="fp-story">

        <img
          src={FARMER_LOGIN_IMAGE}
          alt="Farmer working in agricultural field"
          className="fp-photo"
        />

        <div
          className="fp-story-overlay"
          aria-hidden="true"
        />

        <div
          className="fp-story-sun"
          aria-hidden="true"
        />


        {/* Floating leaves */}

        {LEAF_PARTICLES.map(
          (item, index) => (
            <Leaf
              key={index}
              style={{
                top: item.top,
                left: item.left,
                width: `${item.size}px`,
                height: `${item.size}px`,
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            />
          )
        )}


        {/* Story content */}

        <div className="fp-story-content">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="fp-brand">

            <div className="fp-brand-icon">
              🌱
            </div>

            <div>

              <div className="fp-brand-name">
                FarmVerse
              </div>

              <div className="fp-brand-tagline">
                Precision Agriculture
              </div>

            </div>

          </div>


          {/* =================================================
              FARMER MESSAGE
          ================================================= */}

          <div className="fp-story-message">

            <div className="fp-small-label">
              FARM • TECHNOLOGY • FUTURE
            </div>

            <h2 className="fp-quote">

              Every seed carries a dream.
              <br />

              <span>
                Every harvest tells a story.
              </span>

            </h2>

            <p className="fp-quote-sub">

              Empowering farmers with smarter
              decisions, better insights, and
              sustainable growth.

            </p>

            <div className="fp-story-line" />

          </div>

        </div>

      </section>


      {/* ====================================================
          RIGHT LOGIN SECTION
      ==================================================== */}

      <section className="fp-login">

        {/* Agricultural background */}

        <div
          className="fp-login-bg"
          style={{
            backgroundImage:
              `url("${FARMER_LOGIN_IMAGE}")`,
          }}
        />

        {/* Overlay */}

        <div className="fp-login-overlay" />

        {/* Grid */}

        <div className="fp-login-grid" />


        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <div className="fp-card">

          {/* Card top */}

          <div className="fp-card-top">

            <div className="fp-login-icon">
              🌾
            </div>

            <div>

              <span className="fp-login-label">
                FARMER PORTAL
              </span>

            </div>

          </div>


          {/* =================================================
              HEADING
          ================================================= */}

          <h1 className="fp-card-title">

            Welcome Back,
            <span> Farmer</span>

          </h1>


          <p className="fp-card-sub">

            Continue managing your farm smarter.

          </p>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleValidation}
            noValidate
          >

            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="fp-field">

              <label htmlFor="username">
                Username
              </label>

              <div
                className={
                  `fp-input-shell ${
                    errors.username
                      ? "fp-input-shell-error"
                      : ""
                  }`
                }
              >

                {/* User icon */}

                <svg
                  className="fp-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >

                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                  />

                  <path
                    d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
                    strokeLinecap="round"
                  />

                </svg>


                <input
                  id="username"
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={onChangeHandler}
                  autoComplete="username"
                  placeholder="Enter your username"
                />

              </div>


              {errors.username && (
                <p className="fp-error">
                  {errors.username}
                </p>
              )}

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="fp-field">

              <label htmlFor="password">
                Password
              </label>

              <div
                className={
                  `fp-input-shell ${
                    errors.password
                      ? "fp-input-shell-error"
                      : ""
                  }`
                }
              >

                {/* Lock icon */}

                <svg
                  className="fp-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >

                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />

                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    strokeLinecap="round"
                  />

                </svg>


                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={loginData.password}
                  onChange={onChangeHandler}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />


                {/* Show / Hide */}

                <button
                  type="button"
                  className="fp-visibility"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                >

                  {showPassword
                    ? "Hide"
                    : "Show"}

                </button>

              </div>


              {errors.password && (
                <p className="fp-error">
                  {errors.password}
                </p>
              )}

            </div>


            {/* =================================================
                REMEMBER + FORGOT
            ================================================= */}

            <div className="fp-row">

              <label className="fp-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="fp-link"
              >
                Forgot Password?
              </button>

            </div>


            {/* =================================================
                INVALID LOGIN
            ================================================= */}

            {!flag && (
              <div className="fp-error-banner">

                <span>
                  !
                </span>

                Invalid username or password

              </div>
            )}


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="fp-submit"
              disabled={submitting}
            >

              <span>

                {submitting
                  ? "Signing in..."
                  : "Login"}

              </span>


              {!submitting && (
                <span className="fp-arrow">
                  →
                </span>
              )}

            </button>


            {/* =================================================
                REGISTER
            ================================================= */}

            <p className="fp-footer">

              New to FarmVerse?

              <button
                type="button"
                className="fp-link fp-link-strong"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>

            </p>

          </form>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="fp-security">

            <span>
              🔒
            </span>

            Secure Farmer Access

            <span className="fp-dot">
              •
            </span>

            FarmVerse

          </div>

        </div>

      </section>

    </div>
  );
};


export default LoginPage;