import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function Register() {
  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // =========================================================
  // REGISTER
  // =========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (
        !form.full_name.trim()
      ) {
        setError(
          "Please enter your full name."
        );
        return;
      }


      if (
        !form.email.trim() &&
        !form.phone.trim()
      ) {
        setError(
          "Please enter an email or phone number."
        );
        return;
      }


      if (
        form.password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }


      if (
        form.password !==
        form.confirm_password
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }


      try {

        setLoading(true);


        const response =
          await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  full_name:
                    form.full_name.trim(),

                  email:
                    form.email.trim() ||
                    null,

                  phone:
                    form.phone.trim() ||
                    null,

                  password:
                    form.password,
                }),
            }
          );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Registration failed."
          );
        }


        const token =
          data.data?.token;

        const user =
          data.data?.user;


        if (
          !token ||
          !user
        ) {
          throw new Error(
            "Registration succeeded but account information was not returned."
          );
        }


        localStorage.setItem(
          "authToken",
          token
        );


        localStorage.setItem(
          "authUser",
          JSON.stringify(user)
        );


        setSuccess(
          "Account created successfully."
        );


        setTimeout(() => {
          navigate("/");
        }, 800);


      } catch (err) {

        console.error(
          "Registration error:",
          err
        );


        setError(
          err.message ||
            "Unable to create account."
        );


      } finally {

        setLoading(false);

      }
    };


  return (
    <>
      <style>{styles}</style>


      <main className="lep-register-page">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="lep-register-grid" />

        <div className="lep-register-orb register-orb-one" />
        <div className="lep-register-orb register-orb-two" />
        <div className="lep-register-orb register-orb-three" />


        <div className="lep-register-container">


          {/* =================================================
              WELCOME PANEL
          ================================================= */}

          <section className="lep-register-welcome">


            <div className="lep-register-brand">

              <div className="lep-register-brand-icon">
                L
              </div>


              <div>

                <strong>
                  Loralai Education
                </strong>

                <span>
                  Portal
                </span>

              </div>

            </div>


            <span className="lep-register-label">

              <SmartIcon
                name="school"
                size={13}
              />

              WELCOME TO LORALAI

            </span>


            <h1>

              Join the
              <span>
                Education Community.
              </span>

            </h1>


            <p>
              Create your free account and become
              part of the Loralai Education Portal.
              Explore institutions, tutors, news and
              educational opportunities.
            </p>


            {/* =================================================
                BENEFITS
            ================================================= */}

            <div className="lep-register-benefits">


              <div className="lep-register-benefit">

                <div className="lep-register-benefit-icon">

                  <SmartIcon
                    name="school"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Explore Education
                  </strong>

                  <span>
                    Find schools, colleges,
                    universities and academies.
                  </span>

                </div>

              </div>


              <div className="lep-register-benefit">

                <div className="lep-register-benefit-icon">

                  <SmartIcon
                    name="teacher"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Discover Tutors
                  </strong>

                  <span>
                    Find verified tutors for
                    different subjects.
                  </span>

                </div>

              </div>


              <div className="lep-register-benefit">

                <div className="lep-register-benefit-icon">

                  <SmartIcon
                    name="news"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Stay Updated
                  </strong>

                  <span>
                    Get the latest educational
                    news and opportunities.
                  </span>

                </div>

              </div>

            </div>


            <div className="lep-register-footer">

              <span>
                LORALAI EDUCATION PORTAL
              </span>

              <span>
                © 2026
              </span>

            </div>

          </section>


          {/* =================================================
              REGISTER CARD
          ================================================= */}

          <section className="lep-register-card">


            <div className="lep-register-card-icon">

              <SmartIcon
                name="user"
                size={24}
              />

            </div>


            <span className="lep-register-eyebrow">

              CREATE YOUR ACCOUNT

            </span>


            <h2>
              Get Started
            </h2>


            <p className="lep-register-description">
              Create your account to access
              account-based features of the portal.
            </p>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="lep-register-error">

                <SmartIcon
                  name="warning"
                  size={15}
                />

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="lep-register-success">

                <SmartIcon
                  name="verified"
                  size={15}
                />

                <span>
                  {success}
                </span>

              </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="lep-register-form"
              onSubmit={
                handleSubmit
              }
            >


              {/* FULL NAME */}

              <div className="lep-register-field">

                <label>
                  <span>
                    Full Name
                  </span>

                  <small>
                    Required
                  </small>
                </label>


                <div className="lep-register-input-wrap">

                  <SmartIcon
                    name="user"
                    size={16}
                  />


                  <input
                    type="text"
                    name="full_name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="lep-register-field">

                <label>
                  <span>
                    Email
                  </span>

                  <small>
                    Optional
                  </small>
                </label>


                <div className="lep-register-input-wrap">

                  <SmartIcon
                    name="mail"
                    size={16}
                  />


                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="lep-register-field">

                <label>
                  <span>
                    Phone
                  </span>

                  <small>
                    Optional
                  </small>
                </label>


                <div className="lep-register-input-wrap">

                  <SmartIcon
                    name="phone"
                    size={16}
                  />


                  <input
                    type="text"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="03001234567"
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="lep-register-field">

                <label>
                  <span>
                    Password
                  </span>

                  <small>
                    Min. 6 characters
                  </small>
                </label>


                <div className="lep-register-input-wrap">

                  <SmartIcon
                    name="lock"
                    size={16}
                  />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />


                  <button
                    type="button"
                    className="lep-register-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    <SmartIcon
                      name={
                        showPassword
                          ? "eye-off"
                          : "eye"
                      }
                      size={16}
                    />

                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="lep-register-field">

                <label>
                  <span>
                    Confirm Password
                  </span>

                  <small>
                    Required
                  </small>
                </label>


                <div className="lep-register-input-wrap">

                  <SmartIcon
                    name="lock"
                    size={16}
                  />


                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirm_password"
                    value={
                      form.confirm_password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                  />


                  <button
                    type="button"
                    className="lep-register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    <SmartIcon
                      name={
                        showConfirmPassword
                          ? "eye-off"
                          : "eye"
                      }
                      size={16}
                    />

                  </button>

                </div>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="lep-register-submit"
                disabled={
                  loading
                }
              >

                {loading ? (

                  <>

                    <span className="lep-register-spinner" />

                    Creating account...

                  </>

                ) : (

                  <>

                    Create Account

                    <SmartIcon
                      name="arrow-right"
                      size={15}
                    />

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                LOGIN
            ================================================= */}

            <div className="lep-register-login">

              <span>
                Already have an account?
              </span>


              <Link
                to="/login"
              >

                Sign In

                <SmartIcon
                  name="arrow-right"
                  size={12}
                />

              </Link>

            </div>


            {/* =================================================
                PUBLIC BROWSING
            ================================================= */}

            <Link
              to="/"
              className="lep-register-public-link"
            >

              <SmartIcon
                name="home"
                size={13}
              />

              Continue browsing as visitor

            </Link>

          </section>

        </div>

      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

/* =========================================================
   PAGE
========================================================= */

.lep-register-page {
  position: relative;

  min-height: calc(100vh - 78px);

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  padding:
    50px 20px;

  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(44,95,138,.16),
      transparent 28%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(255,107,0,.10),
      transparent 28%
    ),
    linear-gradient(
      135deg,
      #edf4f9,
      #f8fafc 55%,
      #eef3f7
    );
}


/* =========================================================
   BACKGROUND GRID
========================================================= */

.lep-register-grid {
  position: absolute;

  inset: 0;

  opacity: .35;

  background-image:
    linear-gradient(
      rgba(44,95,138,.055) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(44,95,138,.055) 1px,
      transparent 1px
    );

  background-size:
    45px 45px;

  mask-image:
    linear-gradient(
      to bottom,
      rgba(0,0,0,.9),
      transparent
    );

  pointer-events: none;
}


/* =========================================================
   FLOATING ORBS
========================================================= */

.lep-register-orb {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  animation:
    lepRegisterFloat
    8s ease-in-out infinite;
}


.register-orb-one {
  width: 300px;
  height: 300px;

  left: -120px;
  top: 8%;

  background:
    radial-gradient(
      circle at 35% 35%,
      rgba(44,95,138,.22),
      rgba(44,95,138,.035) 68%,
      transparent 70%
    );
}


.register-orb-two {
  width: 360px;
  height: 360px;

  right: -150px;
  bottom: -100px;

  background:
    radial-gradient(
      circle at 40% 40%,
      rgba(255,107,0,.14),
      rgba(255,107,0,.025) 68%,
      transparent 70%
    );

  animation-delay:
    -3s;
}


.register-orb-three {
  width: 120px;
  height: 120px;

  right: 18%;
  top: 12%;

  background:
    radial-gradient(
      circle,
      rgba(44,95,138,.14),
      rgba(44,95,138,.02) 68%,
      transparent 70%
    );

  animation-delay:
    -5s;
}


@keyframes lepRegisterFloat {

  0%,
  100% {
    transform:
      translate3d(0,0,0);
  }

  50% {
    transform:
      translate3d(
        0,
        -18px,
        0
      );
  }

}


/* =========================================================
   CONTAINER
========================================================= */

.lep-register-container {
  position: relative;

  z-index: 2;

  width:
    min(
      1080px,
      100%
    );

  display: grid;

  grid-template-columns:
    minmax(0,1.05fr)
    minmax(390px,.95fr);

  gap: 30px;

  align-items: stretch;
}


/* =========================================================
   WELCOME PANEL
========================================================= */

.lep-register-welcome {
  position: relative;

  overflow: hidden;

  min-height: 700px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  padding: 48px;

  border:
    1px solid
    rgba(255,255,255,.18);

  border-radius: 28px;

  background:
    linear-gradient(
      145deg,
      #142f4f,
      #1f4e78 52%,
      #2c5f8a
    );

  color:
    #ffffff;

  box-shadow:
    0 30px 70px
    rgba(20,47,79,.19),

    0 18px 0
    rgba(20,43,71,.8);

  transform:
    perspective(1200px)
    rotateY(2deg);
}


.lep-register-welcome::before {
  content: "";

  position: absolute;

  width: 370px;
  height: 370px;

  right: -160px;
  top: -170px;

  border-radius: 50%;

  background:
    rgba(255,255,255,.055);
}


.lep-register-welcome::after {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  left: -145px;
  bottom: -135px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,.09);
}


/* =========================================================
   BRAND
========================================================= */

.lep-register-brand {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  gap: 11px;

  margin-bottom: 45px;
}


.lep-register-brand-icon {
  width: 48px;
  height: 48px;

  display: grid;

  place-items: center;

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      #ff6b00,
      #ed781e
    );

  color:
    #ffffff;

  font-size:
    20px;

  font-weight:
    900;

  box-shadow:
    0 8px 0
    #b84b00,

    0 14px 25px
    rgba(0,0,0,.16);
}


.lep-register-brand strong {
  display: block;

  color:
    #ffffff;

  font-size:
    16px;

  line-height:
    1.1;
}


.lep-register-brand span {
  display: block;

  margin-top:
    4px;

  color:
    #bcd0df;

  font-size:
    8px;

  letter-spacing:
    .7px;
}


/* =========================================================
   WELCOME
========================================================= */

.lep-register-label {
  position: relative;

  z-index: 2;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  width: max-content;

  padding:
    7px 9px;

  border:
    1px solid
    rgba(255,255,255,.12);

  border-radius:
    7px;

  background:
    rgba(255,255,255,.07);

  color:
    #ffb06e;

  font-size:
    7px;

  font-weight:
    900;

  letter-spacing:
    1.3px;
}


.lep-register-welcome h1 {
  position:
    relative;

  z-index:
    2;

  margin-top:
    17px;

  color:
    #ffffff;

  font-size:
    clamp(
      42px,
      5vw,
      62px
    );

  line-height:
    .97;

  letter-spacing:
    -2.5px;
}


.lep-register-welcome h1 span {
  display:
    block;

  color:
    #ff9348;
}


.lep-register-welcome > p {
  position:
    relative;

  z-index:
    2;

  max-width:
    520px;

  margin-top:
    18px;

  color:
    #d4e3ee;

  font-size:
    12px;

  line-height:
    1.85;
}


/* =========================================================
   BENEFITS
========================================================= */

.lep-register-benefits {
  position:
    relative;

  z-index:
    2;

  display:
    grid;

  gap:
    10px;

  margin-top:
    28px;
}


.lep-register-benefit {
  display:
    flex;

  align-items:
    center;

  gap:
    11px;

  padding:
    11px 12px;

  border:
    1px solid
    rgba(255,255,255,.08);

  border-radius:
    11px;

  background:
    rgba(255,255,255,.055);

  backdrop-filter:
    blur(8px);
}


.lep-register-benefit-icon {
  width:
    38px;

  height:
    38px;

  flex-shrink:
    0;

  display:
    grid;

  place-items:
    center;

  border-radius:
    10px;

  background:
    rgba(255,107,0,.15);

  color:
    #ff9348;
}


.lep-register-benefit strong {
  display:
    block;

  color:
    #ffffff;

  font-size:
    9px;
}


.lep-register-benefit span {
  display:
    block;

  margin-top:
    3px;

  color:
    #a9bfce;

  font-size:
    8px;

  line-height:
    1.5;
}


/* =========================================================
   FOOTER
========================================================= */

.lep-register-footer {
  position:
    relative;

  z-index:
    2;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    15px;

  margin-top:
    auto;

  padding-top:
    30px;
}


.lep-register-footer span {
  color:
    #91aabd;

  font-size:
    7px;

  font-weight:
    800;

  letter-spacing:
    .9px;
}


/* =========================================================
   REGISTER CARD
========================================================= */

.lep-register-card {
  position:
    relative;

  min-height:
    700px;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    center;

  padding:
    42px;

  border:
    1px solid
    rgba(255,255,255,.65);

  border-radius:
    28px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.97),
      rgba(247,250,252,.93)
    );

  box-shadow:
    0 30px 70px
    rgba(26,54,93,.13),

    0 14px 0
    rgba(214,224,232,.65);

  backdrop-filter:
    blur(18px);

  transform:
    perspective(1200px)
    rotateY(-2deg);
}


.lep-register-card::before {
  content: "";

  position: absolute;

  left: 0;
  right: 0;

  top: 0;

  height: 5px;

  border-radius:
    28px 28px 0 0;

  background:
    linear-gradient(
      90deg,
      #1a365d,
      #2c5f8a,
      #ff6b00
    );
}


/* =========================================================
   CARD HEADER
========================================================= */

.lep-register-card-icon {
  width:
    57px;

  height:
    57px;

  display:
    grid;

  place-items:
    center;

  margin-bottom:
    17px;

  border-radius:
    15px;

  background:
    linear-gradient(
      145deg,
      #1a365d,
      #2c5f8a
    );

  color:
    #ff9348;

  box-shadow:
    0 8px 0
    #142b47,

    0 15px 25px
    rgba(26,54,93,.13);
}


.lep-register-eyebrow {
  color:
    #ff6b00;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1.4px;
}


.lep-register-card h2 {
  margin-top:
    7px;

  color:
    #1a365d;

  font-size:
    clamp(
      30px,
      4vw,
      40px
    );

  line-height:
    1;

  letter-spacing:
    -1.5px;
}


.lep-register-description {
  max-width:
    430px;

  margin-top:
    10px;

  color:
    #718096;

  font-size:
    10px;

  line-height:
    1.7;
}


/* =========================================================
   MESSAGES
========================================================= */

.lep-register-error,
.lep-register-success {
  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  margin-top:
    17px;

  padding:
    10px 11px;

  border-radius:
    9px;

  font-size:
    9px;

  line-height:
    1.5;
}


.lep-register-error {
  border:
    1px solid
    #f0cccc;

  background:
    #fff5f5;

  color:
    #b42318;
}


.lep-register-success {
  border:
    1px solid
    #c9ead3;

  background:
    #f0fff4;

  color:
    #16803c;
}


/* =========================================================
   FORM
========================================================= */

.lep-register-form {
  display:
    grid;

  gap:
    14px;

  margin-top:
    22px;
}


.lep-register-field label {
  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    10px;

  margin-bottom:
    6px;
}


.lep-register-field label span {
  color:
    #334155;

  font-size:
    9px;

  font-weight:
    900;
}


.lep-register-field label small {
  color:
    #94a3b8;

  font-size:
    7px;

  font-weight:
    700;

  text-transform:
    uppercase;

  letter-spacing:
    .5px;
}


.lep-register-input-wrap {
  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  min-height:
    45px;

  padding:
    0 12px;

  border:
    1px solid
    #dce5ec;

  border-radius:
    10px;

  background:
    rgba(255,255,255,.88);

  color:
    #2c5f8a;

  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    transform .2s ease;
}


.lep-register-input-wrap:focus-within {
  border-color:
    #2c5f8a;

  box-shadow:
    0 0 0 4px
    rgba(44,95,138,.08);

  transform:
    translateY(-1px);
}


.lep-register-input-wrap input {
  flex:
    1;

  width:
    100%;

  min-width:
    0;

  border:
    none;

  outline:
    none;

  background:
    transparent;

  color:
    #1e293b;

  font-family:
    inherit;

  font-size:
    10px;
}


.lep-register-input-wrap input::placeholder {
  color:
    #a0aec0;
}


.lep-register-password-toggle {
  width:
    30px;

  height:
    30px;

  display:
    grid;

  place-items:
    center;

  flex-shrink:
    0;

  border:
    none;

  border-radius:
    7px;

  background:
    transparent;

  color:
    #718096;

  cursor:
    pointer;
}


.lep-register-password-toggle:hover {
  background:
    #eef4f8;

  color:
    #1a365d;
}


/* =========================================================
   SUBMIT
========================================================= */

.lep-register-submit {
  min-height:
    50px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    8px;

  margin-top:
    4px;

  border:
    none;

  border-radius:
    10px;

  background:
    linear-gradient(
      135deg,
      #1a365d,
      #2c5f8a
    );

  color:
    #ffffff;

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    900;

  cursor:
    pointer;

  box-shadow:
    0 8px 0
    #142b47,

    0 15px 25px
    rgba(26,54,93,.13);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}


.lep-register-submit:hover:not(:disabled) {
  transform:
    translateY(-2px);

  box-shadow:
    0 10px 0
    #142b47,

    0 18px 30px
    rgba(26,54,93,.16);
}


.lep-register-submit:active:not(:disabled) {
  transform:
    translateY(5px);

  box-shadow:
    0 3px 0
    #142b47;
}


.lep-register-submit:disabled {
  opacity:
    .7;

  cursor:
    not-allowed;
}


.lep-register-spinner {
  width:
    14px;

  height:
    14px;

  border:
    2px solid
    rgba(255,255,255,.3);

  border-top-color:
    #ffffff;

  border-radius:
    50%;

  animation:
    lepRegisterSpin
    .7s linear infinite;
}


@keyframes lepRegisterSpin {

  to {
    transform:
      rotate(360deg);
  }

}


/* =========================================================
   LOGIN LINK
========================================================= */

.lep-register-login {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-wrap:
    wrap;

  gap:
    5px;

  margin-top:
    17px;

  color:
    #718096;

  font-size:
    9px;
}


.lep-register-login a {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    4px;

  color:
    #1a365d;

  text-decoration:
    none;

  font-weight:
    900;
}


.lep-register-login a:hover {
  color:
    #ff6b00;
}


/* =========================================================
   PUBLIC LINK
========================================================= */

.lep-register-public-link {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    5px;

  margin-top:
    15px;

  padding-top:
    14px;

  border-top:
    1px solid
    #edf1f4;

  color:
    #94a3b8;

  text-decoration:
    none;

  font-size:
    8px;

  font-weight:
    700;
}


.lep-register-public-link:hover {
  color:
    #2c5f8a;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

  .lep-register-page {
    padding:
      35px 16px
      50px;
  }


  .lep-register-container {
    grid-template-columns:
      1fr;

    max-width:
      620px;
  }


  .lep-register-welcome {
    min-height:
      auto;

    padding:
      35px;

    transform:
      none;
  }


  .lep-register-card {
    min-height:
      auto;

    padding:
      35px;

    transform:
      none;
  }


  .lep-register-footer {
    margin-top:
      30px;
  }

}


@media (max-width: 560px) {

  .lep-register-page {
    min-height:
      calc(100vh - 70px);

    padding:
      22px 12px
      40px;
  }


  .lep-register-welcome {
    padding:
      28px 22px;

    border-radius:
      20px;
  }


  .lep-register-card {
    padding:
      27px 21px;

    border-radius:
      20px;
  }


  .lep-register-card::before {
    border-radius:
      20px 20px 0 0;
  }


  .lep-register-welcome h1 {
    font-size:
      40px;
  }


  .lep-register-card h2 {
    font-size:
      33px;
  }


  .lep-register-brand {
    margin-bottom:
      30px;
  }


  .lep-register-benefit {
    padding:
      9px;
  }


  .lep-register-benefit-icon {
    width:
      34px;

    height:
      34px;
  }

}

`;

export default Register;