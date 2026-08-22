import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function Login() {
  const navigate =
    useNavigate();


  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (
        !identifier.trim() ||
        !password
      ) {

        setError(
          "Please enter your email/phone and password."
        );

        return;
      }


      try {

        setLoading(true);


        const response =
          await fetch(
            `${API_URL}/api/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                identifier:
                  identifier.trim(),

                password,
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
              "Login failed."
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
            "Login succeeded but no account information was returned."
          );

        }


        // =====================================================
        // SAVE AUTH DATA
        // =====================================================

        localStorage.setItem(
          "authToken",
          token
        );


        localStorage.setItem(
          "authUser",
          JSON.stringify(user)
        );


        // =====================================================
        // ADMIN → ADMIN DASHBOARD
        // =====================================================

        if (
          user.role ===
            "super_admin" ||
          user.role ===
            "admin"
        ) {

          navigate("/admin");

        } else {

          // ===================================================
          // NORMAL USER → PUBLIC HOME
          // ===================================================

          navigate("/");

        }


      } catch (err) {

        console.error(
          "Login error:",
          err
        );


        setError(
          err.message ||
            "Unable to login."
        );

      } finally {

        setLoading(false);

      }

    };


  return (
    <>
      <style>{styles}</style>


      <main className="lep-login-page">


        {/* =================================================
            DECORATIVE BACKGROUND
        ================================================= */}

        <div className="lep-login-orb orb-one" />
        <div className="lep-login-orb orb-two" />
        <div className="lep-login-orb orb-three" />

        <div className="lep-login-grid" />


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="lep-login-container">


          {/* =================================================
              LEFT WELCOME PANEL
          ================================================= */}

          <section className="lep-login-welcome">


            <div className="lep-login-brand">

              <div className="lep-login-brand-icon">

                <span>
                  L
                </span>

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


            <span className="lep-login-welcome-label">

              <SmartIcon
                name="school"
                size={13}
              />

              WELCOME TO LORALAI

            </span>


            <h1>

              Education

              <span>
                Starts Here.
              </span>

            </h1>


            <p>
              Discover trusted educational
              information, schools, colleges,
              universities, tutors, news and
              opportunities across Loralai.
            </p>


            {/* =================================================
                FEATURE ITEMS
            ================================================= */}

            <div className="lep-login-features">


              <div className="lep-login-feature">

                <div className="lep-login-feature-icon">

                  <SmartIcon
                    name="school"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Verified Institutions
                  </strong>

                  <span>
                    Explore trusted education
                    information.
                  </span>

                </div>

              </div>


              <div className="lep-login-feature">

                <div className="lep-login-feature-icon">

                  <SmartIcon
                    name="teacher"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Find Expert Tutors
                  </strong>

                  <span>
                    Discover educators across
                    Loralai.
                  </span>

                </div>

              </div>


              <div className="lep-login-feature">

                <div className="lep-login-feature-icon">

                  <SmartIcon
                    name="news"
                    size={18}
                  />

                </div>


                <div>

                  <strong>
                    Latest Education News
                  </strong>

                  <span>
                    Stay updated with opportunities
                    and announcements.
                  </span>

                </div>

              </div>

            </div>


            <div className="lep-login-welcome-footer">

              <span>
                LORALAI EDUCATION PORTAL
              </span>

              <span>
                © 2026
              </span>

            </div>

          </section>


          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="lep-login-card">


            {/* CARD TOP ICON */}

            <div className="lep-login-card-icon">

              <SmartIcon
                name="user"
                size={24}
              />

            </div>


            <span className="lep-login-eyebrow">

              ACCOUNT ACCESS

            </span>


            <h2>
              Welcome Back
            </h2>


            <p className="lep-login-card-description">
              Sign in to your Loralai Education
              Portal account to continue.
            </p>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="lep-login-error">

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
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="lep-login-form"
            >


              {/* EMAIL / PHONE */}

              <div className="lep-login-field">

                <label>

                  <span>
                    Email / Phone
                  </span>

                  <small>
                    Required
                  </small>

                </label>


                <div className="lep-login-input-wrap">

                  <SmartIcon
                    name="user"
                    size={16}
                  />


                  <input
                    type="text"
                    value={
                      identifier
                    }
                    onChange={(event) =>
                      setIdentifier(
                        event.target.value
                      )
                    }
                    placeholder="Email or phone number"
                    autoComplete="username"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="lep-login-field">

                <label>

                  <span>
                    Password
                  </span>

                  <small>
                    Required
                  </small>

                </label>


                <div className="lep-login-input-wrap">

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
                    value={
                      password
                    }
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />


                  <button
                    type="button"
                    className="lep-login-password-toggle"
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


              {/* SUBMIT */}

              <button
                type="submit"
                className="lep-login-submit"
                disabled={
                  loading
                }
              >

                {loading ? (

                  <>

                    <span className="lep-login-spinner" />

                    Signing in...

                  </>

                ) : (

                  <>

                    Sign In

                    <SmartIcon
                      name="arrow-right"
                      size={15}
                    />

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                REGISTER
            ================================================= */}

            <div className="lep-login-register">

              <span>
                Don't have an account?
              </span>


              <Link
                to="/register"
              >

                Create Account

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
              className="lep-login-public-link"
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

.lep-login-page {
  position: relative;

  min-height: calc(100vh - 78px);

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  padding: 55px 20px;

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
   BACKGROUND
========================================================= */

.lep-login-grid {
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


.lep-login-orb {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(.2px);

  animation:
    lepLoginFloat
    8s ease-in-out infinite;
}


.orb-one {
  width: 300px;
  height: 300px;

  left: -120px;
  top: 10%;

  background:
    radial-gradient(
      circle at 35% 35%,
      rgba(44,95,138,.22),
      rgba(44,95,138,.035) 68%,
      transparent 70%
    );
}


.orb-two {
  width: 350px;
  height: 350px;

  right: -140px;
  bottom: -80px;

  background:
    radial-gradient(
      circle at 40% 40%,
      rgba(255,107,0,.15),
      rgba(255,107,0,.025) 68%,
      transparent 70%
    );

  animation-delay:
    -3s;
}


.orb-three {
  width: 115px;
  height: 115px;

  right: 19%;
  top: 16%;

  background:
    radial-gradient(
      circle,
      rgba(44,95,138,.15),
      rgba(44,95,138,.025) 68%,
      transparent 70%
    );

  animation-delay:
    -5s;
}


@keyframes lepLoginFloat {

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

.lep-login-container {
  position: relative;

  z-index: 2;

  width:
    min(
      1080px,
      100%
    );

  display: grid;

  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(380px, .95fr);

  gap: 30px;

  align-items: stretch;
}


/* =========================================================
   WELCOME PANEL
========================================================= */

.lep-login-welcome {
  position: relative;

  overflow: hidden;

  min-height: 600px;

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

  color: #ffffff;

  box-shadow:
    0 30px 70px
    rgba(20,47,79,.19),

    0 18px 0
    rgba(20,43,71,.8);

  transform:
    perspective(1200px)
    rotateY(2deg);
}


.lep-login-welcome::before {
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


.lep-login-welcome::after {
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

.lep-login-brand {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  gap: 11px;

  margin-bottom: 45px;
}


.lep-login-brand-icon {
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

  color: #ffffff;

  font-size: 20px;

  font-weight: 900;

  box-shadow:
    0 8px 0
    #b84b00,
    0 14px 25px
    rgba(0,0,0,.16);
}


.lep-login-brand strong {
  display: block;

  color: #ffffff;

  font-size: 16px;

  line-height: 1.1;
}


.lep-login-brand span {
  display: block;

  margin-top: 4px;

  color: #bcd0df;

  font-size: 8px;

  letter-spacing: .7px;
}


/* =========================================================
   WELCOME TEXT
========================================================= */

.lep-login-welcome-label {
  position: relative;

  z-index: 2;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  width: max-content;

  padding: 7px 9px;

  border:
    1px solid
    rgba(255,255,255,.12);

  border-radius: 7px;

  background:
    rgba(255,255,255,.07);

  color: #ffb06e;

  font-size: 7px;

  font-weight: 900;

  letter-spacing: 1.3px;
}


.lep-login-welcome h1 {
  position: relative;

  z-index: 2;

  margin-top: 17px;

  color: #ffffff;

  font-size:
    clamp(
      44px,
      5vw,
      64px
    );

  line-height: .96;

  letter-spacing: -2.6px;
}


.lep-login-welcome h1 span {
  display: block;

  color: #ff9348;
}


.lep-login-welcome > p {
  position: relative;

  z-index: 2;

  max-width: 520px;

  margin-top: 18px;

  color: #d4e3ee;

  font-size: 12px;

  line-height: 1.85;
}


/* =========================================================
   FEATURES
========================================================= */

.lep-login-features {
  position: relative;

  z-index: 2;

  display: grid;

  gap: 10px;

  margin-top: 28px;
}


.lep-login-feature {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 11px 12px;

  border:
    1px solid
    rgba(255,255,255,.08);

  border-radius: 11px;

  background:
    rgba(255,255,255,.055);

  backdrop-filter:
    blur(8px);
}


.lep-login-feature-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: grid;

  place-items: center;

  border-radius: 10px;

  background:
    rgba(255,107,0,.15);

  color: #ff9348;
}


.lep-login-feature strong {
  display: block;

  color: #ffffff;

  font-size: 9px;
}


.lep-login-feature span {
  display: block;

  margin-top: 3px;

  color: #a9bfce;

  font-size: 8px;

  line-height: 1.5;
}


/* =========================================================
   FOOTER
========================================================= */

.lep-login-welcome-footer {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-top: auto;

  padding-top: 30px;
}


.lep-login-welcome-footer span {
  color: #91aabd;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: .9px;
}


/* =========================================================
   LOGIN CARD
========================================================= */

.lep-login-card {
  position: relative;

  min-height: 600px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  padding: 42px;

  border:
    1px solid
    rgba(255,255,255,.65);

  border-radius: 28px;

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


.lep-login-card::before {
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
   CARD ICON
========================================================= */

.lep-login-card-icon {
  width: 57px;
  height: 57px;

  display: grid;

  place-items: center;

  margin-bottom: 17px;

  border-radius: 15px;

  background:
    linear-gradient(
      145deg,
      #1a365d,
      #2c5f8a
    );

  color: #ff9348;

  box-shadow:
    0 8px 0
    #142b47,
    0 15px 25px
    rgba(26,54,93,.13);
}


.lep-login-eyebrow {
  color: #ff6b00;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1.4px;
}


.lep-login-card h2 {
  margin-top: 7px;

  color: #1a365d;

  font-size:
    clamp(
      31px,
      4vw,
      42px
    );

  line-height: 1;

  letter-spacing: -1.5px;
}


.lep-login-card-description {
  max-width: 430px;

  margin-top: 10px;

  color: #718096;

  font-size: 10px;

  line-height: 1.7;
}


/* =========================================================
   ERROR
========================================================= */

.lep-login-error {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 18px;

  padding: 10px 11px;

  border:
    1px solid
    #f0cccc;

  border-radius: 9px;

  background: #fff5f5;

  color: #b42318;

  font-size: 9px;

  line-height: 1.5;
}


/* =========================================================
   FORM
========================================================= */

.lep-login-form {
  display: grid;

  gap: 17px;

  margin-top: 25px;
}


.lep-login-field label {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 7px;
}


.lep-login-field label span {
  color: #334155;

  font-size: 9px;

  font-weight: 900;
}


.lep-login-field label small {
  color: #94a3b8;

  font-size: 7px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: .5px;
}


.lep-login-input-wrap {
  display: flex;

  align-items: center;

  gap: 9px;

  min-height: 48px;

  padding: 0 12px;

  border:
    1px solid
    #dce5ec;

  border-radius: 10px;

  background:
    rgba(255,255,255,.88);

  color: #2c5f8a;

  box-shadow:
    inset 0 1px 0
    rgba(255,255,255,.8);

  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    transform .2s ease;
}


.lep-login-input-wrap:focus-within {
  border-color:
    #2c5f8a;

  box-shadow:
    0 0 0 4px
    rgba(44,95,138,.08);

  transform:
    translateY(-1px);
}


.lep-login-input-wrap input {
  flex: 1;

  width: 100%;

  min-width: 0;

  border: none;

  outline: none;

  background: transparent;

  color: #1e293b;

  font-family: inherit;

  font-size: 10px;
}


.lep-login-input-wrap input::placeholder {
  color: #a0aec0;
}


.lep-login-password-toggle {
  width: 30px;
  height: 30px;

  display: grid;

  place-items: center;

  flex-shrink: 0;

  border: none;

  border-radius: 7px;

  background: transparent;

  color: #718096;

  cursor: pointer;
}


.lep-login-password-toggle:hover {
  background: #eef4f8;

  color: #1a365d;
}


/* =========================================================
   SUBMIT
========================================================= */

.lep-login-submit {
  min-height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 4px;

  border: none;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #1a365d,
      #2c5f8a
    );

  color: #ffffff;

  font-family: inherit;

  font-size: 10px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 8px 0
    #142b47,
    0 15px 25px
    rgba(26,54,93,.13);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}


.lep-login-submit:hover:not(:disabled) {
  transform:
    translateY(-2px);

  box-shadow:
    0 10px 0
    #142b47,
    0 18px 30px
    rgba(26,54,93,.16);
}


.lep-login-submit:active:not(:disabled) {
  transform:
    translateY(5px);

  box-shadow:
    0 3px 0
    #142b47;
}


.lep-login-submit:disabled {
  opacity: .7;

  cursor: not-allowed;
}


.lep-login-spinner {
  width: 14px;
  height: 14px;

  border:
    2px solid
    rgba(255,255,255,.3);

  border-top-color:
    #ffffff;

  border-radius:
    50%;

  animation:
    lepLoginSpin
    .7s linear infinite;
}


@keyframes lepLoginSpin {

  to {
    transform:
      rotate(360deg);
  }

}


/* =========================================================
   REGISTER
========================================================= */

.lep-login-register {
  display: flex;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 21px;

  color: #718096;

  font-size: 9px;
}


.lep-login-register a {
  display: inline-flex;

  align-items: center;

  gap: 4px;

  color: #1a365d;

  text-decoration: none;

  font-weight: 900;
}


.lep-login-register a:hover {
  color: #ff6b00;
}


/* =========================================================
   PUBLIC BROWSING
========================================================= */

.lep-login-public-link {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  margin-top: 18px;

  padding-top: 17px;

  border-top:
    1px solid
    #edf1f4;

  color: #94a3b8;

  text-decoration: none;

  font-size: 8px;

  font-weight: 700;
}


.lep-login-public-link:hover {
  color: #2c5f8a;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

  .lep-login-page {
    padding:
      35px 16px
      50px;
  }


  .lep-login-container {
    grid-template-columns:
      1fr;

    max-width:
      620px;
  }


  .lep-login-welcome {
    min-height:
      auto;

    padding:
      35px;

    transform:
      none;
  }


  .lep-login-card {
    min-height:
      auto;

    padding:
      35px;

    transform:
      none;
  }


  .lep-login-welcome-footer {
    margin-top:
      30px;
  }

}


@media (max-width: 560px) {

  .lep-login-page {
    min-height:
      calc(100vh - 70px);

    padding:
      22px 12px
      40px;
  }


  .lep-login-welcome {
    padding:
      28px 22px;

    border-radius:
      20px;
  }


  .lep-login-card {
    padding:
      27px 21px;

    border-radius:
      20px;
  }


  .lep-login-card::before {
    border-radius:
      20px 20px 0 0;
  }


  .lep-login-welcome h1 {
    font-size:
      42px;
  }


  .lep-login-card h2 {
    font-size:
      34px;
  }


  .lep-login-brand {
    margin-bottom:
      30px;
  }


  .lep-login-features {
    gap:
      8px;
  }


  .lep-login-feature {
    padding:
      9px;
  }


  .lep-login-feature-icon {
    width:
      34px;

    height:
      34px;
  }

}

`;

export default Login;