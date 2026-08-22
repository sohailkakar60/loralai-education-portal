
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function TutorDetails() {
  const { id } = useParams();

  const [tutor, setTutor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD TUTOR
  // =========================================================

  useEffect(() => {
    const loadTutor = async () => {
      try {
        setLoading(true);
        setError("");


        if (!id) {
          throw new Error(
            "Tutor ID is missing."
          );
        }


        const response =
          await fetch(
            `${API_URL}/api/tutors/public/${id}`
          );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load tutor."
          );
        }


        const loadedTutor =
          data.data?.tutor;


        if (!loadedTutor) {
          throw new Error(
            "Tutor data was not returned."
          );
        }


        setTutor(
          loadedTutor
        );

      } catch (err) {

        console.error(
          "Load tutor error:",
          err
        );


        setError(
          err.message ||
            "Failed to load tutor."
        );

        setTutor(null);

      } finally {

        setLoading(false);

      }
    };


    loadTutor();

  }, [id]);


  // =========================================================
  // HELPERS
  // =========================================================

  const formatValue = (
    value,
    fallback = "Not listed"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return fallback;
    }

    return value;
  };


  const formatStatus = (
    value
  ) => {

    return (
      value ||
      "available"
    )
      .replaceAll(
        "_",
        " "
      )
      .replace(
        /^\w/,
        (letter) =>
          letter.toUpperCase()
      );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-tutor-details">

          <div className="lep-tutor-details-container">

            <div className="lep-tutor-details-state">

              <div className="lep-tutor-details-state-icon">

                <SmartIcon
                  name="tutor"
                  size={28}
                />

              </div>


              <span className="lep-tutor-details-eyebrow">
                LORALAI EDUCATION PORTAL
              </span>


              <h1>
                Loading Tutor...
              </h1>


              <p>
                Please wait while we load
                the tutor profile.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (
    error ||
    !tutor
  ) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-tutor-details">

          <div className="lep-tutor-details-container">

            <div className="lep-tutor-details-state error">

              <div className="lep-tutor-details-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-tutor-details-eyebrow">
                LORALAI EDUCATION PORTAL
              </span>


              <h1>
                Tutor Not Found
              </h1>


              <p>
                {error ||
                  "The requested tutor could not be found."}
              </p>


              <Link
                to="/tutors"
                className="lep-tutor-details-back-button"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Back to Tutors

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  const photo =
    tutor.profile_photo_url;


  const availability =
    tutor.availability ||
    "available";


  const locationParts =
    [
      tutor.area,
      tutor.city,
      tutor.district,
    ].filter(Boolean);


  return (
    <>
      <style>{styles}</style>


      <main className="lep-tutor-details">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="lep-tutor-profile-hero">

          <div className="lep-tutor-details-container">

            <Link
              to="/tutors"
              className="lep-tutor-profile-back"
            >

              <SmartIcon
                name="arrow-left"
                size={13}
              />

              Back to Tutors

            </Link>


            <div className="lep-tutor-profile-hero-grid">


              {/* PROFILE PHOTO */}

              <div className="lep-tutor-profile-avatar">

                {photo ? (

                  <img
                    src={
                      photo.startsWith(
                        "http"
                      )
                        ? photo
                        : `${API_URL}${photo}`
                    }
                    alt={
                      tutor.full_name
                    }
                  />

                ) : (

                  <SmartIcon
                    name="tutor"
                    size={48}
                  />

                )}

              </div>


              {/* HEADING */}

              <div className="lep-tutor-profile-heading">

                <div className="lep-tutor-profile-badges">

                  <span className="lep-tutor-verified">

                    <SmartIcon
                      name="verified"
                      size={11}
                    />

                    Verified Tutor

                  </span>


                  <span
                    className={
                      `lep-tutor-status ${availability}`
                    }
                  >

                    <span className="lep-tutor-status-dot" />

                    {formatStatus(
                      availability
                    )}

                  </span>

                </div>


                <h1>
                  {
                    tutor.full_name
                  }
                </h1>


                <p className="lep-tutor-profile-qualification">

                  <SmartIcon
                    name="document"
                    size={13}
                  />

                  {formatValue(
                    tutor.qualification,
                    "Qualification not listed"
                  )}

                </p>


                <p className="lep-tutor-profile-location">

                  <SmartIcon
                    name="location"
                    size={13}
                  />

                  {locationParts.length
                    ? locationParts.join(
                        ", "
                      )
                    : "Loralai"}

                </p>

              </div>


              {/* HERO FEE */}

              <div className="lep-tutor-profile-fee-card">

                <span>
                  HOURLY FEE
                </span>


                <strong>

                  {tutor.hourly_fee !==
                  null &&
                  tutor.hourly_fee !==
                    undefined
                    ? `Rs. ${Number(
                        tutor.hourly_fee
                      ).toLocaleString()}`
                    : "Not listed"}

                </strong>


                {tutor.hourly_fee !==
                  null &&
                  tutor.hourly_fee !==
                    undefined && (

                    <small>
                      per hour
                    </small>

                  )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="lep-tutor-profile-content">

          <div className="lep-tutor-details-container">


            <div className="lep-tutor-profile-layout">


              {/* =================================================
                  MAIN CONTENT
              ================================================= */}

              <div className="lep-tutor-main">


                {/* ABOUT */}

                <section className="lep-tutor-detail-card">

                  <div className="lep-tutor-detail-heading">

                    <div className="lep-tutor-detail-icon">

                      <SmartIcon
                        name="tutor"
                        size={19}
                      />

                    </div>


                    <div>

                      <span>
                        PROFILE
                      </span>

                      <h2>
                        About the Tutor
                      </h2>

                    </div>

                  </div>


                  <p className="lep-tutor-about">

                    {formatValue(
                      tutor.description,
                      "No profile description has been added yet."
                    )}

                  </p>

                </section>


                {/* ACADEMIC BACKGROUND */}

                <section className="lep-tutor-detail-card">

                  <div className="lep-tutor-detail-heading">

                    <div className="lep-tutor-detail-icon">

                      <SmartIcon
                        name="programs"
                        size={19}
                      />

                    </div>


                    <div>

                      <span>
                        QUALIFICATION
                      </span>

                      <h2>
                        Academic Background
                      </h2>

                    </div>

                  </div>


                  <div className="lep-tutor-info-grid">


                    <div className="lep-tutor-info-box">

                      <span>
                        Qualification
                      </span>


                      <strong>
                        {
                          formatValue(
                            tutor.qualification
                          )
                        }
                      </strong>

                    </div>


                    <div className="lep-tutor-info-box">

                      <span>
                        Specialization
                      </span>


                      <strong>
                        {
                          formatValue(
                            tutor.specialization
                          )
                        }
                      </strong>

                    </div>


                    <div className="lep-tutor-info-box">

                      <span>
                        Experience
                      </span>


                      <strong>
                        {
                          tutor.experience_years ??
                          0
                        }{" "}
                        Years
                      </strong>

                    </div>


                    <div className="lep-tutor-info-box">

                      <span>
                        Gender
                      </span>


                      <strong>

                        {formatStatus(
                          tutor.gender ||
                            "not_specified"
                        )}

                      </strong>

                    </div>

                  </div>

                </section>


                {/* SUBJECTS */}

                <section className="lep-tutor-detail-card">

                  <div className="lep-tutor-detail-heading">

                    <div className="lep-tutor-detail-icon">

                      <SmartIcon
                        name="programs"
                        size={19}
                      />

                    </div>


                    <div>

                      <span>
                        SUBJECTS
                      </span>

                      <h2>
                        Subjects Taught
                      </h2>

                    </div>

                  </div>


                  <div className="lep-tutor-subject-box">

                    <SmartIcon
                      name="teacher"
                      size={17}
                    />


                    <span>

                      {
                        formatValue(
                          tutor.subjects,
                          "Subjects not listed"
                        )
                      }

                    </span>

                  </div>

                </section>


                {/* LOCATION */}

                <section className="lep-tutor-detail-card">

                  <div className="lep-tutor-detail-heading">

                    <div className="lep-tutor-detail-icon">

                      <SmartIcon
                        name="location"
                        size={19}
                      />

                    </div>


                    <div>

                      <span>
                        LOCATION
                      </span>

                      <h2>
                        Teaching Area
                      </h2>

                    </div>

                  </div>


                  <div className="lep-tutor-location-box">

                    <SmartIcon
                      name="location"
                      size={19}
                    />


                    <div>

                      <strong>

                        {
                          locationParts.length
                            ? locationParts.join(
                                ", "
                              )
                            : "Loralai"
                        }

                      </strong>


                      <span>
                        Teaching area
                      </span>

                    </div>

                  </div>

                </section>

              </div>


              {/* =================================================
                  SIDEBAR
              ================================================= */}

              <aside className="lep-tutor-sidebar">


                {/* AVAILABILITY */}

                <div className="lep-tutor-side-card">

                  <span className="lep-tutor-side-label">
                    AVAILABILITY
                  </span>


                  <div
                    className={
                      `lep-tutor-side-status ${availability}`
                    }
                  >

                    <span />

                    {formatStatus(
                      availability
                    )}

                  </div>

                </div>


                {/* EXPERIENCE */}

                <div className="lep-tutor-side-card">

                  <span className="lep-tutor-side-label">
                    EXPERIENCE
                  </span>


                  <strong className="lep-tutor-side-big">

                    {tutor.experience_years ??
                      0}

                  </strong>


                  <span className="lep-tutor-side-note">
                    Years teaching experience
                  </span>

                </div>


                {/* FEE */}

                {tutor.hourly_fee !==
                  null &&
                  tutor.hourly_fee !==
                    undefined && (

                    <div className="lep-tutor-side-card">

                      <span className="lep-tutor-side-label">
                        HOURLY RATE
                      </span>


                      <strong className="lep-tutor-side-fee">

                        Rs.{" "}
                        {Number(
                          tutor.hourly_fee
                        ).toLocaleString()}

                      </strong>


                      <span className="lep-tutor-side-note">
                        Per hour
                      </span>

                    </div>

                  )}


                {/* CONTACT */}

                <div className="lep-tutor-contact-card">

                  <div className="lep-tutor-contact-icon">

                    <SmartIcon
                      name="phone"
                      size={20}
                    />

                  </div>


                  <span className="lep-tutor-side-label">
                    CONTACT
                  </span>


                  <h3>
                    Get in Touch
                  </h3>


                  <p>
                    Contact details provided by
                    this tutor are shown below.
                  </p>


                  {tutor.phone && (

                    <a
                      href={`tel:${tutor.phone}`}
                      className="lep-tutor-contact-btn"
                    >

                      <SmartIcon
                        name="phone"
                        size={13}
                      />

                      Call Tutor

                    </a>

                  )}


                  {tutor.email && (

                    <a
                      href={`mailto:${tutor.email}`}
                      className="lep-tutor-contact-btn secondary"
                    >

                      <SmartIcon
                        name="mail"
                        size={13}
                      />

                      Send Email

                    </a>

                  )}


                  {!tutor.phone &&
                    !tutor.email && (

                      <div className="lep-tutor-no-contact">

                        <SmartIcon
                          name="warning"
                          size={13}
                        />

                        No public contact
                        information available.

                      </div>

                    )}

                </div>

              </aside>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

  .lep-tutor-details {
    min-height: 100vh;

    background:
      linear-gradient(
        180deg,
        #f5f8fb,
        #edf3f8
      );
  }


  .lep-tutor-details-container {
    width:
      min(
        1160px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* =======================================================
     HERO
  ======================================================= */

  .lep-tutor-profile-hero {
    position:
      relative;

    overflow:
      hidden;

    padding:
      28px 0 42px;

    background:
      radial-gradient(
        circle at 90% 10%,
        rgba(255,107,0,.15),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #142f4f,
        #275a86
      );

    color:
      #ffffff;
  }


  .lep-tutor-profile-hero::before {
    content:
      "";

    position:
      absolute;

    width:
      400px;

    height:
      400px;

    right:
      -160px;

    bottom:
      -250px;

    border-radius:
      50%;

    background:
      rgba(255,255,255,.05);
  }


  .lep-tutor-profile-back {
    position:
      relative;

    z-index:
      1;

    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #d5e2ed;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      800;
  }


  .lep-tutor-profile-back:hover {
    color:
      #ff9348;
  }


  .lep-tutor-profile-hero-grid {
    position:
      relative;

    z-index:
      1;

    display:
      grid;

    grid-template-columns:
      115px
      minmax(0,1fr)
      200px;

    gap:
      21px;

    align-items:
      center;

    margin-top:
      26px;
  }


  .lep-tutor-profile-avatar {
    width:
      115px;

    height:
      115px;

    display:
      grid;

    place-items:
      center;

    overflow:
      hidden;

    border:
      4px solid
      rgba(255,255,255,.25);

    border-radius:
      24px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 13px 0
      rgba(11,36,60,.65),
      0 25px 40px
      rgba(0,0,0,.17);

    transform:
      perspective(800px)
      rotateY(-4deg);
  }


  .lep-tutor-profile-avatar img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-tutor-profile-badges {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-tutor-verified,
  .lep-tutor-status {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    padding:
      6px 8px;

    border-radius:
      6px;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-tutor-verified {
    background:
      rgba(234,247,238,.95);

    color:
      #16803c;
  }


  .lep-tutor-status {
    background:
      rgba(255,255,255,.11);

    color:
      #d8e5ef;
  }


  .lep-tutor-status.available {
    color:
      #8ee6ac;
  }


  .lep-tutor-status.busy {
    color:
      #ffc37e;
  }


  .lep-tutor-status.not_available {
    color:
      #ffaaa4;
  }


  .lep-tutor-status-dot,
  .lep-tutor-side-status span {
    width:
      6px;

    height:
      6px;

    border-radius:
      50%;

    background:
      currentColor;
  }


  .lep-tutor-profile-heading h1 {
    margin-top:
      10px;

    color:
      #ffffff;

    font-size:
      clamp(
        34px,
        5vw,
        48px
      );

    line-height:
      1;

    letter-spacing:
      -1.5px;
  }


  .lep-tutor-profile-qualification,
  .lep-tutor-profile-location {
    display:
      flex;

    align-items:
      center;

    gap:
      6px;

    margin-top:
      8px;

    font-size:
      10px;
  }


  .lep-tutor-profile-qualification {
    color:
      #c7d8e7;
  }


  .lep-tutor-profile-location {
    color:
      #9fb5c8;
  }


  .lep-tutor-profile-fee-card {
    padding:
      17px;

    border:
      1px solid
      rgba(255,255,255,.15);

    border-radius:
      14px;

    background:
      rgba(255,255,255,.08);

    box-shadow:
      0 20px 35px
      rgba(0,0,0,.12);

    backdrop-filter:
      blur(10px);
  }


  .lep-tutor-profile-fee-card span {
    display:
      block;

    color:
      #ffb06e;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-tutor-profile-fee-card strong {
    display:
      block;

    margin-top:
      6px;

    color:
      #ffffff;

    font-size:
      19px;
  }


  .lep-tutor-profile-fee-card small {
    color:
      #afc3d4;

    font-size:
      8px;
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  .lep-tutor-profile-content {
    padding:
      28px 0 80px;
  }


  .lep-tutor-profile-layout {
    display:
      grid;

    grid-template-columns:
      minmax(0,1fr)
      300px;

    gap:
      17px;

    align-items:
      start;
  }


  .lep-tutor-main {
    display:
      grid;

    gap:
      14px;
  }


  .lep-tutor-detail-card {
    padding:
      23px;

    background:
      #ffffff;

    border:
      1px solid
      #e0e7ee;

    border-radius:
      16px;

    box-shadow:
      0 11px 28px
      rgba(26,54,93,.055);
  }


  .lep-tutor-detail-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      11px;

    margin-bottom:
      17px;
  }


  .lep-tutor-detail-icon {
    width:
      42px;

    height:
      42px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      10px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 6px 0
      #142b47;
  }


  .lep-tutor-detail-heading span {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-tutor-detail-heading h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-tutor-about {
    color:
      #5d6d7e;

    font-size:
      11px;

    line-height:
      1.8;
  }


  .lep-tutor-info-grid {
    display:
      grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap:
      10px;
  }


  .lep-tutor-info-box {
    padding:
      12px;

    border:
      1px solid
      #e5ebf0;

    border-radius:
      10px;

    background:
      #f9fbfd;
  }


  .lep-tutor-info-box span {
    display:
      block;

    color:
      #94a3b8;

    font-size:
      8px;

    font-weight:
      800;
  }


  .lep-tutor-info-box strong {
    display:
      block;

    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      10px;
  }


  .lep-tutor-subject-box {
    display:
      flex;

    align-items:
      center;

    gap:
      9px;

    min-height:
      54px;

    padding:
      12px;

    border:
      1px solid
      #dfe7ee;

    border-radius:
      10px;

    background:
      linear-gradient(
        145deg,
        #f8fbfd,
        #eef4f8
      );

    color:
      #2c5f8a;

    font-size:
      10px;

    font-weight:
      800;
  }


  .lep-tutor-location-box {
    display:
      flex;

    align-items:
      center;

    gap:
      11px;

    padding:
      14px;

    border-radius:
      11px;

    background:
      #f8fafc;

    border:
      1px solid
      #e2e8ef;

    color:
      #2c5f8a;
  }


  .lep-tutor-location-box strong {
    display:
      block;

    color:
      #1a365d;

    font-size:
      10px;
  }


  .lep-tutor-location-box span {
    display:
      block;

    margin-top:
      3px;

    color:
      #94a3b8;

    font-size:
      8px;
  }


  /* =======================================================
     SIDEBAR
  ======================================================= */

  .lep-tutor-sidebar {
    display:
      grid;

    gap:
      12px;

    position:
      sticky;

    top:
      90px;
  }


  .lep-tutor-side-card,
  .lep-tutor-contact-card {
    padding:
      19px;

    border:
      1px solid
      #e0e7ee;

    border-radius:
      14px;

    background:
      #ffffff;

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.055);
  }


  .lep-tutor-side-label {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-tutor-side-status {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      7px;

    margin-top:
      8px;

    color:
      #16803c;

    font-size:
      12px;

    font-weight:
      900;
  }


  .lep-tutor-side-status.busy {
    color:
      #b25c00;
  }


  .lep-tutor-side-status.not_available {
    color:
      #b42318;
  }


  .lep-tutor-side-big {
    display:
      block;

    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      30px;
  }


  .lep-tutor-side-note {
    display:
      block;

    margin-top:
      2px;

    color:
      #94a3b8;

    font-size:
      8px;
  }


  .lep-tutor-side-fee {
    display:
      block;

    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      23px;
  }


  .lep-tutor-contact-card {
    overflow:
      hidden;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #275a86
      );

    color:
      #ffffff;

    border:
      none;
  }


  .lep-tutor-contact-icon {
    width:
      45px;

    height:
      45px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      11px;

    background:
      #ff6b00;

    color:
      #ffffff;

    box-shadow:
      0 6px 0
      #b84b00;
  }


  .lep-tutor-contact-card .lep-tutor-side-label {
    margin-top:
      16px;

    color:
      #ffb06e;
  }


  .lep-tutor-contact-card h3 {
    margin-top:
      5px;

    font-size:
      19px;
  }


  .lep-tutor-contact-card p {
    margin-top:
      6px;

    color:
      #c8d8e6;

    font-size:
      9px;

    line-height:
      1.6;
  }


  .lep-tutor-contact-btn {
    min-height:
      39px;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    margin-top:
      10px;

    border-radius:
      8px;

    background:
      #ffffff;

    color:
      #1a365d;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      900;
  }


  .lep-tutor-contact-btn.secondary {
    background:
      rgba(255,255,255,.10);

    border:
      1px solid
      rgba(255,255,255,.15);

    color:
      #ffffff;
  }


  .lep-tutor-no-contact {
    display:
      flex;

    align-items:
      center;

    gap:
      6px;

    margin-top:
      11px;

    padding:
      9px;

    border-radius:
      8px;

    background:
      rgba(255,255,255,.07);

    color:
      #c8d8e6;

    font-size:
      8px;
  }


  /* =======================================================
     STATE
  ======================================================= */

  .lep-tutor-details-state {
    min-height:
      420px;

    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    justify-content:
      center;

    padding:
      35px;

    text-align:
      center;
  }


  .lep-tutor-details-state-icon {
    width:
      65px;

    height:
      65px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      14px;

    border-radius:
      16px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 9px 0
      #142b47;
  }


  .lep-tutor-details-state.error
    .lep-tutor-details-state-icon {
    background:
      linear-gradient(
        145deg,
        #6b2430,
        #a83343
      );

    color:
      #ffb5bd;

    box-shadow:
      0 9px 0
      #501b23;
  }


  .lep-tutor-details-eyebrow {
    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.3px;
  }


  .lep-tutor-details-state h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      28px;
  }


  .lep-tutor-details-state p {
    max-width:
      500px;

    margin-top:
      8px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.7;
  }


  .lep-tutor-details-back-button {
    min-height:
      40px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    margin-top:
      17px;

    padding:
      0 14px;

    border-radius:
      9px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      900;

    box-shadow:
      0 7px 0
      #142b47;
  }


  /* =======================================================
     RESPONSIVE
  ======================================================= */

  @media (max-width: 900px) {

    .lep-tutor-profile-hero-grid {
      grid-template-columns:
        90px
        minmax(0,1fr);
    }


    .lep-tutor-profile-avatar {
      width:
        90px;

      height:
        90px;
    }


    .lep-tutor-profile-fee-card {
      grid-column:
        1 / -1;
      max-width:
        240px;
    }


    .lep-tutor-profile-layout {
      grid-template-columns:
        1fr;
    }


    .lep-tutor-sidebar {
      position:
        static;

      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }


    .lep-tutor-contact-card {
      grid-column:
        1 / -1;
    }

  }


  @media (max-width: 620px) {

    .lep-tutor-details-container {
      width:
        calc(100% - 24px);
    }


    .lep-tutor-profile-hero {
      padding:
        22px 0 34px;
    }


    .lep-tutor-profile-hero-grid {
      grid-template-columns:
        1fr;
    }


    .lep-tutor-profile-avatar {
      width:
        90px;

      height:
        90px;
    }


    .lep-tutor-profile-heading h1 {
      font-size:
        35px;
    }


    .lep-tutor-profile-fee-card {
      max-width:
        none;
    }


    .lep-tutor-profile-content {
      padding:
        17px 0 60px;
    }


    .lep-tutor-detail-card {
      padding:
        18px;
    }


    .lep-tutor-info-grid {
      grid-template-columns:
        1fr;
    }


    .lep-tutor-sidebar {
      grid-template-columns:
        1fr;
    }


    .lep-tutor-contact-card {
      grid-column:
        auto;
    }

  }

`;

export default TutorDetails;
