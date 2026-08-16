import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerNewUser } from "../../Services/LoginService";

import "./RegisterUser.css";


// ============================================================
// FARMVERSE REGISTER USER
// ============================================================

const RegisterUser = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");


  // ==========================================================
  // IMAGE
  // ==========================================================

  const REGISTER_IMAGE =
    "https://images.openai.com/static-rsc-4/r-yL73TIKMmlH9yi4pJ35B_k4VFcyQECvd_tbbIiV1q6xOTb0tv_U7KezBnZMFzbIgDW2nMWtuYtD7i3NSzDwhzlng5DIP37hmJ43K0HAu11MnkLJJ8aUE6ywqhrIcBem5eqGpnKmKIaRzgHU-yDNZKg6ew3Wv16oR49Ws1DkB0MHKMAxpX10hPRwTSnAtD2?purpose=fullsize";


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
    setMessageType("");
  };


  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {

    const newErrors = {};

    let valid = true;


    // Full name

    if (!formData.fullname.trim()) {

      newErrors.fullname =
        "Full name is required";

      valid = false;
    }


    // Username

    if (!formData.username.trim()) {

      newErrors.username =
        "Username is required";

      valid = false;
    }


    // Email

    if (!formData.email.trim()) {

      newErrors.email =
        "Email address is required";

      valid = false;

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {

      newErrors.email =
        "Enter a valid email address";

      valid = false;
    }


    // Password

    if (!formData.password) {

      newErrors.password =
        "Password is required";

      valid = false;

    } else if (
      formData.password.length < 5 ||
      formData.password.length > 10
    ) {

      newErrors.password =
        "Password must contain 5–10 characters";

      valid = false;
    }


    // Confirm password

    if (!formData.confirmPassword) {

      newErrors.confirmPassword =
        "Please confirm your password";

      valid = false;

    } else if (
      formData.password !==
      formData.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match";

      valid = false;
    }


    setErrors(newErrors);

    return valid;
  };


  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setMessageType("");


    if (!validateForm()) {
      return;
    }


    setSubmitting(true);


    try {

      /*
       * IMPORTANT:
       * Your LoginService exports registerNewUser,
       * so we call registerNewUser here.
       */

      const response = await registerNewUser(
        formData
      );


      console.log(
        "Registration response:",
        response
      );


      setMessage(
        "Account created successfully!"
      );

      setMessageType("success");


      // Clear form

      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });


      // Go to login after short delay

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setMessage(
        "Registration failed. Please try again."
      );

      setMessageType("error");

    } finally {

      setSubmitting(false);

    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="register-page">


      {/* ====================================================
          MAIN CONTAINER
      ==================================================== */}

      <div className="register-container">


        {/* ==================================================
            LEFT FARMER IMAGE
        ================================================== */}

        <section className="register-left">

          <img
            src={REGISTER_IMAGE}
            alt="Farmer working in agricultural field"
            className="register-image"
          />


          <div className="register-left-content">


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="register-brand">

              <div className="register-brand-icon">
                🌱
              </div>


              <div>

                <div className="register-brand-name">
                  FarmVerse
                </div>

                <div className="register-brand-tagline">
                  Precision Agriculture
                </div>

              </div>

            </div>


            {/* =================================================
                LEFT MESSAGE
            ================================================= */}

            <div className="register-left-message">


              <div className="register-small-label">
                FARM • TECHNOLOGY • FUTURE
              </div>


              <h2 className="register-left-title">

                Grow smarter.
                <br />

                <span>
                  Farm better.
                </span>

              </h2>


              <p className="register-left-description">

                Create your FarmVerse account and
                manage your farms, crops, inputs
                and agricultural expenses from
                one place.

              </p>


              <div className="register-left-line" />

            </div>


          </div>

        </section>


        {/* ==================================================
            RIGHT REGISTRATION SECTION
        ================================================== */}

        <section className="register-right">


          <div className="register-form-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="register-header">


              <div className="register-header-top">

                <span className="register-header-icon">
                  🌱
                </span>

                <span className="register-header-label">
                  WELCOME TO FARMVERSE
                </span>

              </div>


              <h1 className="register-title">
                Create Your Farm Account
              </h1>


              <p className="register-subtitle">

                Register as a farm administrator to
                manage crops, inputs and expenses.

              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="register-form"
              onSubmit={handleSubmit}
              noValidate
            >


              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div className="register-field">

                <label htmlFor="fullname">
                  FULL NAME
                </label>


                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="e.g. Asha Reddy"
                  className={
                    `register-input ${
                      errors.fullname
                        ? "error"
                        : ""
                    }`
                  }
                  autoComplete="name"
                />


                {errors.fullname && (

                  <p className="register-error">
                    {errors.fullname}
                  </p>

                )}

              </div>


              {/* =================================================
                  USERNAME
              ================================================= */}

              <div className="register-field">

                <label htmlFor="username">
                  USERNAME
                </label>


                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. asha.reddy"
                  className={
                    `register-input ${
                      errors.username
                        ? "error"
                        : ""
                    }`
                  }
                  autoComplete="username"
                />


                {errors.username && (

                  <p className="register-error">
                    {errors.username}
                  </p>

                )}

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="register-field">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>


                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. asha@farmverse.com"
                  className={
                    `register-input ${
                      errors.email
                        ? "error"
                        : ""
                    }`
                  }
                  autoComplete="email"
                />


                {errors.email && (

                  <p className="register-error">
                    {errors.email}
                  </p>

                )}

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="register-field">

                <label htmlFor="password">
                  PASSWORD 5–10 CHARACTERS
                </label>


                <div className="register-input-wrapper">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={
                      `register-input register-password-input ${
                        errors.password
                          ? "error"
                          : ""
                      }`
                    }
                    autoComplete="new-password"
                  />


                  <button
                    type="button"
                    className="register-show-button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                  >

                    {showPassword
                      ? "Hide"
                      : "Show"}

                  </button>

                </div>


                {errors.password && (

                  <p className="register-error">
                    {errors.password}
                  </p>

                )}

              </div>


              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  CONFIRM PASSWORD
                </label>


                <div className="register-input-wrapper">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={
                      `register-input register-password-input ${
                        errors.confirmPassword
                          ? "error"
                          : ""
                      }`
                    }
                    autoComplete="new-password"
                  />


                  <button
                    type="button"
                    className="register-show-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >

                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}

                  </button>

                </div>


                {errors.confirmPassword && (

                  <p className="register-error">
                    {errors.confirmPassword}
                  </p>

                )}

              </div>


              {/* =================================================
                  MESSAGE
              ================================================= */}

              {message && (

                <div
                  className={
                    `register-message ${messageType}`
                  }
                >
                  {message}
                </div>

              )}


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="register-submit"
                disabled={submitting}
              >

                {submitting
                  ? "Creating Account..."
                  : "Create Account  →"}

              </button>


              {/* =================================================
                  LOGIN
              ================================================= */}

              <p className="register-login-text">

                Already have an account?

                <button
                  type="button"
                  className="register-login-button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Sign In
                </button>

              </p>


            </form>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="register-security">

              <span>
                🔒
              </span>

              Secure Farmer Access

              <span className="register-security-dot">
                •
              </span>

              FarmVerse

            </div>


          </div>

        </section>


      </div>

    </div>

  );
};


export default RegisterUser;