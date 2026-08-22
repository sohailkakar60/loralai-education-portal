
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReviewsSection from "../components/ReviewsSection";
import ReviewForm from "../components/ReviewForm";
import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


const TYPE_CONFIG = {
  school: {
    title: "School",
    back: "/schools",
    backText: "Back to Schools",
    icon: "school",
  },

  college: {
    title: "College",
    back: "/colleges",
    backText: "Back to Colleges",
    icon: "college",
  },

  university: {
    title: "University",
    back: "/universities",
    backText: "Back to Universities",
    icon: "university",
  },

  academy: {
    title: "Academy",
    back: "/academies",
    backText: "Back to Academies",
    icon: "academy",
  },
};


const detailStyles = `
  .lep-details {
    min-height: 100vh;
    background:
      linear-gradient(
        180deg,
        #f7f9fc 0%,
        #eef3f8 100%
      );
    color: #2d3748;
    padding-bottom: 80px;
  }

  .lep-details *,
  .lep-details *::before,
  .lep-details *::after {
    box-sizing: border-box;
  }

  .lep-detail-container {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
  }


  /* =====================================================
     HERO
  ===================================================== */

  .lep-detail-hero {
    position: relative;
    overflow: hidden;

    padding: 38px 0 115px;

    background:
      radial-gradient(
        circle at 85% 20%,
        rgba(44,95,138,.18),
        transparent 28%
      ),
      radial-gradient(
        circle at 8% 90%,
        rgba(255,107,0,.08),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #eaf2f8,
        #ffffff
      );
  }

  .lep-detail-orbit {
    position: absolute;

    border-radius: 50%;

    border:
      1px solid
      rgba(26,54,93,.10);

    pointer-events: none;
  }

  .lep-detail-orbit.one {
    width: 520px;
    height: 520px;

    right: -210px;
    top: -300px;

    transform:
      rotateX(62deg)
      rotateZ(20deg);
  }

  .lep-detail-orbit.two {
    width: 300px;
    height: 300px;

    left: -150px;
    bottom: -220px;

    border-color:
      rgba(255,107,0,.10);

    transform:
      rotateX(60deg);
  }

  .lep-detail-back {
    display: inline-flex;

    align-items: center;

    gap: 7px;

    color: #2c5f8a;

    text-decoration: none;

    font-size: 11px;

    font-weight: 800;

    transition:
      color .2s ease,
      transform .2s ease;
  }

  .lep-detail-back:hover {
    color: #ff6b00;
    transform: translateX(-2px);
  }

  .lep-detail-heading {
    position: relative;
    z-index: 2;

    display: grid;

    grid-template-columns:
      95px
      1fr;

    gap: 22px;

    align-items: center;

    margin-top: 30px;
  }

  .lep-detail-logo {
    width: 95px;
    height: 95px;

    display: grid;
    place-items: center;

    overflow: hidden;

    border-radius: 22px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff914b;

    font-size: 37px;

    font-weight: 900;

    box-shadow:
      0 22px 42px
      rgba(26,54,93,.22);

    transform:
      perspective(800px)
      rotateY(-5deg);

    transition:
      transform .35s ease,
      box-shadow .35s ease;
  }

  .lep-detail-logo:hover {
    transform:
      perspective(800px)
      rotateY(0)
      translateY(-4px);

    box-shadow:
      0 28px 50px
      rgba(26,54,93,.25);
  }

  .lep-detail-logo img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    display: block;
  }

  .lep-verified {
    display: inline-flex;

    align-items: center;

    gap: 5px;

    padding: 6px 9px;

    border-radius: 7px;

    background:
      rgba(22,128,60,.09);

    color:
      #16803c;

    font-size: 9px;

    font-weight: 900;
  }

  .lep-detail-title {
    margin-top: 9px;

    color: #1a365d;

    font-size:
      clamp(
        32px,
        4vw,
        52px
      );

    line-height: 1.05;

    letter-spacing: -1.7px;
  }

  .lep-detail-location {
    display: flex;

    align-items: center;

    gap: 7px;

    margin-top: 10px;

    color: #64748b;

    font-size: 12px;
  }

  .lep-detail-location > svg {
    color: #ff6b00;
    flex-shrink: 0;
  }


  /* =====================================================
     QUICK STATS
  ===================================================== */

  .lep-quick-stats-wrap {
    position: relative;

    z-index: 10;

    margin-top: -65px;
  }

  .lep-quick-stats {
    display: grid;

    grid-template-columns:
      repeat(4, 1fr);

    gap: 1px;

    overflow: hidden;

    background: #dce5ed;

    border:
      1px solid #dce5ed;

    border-radius: 15px;

    box-shadow:
      0 25px 55px
      rgba(26,54,93,.11);
  }

  .lep-quick-stat {
    min-height: 92px;

    display: flex;

    flex-direction: column;

    justify-content: center;

    padding: 17px 20px;

    background: #ffffff;

    transition:
      background .25s ease;
  }

  .lep-quick-stat:hover {
    background: #f8fbfd;
  }

  .lep-quick-stat span {
    color: #94a3b8;

    font-size: 8px;

    font-weight: 900;

    letter-spacing: 1px;
  }

  .lep-quick-stat strong {
    display: flex;

    align-items: center;

    gap: 6px;

    margin-top: 5px;

    color: #1a365d;

    font-size: 22px;
  }

  .lep-quick-stat strong svg {
    color: #ff6b00;
  }


  /* =====================================================
     CONTENT LAYOUT
  ===================================================== */

  .lep-details-content {
    padding-top: 55px;
  }

  .lep-details-layout {
    display: grid;

    grid-template-columns:
      minmax(0, 1fr)
      310px;

    gap: 22px;

    align-items: start;
  }

  .lep-details-main {
    min-width: 0;
  }


  /* =====================================================
     CONTENT CARDS
  ===================================================== */

  .lep-detail-card {
    margin-bottom: 18px;

    padding: 25px;

    background: #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius: 15px;

    box-shadow:
      0 9px 25px
      rgba(26,54,93,.045);

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }

  .lep-detail-card:hover {
    border-color:
      rgba(44,95,138,.18);

    box-shadow:
      0 15px 32px
      rgba(26,54,93,.07);
  }

  .lep-detail-label {
    color: #ff6b00;

    font-size: 9px;

    font-weight: 900;

    letter-spacing: 1.4px;
  }

  .lep-section-title-with-icon {
    display: flex;

    align-items: center;

    gap: 10px;

    margin-top: 8px;
  }

  .lep-section-icon {
    width: 39px;
    height: 39px;

    display: grid;

    place-items: center;

    flex-shrink: 0;

    border-radius: 10px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff6b00;

    box-shadow:
      0 9px 18px
      rgba(26,54,93,.14);

    transform:
      perspective(600px)
      rotateX(4deg);

    transition:
      transform .25s ease,
      box-shadow .25s ease;
  }

  .lep-detail-card:hover
  .lep-section-icon {
    transform:
      perspective(600px)
      rotateX(0)
      translateY(-2px);

    box-shadow:
      0 12px 24px
      rgba(26,54,93,.18);
  }

  .lep-section-title-with-icon h2 {
    margin: 0;

    color: #1a365d;

    font-size: 24px;

    letter-spacing: -.5px;
  }

  .lep-detail-card > p {
    margin-top: 14px;

    color: #718096;

    font-size: 12px;

    line-height: 1.8;
  }


  /* =====================================================
     OVERVIEW
  ===================================================== */

  .lep-info-grid {
    display: grid;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;

    margin-top: 20px;
  }

  .lep-info-item {
    padding: 14px;

    border:
      1px solid #edf1f5;

    border-radius: 10px;

    background:
      #f8fafc;

    transition:
      transform .2s ease,
      border-color .2s ease;
  }

  .lep-info-item:hover {
    transform:
      translateY(-2px);

    border-color:
      rgba(44,95,138,.20);
  }

  .lep-info-item span {
    display: block;

    color: #94a3b8;

    font-size: 9px;

    font-weight: 800;
  }

  .lep-info-item strong {
    display: block;

    margin-top: 5px;

    color: #2d3748;

    font-size: 12px;

    line-height: 1.35;
  }


  /* =====================================================
     PROGRAM LIST
  ===================================================== */

  .lep-detail-list {
    display: grid;

    gap: 8px;

    margin-top: 20px;
  }

  .lep-detail-list-item {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    padding: 14px;

    border:
      1px solid #edf1f5;

    border-radius: 10px;

    background:
      #fbfdff;

    transition:
      transform .2s ease,
      box-shadow .2s ease,
      border-color .2s ease;
  }

  .lep-detail-list-item:hover {
    transform:
      translateX(3px);

    border-color:
      rgba(44,95,138,.20);

    box-shadow:
      0 8px 18px
      rgba(26,54,93,.05);
  }

  .lep-detail-list-item strong {
    color: #1a365d;

    font-size: 12px;
  }

  .lep-detail-list-item span {
    display: block;

    margin-top: 3px;

    color: #718096;

    font-size: 9px;
  }


  /* =====================================================
     TEACHERS
  ===================================================== */

  .lep-teacher-grid {
    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 10px;

    margin-top: 20px;
  }

  .lep-teacher-card {
    padding: 16px;

    text-align: center;

    border:
      1px solid #e2e8f0;

    border-radius: 12px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f3f7fa
      );

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }

  .lep-teacher-card:hover {
    transform:
      translateY(-5px);

    box-shadow:
      0 16px 30px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }

  .lep-teacher-avatar {
    width: 58px;
    height: 58px;

    margin:
      0 auto 9px;

    overflow: hidden;

    display: grid;

    place-items: center;

    border-radius: 50%;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9349;

    font-size: 20px;

    font-weight: 900;

    box-shadow:
      0 9px 20px
      rgba(26,54,93,.15);
  }

  .lep-teacher-avatar img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;
  }

  .lep-teacher-card h3 {
    color: #1a365d;

    font-size: 12px;
  }

  .lep-teacher-card p {
    margin-top: 4px;

    color: #718096;

    font-size: 9px;
  }

  .lep-teacher-card span {
    display: inline-flex;

    align-items: center;

    gap: 4px;

    margin-top: 6px;

    color: #2c5f8a;

    font-size: 9px;

    font-weight: 800;
  }


  /* =====================================================
     FACILITIES
  ===================================================== */

  .lep-facility-grid {
    display: grid;

    grid-template-columns:
      repeat(2, 1fr);

    gap: 8px;

    margin-top: 20px;
  }

  .lep-facility {
    display: flex;

    align-items: center;

    gap: 7px;

    padding: 12px 13px;

    border:
      1px solid #edf1f5;

    border-radius: 9px;

    background:
      #fbfdff;

    color: #425466;

    font-size: 10px;

    font-weight: 700;

    transition:
      transform .2s ease,
      border-color .2s ease;
  }

  .lep-facility:hover {
    transform:
      translateY(-2px);

    border-color:
      rgba(44,95,138,.20);
  }

  .lep-facility svg {
    flex-shrink: 0;

    color: #16a34a;
  }


  /* =====================================================
     ADMISSIONS
  ===================================================== */

  .lep-admission-list {
    display: grid;

    gap: 10px;

    margin-top: 20px;
  }

  .lep-admission-card {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 15px;

    padding: 15px;

    border:
      1px solid #edf1f5;

    border-radius: 10px;

    background:
      #fbfdff;
  }

  .lep-admission-card strong {
    color: #1a365d;

    font-size: 12px;
  }

  .lep-admission-card p {
    margin-top: 5px;

    color: #718096;

    font-size: 10px;

    line-height: 1.5;
  }

  .lep-admission-status {
    flex-shrink: 0;

    padding: 6px 9px;

    border-radius: 6px;

    background: #eaf7ee;

    color: #16803c;

    font-size: 8px;

    font-weight: 900;

    text-transform: uppercase;
  }


  /* =====================================================
     SIDEBAR
  ===================================================== */

  .lep-sidebar {
    position: sticky;

    top: 95px;
  }

  .lep-side-card {
    margin-bottom: 15px;

    padding: 20px;

    background:
      #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius: 14px;

    box-shadow:
      0 9px 25px
      rgba(26,54,93,.05);

    transition:
      transform .25s ease,
      box-shadow .25s ease;
  }

  .lep-side-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 14px 30px
      rgba(26,54,93,.08);
  }

  .lep-side-title {
    display: flex;

    align-items: center;

    gap: 9px;

    margin-top: 7px;

    color: #1a365d;
  }

  .lep-side-title h3 {
    margin: 0;

    font-size: 18px;
  }

  .lep-side-title svg {
    color: #ff6b00;
  }

  .lep-side-card > p {
    margin-top: 9px;

    color: #718096;

    font-size: 11px;

    line-height: 1.65;
  }

  .lep-map-link {
    display: inline-flex;

    align-items: center;

    gap: 5px;

    margin-top: 13px;

    color: #2c5f8a;

    text-decoration: none;

    font-size: 10px;

    font-weight: 900;
  }

  .lep-map-link:hover {
    color: #ff6b00;
  }

  .lep-contact-item {
    padding: 11px 0;

    border-bottom:
      1px solid #edf1f5;
  }

  .lep-contact-item:last-child {
    border-bottom: none;
  }

  .lep-contact-label {
    display: flex;

    align-items: center;

    gap: 6px;

    color: #94a3b8;

    font-size: 8px;

    font-weight: 900;

    text-transform: uppercase;
  }

  .lep-contact-label svg {
    color: #2c5f8a;
  }

  .lep-contact-item strong {
    display: block;

    margin-top: 4px;

    color: #2d3748;

    font-size: 11px;

    word-break: break-word;
  }


  /* =====================================================
     STATE
  ===================================================== */

  .lep-detail-state {
    min-height: 420px;

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    text-align: center;

    padding: 40px;

    background: #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius: 16px;

    box-shadow:
      0 14px 30px
      rgba(26,54,93,.05);
  }

  .lep-detail-state-icon {
    width: 58px;
    height: 58px;

    display: grid;

    place-items: center;

    margin-bottom: 14px;

    border-radius: 14px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9349;

    font-size: 20px;

    font-weight: 900;
  }

  .lep-detail-state h1 {
    color: #1a365d;

    font-size: 25px;
  }

  .lep-detail-state p {
    max-width: 500px;

    margin-top: 8px;

    color: #718096;

    font-size: 12px;

    line-height: 1.6;
  }

  .lep-detail-state a {
    margin-top: 18px;
  }


  /* =====================================================
     RESPONSIVE
  ===================================================== */

  @media (max-width: 950px) {

    .lep-details-layout {
      grid-template-columns: 1fr;
    }

    .lep-sidebar {
      position: static;
    }

    .lep-quick-stats {
      grid-template-columns:
        repeat(2, 1fr);
    }
  }


  @media (max-width: 700px) {

    .lep-detail-heading {
      grid-template-columns:
        70px 1fr;

      gap: 15px;
    }

    .lep-detail-logo {
      width: 70px;
      height: 70px;

      border-radius: 17px;

      font-size: 28px;
    }

    .lep-detail-title {
      font-size: 34px;
    }

    .lep-info-grid {
      grid-template-columns: 1fr;
    }

    .lep-teacher-grid {
      grid-template-columns:
        repeat(2, 1fr);
    }

    .lep-facility-grid {
      grid-template-columns: 1fr;
    }
  }


  @media (max-width: 520px) {

    .lep-detail-hero {
      padding:
        35px 0 105px;
    }

    .lep-quick-stats {
      grid-template-columns: 1fr;
    }

    .lep-teacher-grid {
      grid-template-columns: 1fr;
    }

    .lep-detail-card,
    .lep-side-card {
      padding: 19px;
    }
  }
`;


function InstitutionDetails({ type }) {
  const { slug } = useParams();

  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG.school;

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD INSTITUTION
  // =========================================================

  useEffect(() => {
    const loadInstitution = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/public/institutions/${slug}`
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load institution."
          );
        }

        const institution =
          result.data?.institution;

        if (!institution) {
          throw new Error(
            "Institution information was not returned."
          );
        }

        setData(
          result.data
        );

      } catch (err) {

        console.error(
          "Institution details error:",
          err
        );

        setError(
          err.message ||
            "Failed to load institution."
        );

      } finally {

        setLoading(false);

      }
    };


    loadInstitution();

  }, [slug]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>
          {detailStyles}
        </style>

        <main className="lep-details">

          <div className="lep-detail-container">

            <div className="lep-detail-state">

              <div className="lep-detail-state-icon">

                <SmartIcon
                  name={config.icon}
                  size={23}
                />

              </div>


              <h1>
                Loading {config.title}...
              </h1>


              <p>
                Please wait while we load
                the institution information.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error || !data) {
    return (
      <>
        <style>
          {detailStyles}
        </style>

        <main className="lep-details">

          <div className="lep-detail-container">

            <div className="lep-detail-state">

              <div className="lep-detail-state-icon">

                <SmartIcon
                  name="search"
                  size={23}
                />

              </div>


              <h1>
                {config.title} Not Found
              </h1>


              <p>
                {error ||
                  `The requested ${config.title.toLowerCase()} could not be found.`}
              </p>


              <Link
                to={config.back}
                className="dashboard-primary-btn"
              >
                <SmartIcon
                  name="arrow-left"
                  size={15}
                />

                {" "}
                {config.backText}
              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  const {
    institution,
    programs = [],
    teachers = [],
    facilities = [],
    contacts = [],
    fees = [],
    admissions = [],
  } = data;


  return (
    <>
      <style>
        {detailStyles}
      </style>


      <main className="lep-details">


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="lep-detail-hero">

          <div className="lep-detail-orbit one" />
          <div className="lep-detail-orbit two" />


          <div className="lep-detail-container">

            <Link
              to={config.back}
              className="lep-detail-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              {config.backText}

            </Link>


            <div className="lep-detail-heading">


              {/* LOGO */}

              <div className="lep-detail-logo">

                {institution.logo_url ? (

                  <img
                    src={`${API_URL}${institution.logo_url}`}
                    alt={
                      institution.name
                    }
                  />

                ) : (

                  <SmartIcon
                    name={config.icon}
                    size={39}
                  />

                )}

              </div>


              {/* TITLE */}

              <div>

                <span className="lep-verified">

                  <SmartIcon
                    name="verified"
                    size={13}
                  />

                  Verified {config.title}

                </span>


                <h1 className="lep-detail-title">
                  {institution.name}
                </h1>


                <div className="lep-detail-location">

                  <SmartIcon
                    name="location"
                    size={15}
                  />

                  <span>

                    {institution.area
                      ? `${institution.area}, `
                      : ""}

                    {institution.city}

                    {institution.district
                      ? `, ${institution.district}`
                      : ""}

                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            QUICK STATS
        =================================================== */}

        <section className="lep-quick-stats-wrap">

          <div className="lep-detail-container">

            <div className="lep-quick-stats">


              {/* STUDENTS */}

              <div className="lep-quick-stat">

                <span>
                  STUDENTS
                </span>

                <strong>

                  <SmartIcon
                    name="students"
                    size={17}
                  />

                  {institution.student_count ??
                    0}

                </strong>

              </div>


              {/* TEACHERS */}

              <div className="lep-quick-stat">

                <span>
                  TEACHERS
                </span>

                <strong>

                  <SmartIcon
                    name="teacher"
                    size={17}
                  />

                  {institution.teacher_count ??
                    0}

                </strong>

              </div>


              {/* PROGRAMS */}

              <div className="lep-quick-stat">

                <span>
                  PROGRAMS
                </span>

                <strong>

                  <SmartIcon
                    name="programs"
                    size={17}
                  />

                  {programs.length}

                </strong>

              </div>


              {/* ESTABLISHED */}

              <div className="lep-quick-stat">

                <span>
                  ESTABLISHED
                </span>

                <strong>

                  <SmartIcon
                    name="calendar"
                    size={17}
                  />

                  {institution.established_year ||
                    "â€”"}

                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <section className="lep-details-content">

          <div className="lep-detail-container">

            <div className="lep-details-layout">


              {/* =================================================
                  MAIN
              ================================================= */}

              <div className="lep-details-main">


                {/* ABOUT */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    ABOUT
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name={config.icon}
                        size={20}
                      />

                    </span>

                    <span>
                      About the {config.title}
                    </span>

                  </h2>


                  <p>
                    {institution.description ||
                      `No description has been added for this ${config.title.toLowerCase()} yet.`}
                  </p>

                </section>


                {/* OVERVIEW */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    OVERVIEW
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="document"
                        size={20}
                      />

                    </span>

                    <span>
                      Institution Information
                    </span>

                  </h2>


                  <div className="lep-info-grid">

                    <div className="lep-info-item">

                      <span>
                        Institution Type
                      </span>

                      <strong>
                        {institution.institution_type ||
                          config.title}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Ownership
                      </span>

                      <strong>
                        {institution.ownership_type ||
                          "Not listed"}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Gender Type
                      </span>

                      <strong>
                        {institution.gender_type ||
                          "Not listed"}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Principal / Head
                      </span>

                      <strong>
                        {institution.principal_name ||
                          "Not listed"}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Established
                      </span>

                      <strong>
                        {institution.established_year ||
                          "Not listed"}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Students
                      </span>

                      <strong>
                        {institution.student_count ??
                          0}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        Teachers
                      </span>

                      <strong>
                        {institution.teacher_count ??
                          0}
                      </strong>

                    </div>


                    <div className="lep-info-item">

                      <span>
                        City
                      </span>

                      <strong>
                        {institution.city ||
                          "Loralai"}
                      </strong>

                    </div>

                  </div>

                </section>


                {/* PROGRAMS */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    ACADEMICS
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="programs"
                        size={20}
                      />

                    </span>

                    <span>
                      Academic Programs
                    </span>

                  </h2>


                  {programs.length === 0 ? (

                    <p>
                      No academic programs
                      available.
                    </p>

                  ) : (

                    <div className="lep-detail-list">

                      {programs.map(
                        (program) => (

                          <div
                            key={
                              program.id
                            }
                            className="lep-detail-list-item"
                          >

                            <div>

                              <strong>
                                {program.name}
                              </strong>

                              <span>
                                {program.level ||
                                  "Program"}
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>


                {/* TEACHERS */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    FACULTY
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="teacher"
                        size={20}
                      />

                    </span>

                    <span>
                      Teachers
                    </span>

                  </h2>


                  {teachers.length === 0 ? (

                    <p>
                      No teacher information
                      available.
                    </p>

                  ) : (

                    <div className="lep-teacher-grid">

                      {teachers.map(
                        (teacher) => (

                          <div
                            key={
                              teacher.id
                            }
                            className="lep-teacher-card"
                          >

                            <div className="lep-teacher-avatar">

                              {teacher.profile_photo_url ? (

                                <img
                                  src={`${API_URL}${teacher.profile_photo_url}`}
                                  alt={
                                    teacher.full_name
                                  }
                                />

                              ) : (

                                <SmartIcon
                                  name="teacher"
                                  size={25}
                                />

                              )}

                            </div>


                            <h3>
                              {teacher.full_name}
                            </h3>


                            <p>
                              {teacher.qualification ||
                                "Qualification not listed"}
                            </p>


                            <span>

                              <SmartIcon
                                name="programs"
                                size={11}
                              />

                              {teacher.subject ||
                                teacher.specialization ||
                                "Teacher"}

                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>


                {/* FACILITIES */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    FACILITIES
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="facilities"
                        size={20}
                      />

                    </span>

                    <span>
                      Facilities
                    </span>

                  </h2>


                  {facilities.length === 0 ? (

                    <p>
                      No facilities available.
                    </p>

                  ) : (

                    <div className="lep-facility-grid">

                      {facilities.map(
                        (facility) => (

                          <div
                            key={
                              facility.id
                            }
                            className="lep-facility"
                          >

                            <SmartIcon
                              name="verified"
                              size={14}
                            />

                            {
                              facility.facility_name
                            }

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>


                {/* FEES */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    FEES
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="fees"
                        size={20}
                      />

                    </span>

                    <span>
                      Fee Information
                    </span>

                  </h2>


                  {fees.length === 0 ? (

                    <p>
                      No public fee information
                      available.
                    </p>

                  ) : (

                    <div className="lep-detail-list">

                      {fees.map(
                        (fee) => (

                          <div
                            key={
                              fee.id
                            }
                            className="lep-detail-list-item"
                          >

                            <div>

                              <strong>
                                {fee.fee_name}
                              </strong>

                              <span>
                                {fee.class_name ||
                                  "All Classes"}
                              </span>

                            </div>


                            <strong>
                              Rs.{" "}
                              {Number(
                                fee.amount || 0
                              ).toLocaleString()}
                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>


                {/* ADMISSIONS */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    ADMISSIONS
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="admissions"
                        size={20}
                      />

                    </span>

                    <span>
                      Admissions
                    </span>

                  </h2>


                  {admissions.length === 0 ? (

                    <p>
                      No admission information
                      available.
                    </p>

                  ) : (

                    <div className="lep-admission-list">

                      {admissions.map(
                        (admission) => (

                          <div
                            key={
                              admission.id
                            }
                            className="lep-admission-card"
                          >

                            <div>

                              <strong>
                                {admission.title}
                              </strong>

                              <p>
                                {admission.description ||
                                  "No description available."}
                              </p>

                            </div>


                            <span className="lep-admission-status">

                              {admission.admission_status}

                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>


                {/* REVIEWS */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    COMMUNITY
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="reviews"
                        size={20}
                      />

                    </span>

                    <span>
                      Reviews
                    </span>

                  </h2>


                  <ReviewsSection
                    institutionId={
                      institution.id
                    }
                  />

                </section>


                {/* REVIEW FORM */}

                <section className="lep-detail-card">

                  <span className="lep-detail-label">
                    SHARE YOUR EXPERIENCE
                  </span>


                  <h2 className="lep-section-title-with-icon">

                    <span className="lep-section-icon">

                      <SmartIcon
                        name="edit"
                        size={20}
                      />

                    </span>

                    <span>
                      Write a Review
                    </span>

                  </h2>


                  <ReviewForm
                    institutionId={
                      institution.id
                    }
                  />

                </section>

              </div>


              {/* =================================================
                  SIDEBAR
              ================================================= */}

              <aside className="lep-sidebar">


                {/* LOCATION */}

                <div className="lep-side-card">

                  <span className="lep-detail-label">
                    LOCATION
                  </span>


                  <div className="lep-side-title">

                    <SmartIcon
                      name="location"
                      size={19}
                    />

                    <h3>
                      Address
                    </h3>

                  </div>


                  <p>
                    {institution.address ||
                      "Address not available."}
                  </p>


                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${institution.address || ""}, ${institution.city || ""}, ${institution.district || ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lep-map-link"
                  >

                    <SmartIcon
                      name="external"
                      size={13}
                    />

                    Open in Google Maps

                  </a>

                </div>


                {/* CONTACT */}

                <div className="lep-side-card">

                  <span className="lep-detail-label">
                    CONTACT
                  </span>


                  <div className="lep-side-title">

                    <SmartIcon
                      name="contacts"
                      size={19}
                    />

                    <h3>
                      Contact Information
                    </h3>

                  </div>


                  {contacts.length > 0 ? (

                    contacts.map(
                      (contact) => (

                        <div
                          key={
                            contact.id
                          }
                          className="lep-contact-item"
                        >

                          <span className="lep-contact-label">

                            <SmartIcon
                              name={
                                contact.contact_type
                                  ?.toLowerCase()
                                  ?.includes("email")
                                  ? "mail"
                                  : "phone"
                              }
                              size={12}
                            />

                            {contact.contact_type}

                          </span>


                          <strong>
                            {
                              contact.contact_value
                            }
                          </strong>

                        </div>

                      )
                    )

                  ) : (

                    <>

                      {institution.phone && (

                        <div className="lep-contact-item">

                          <span className="lep-contact-label">

                            <SmartIcon
                              name="phone"
                              size={12}
                            />

                            Phone

                          </span>


                          <strong>
                            {institution.phone}
                          </strong>

                        </div>

                      )}


                      {institution.email && (

                        <div className="lep-contact-item">

                          <span className="lep-contact-label">

                            <SmartIcon
                              name="mail"
                              size={12}
                            />

                            Email

                          </span>


                          <strong>
                            {institution.email}
                          </strong>

                        </div>

                      )}


                      {!institution.phone &&
                        !institution.email && (

                          <p>
                            No public contact
                            information.
                          </p>

                        )}

                    </>

                  )}

                </div>


                {/* QUICK INFORMATION */}

                <div className="lep-side-card">

                  <span className="lep-detail-label">
                    QUICK INFORMATION
                  </span>


                  <div className="lep-side-title">

                    <SmartIcon
                      name="verified"
                      size={19}
                    />

                    <h3>
                      Institution Status
                    </h3>

                  </div>


                  <div className="lep-contact-item">

                    <span className="lep-contact-label">

                      <SmartIcon
                        name="verified"
                        size={12}
                      />

                      Verification

                    </span>


                    <strong>
                      Verified
                    </strong>

                  </div>


                  <div className="lep-contact-item">

                    <span className="lep-contact-label">

                      <SmartIcon
                        name={config.icon}
                        size={12}
                      />

                      Type

                    </span>


                    <strong>
                      {config.title}
                    </strong>

                  </div>


                  <div className="lep-contact-item">

                    <span className="lep-contact-label">

                      <SmartIcon
                        name="document"
                        size={12}
                      />

                      Ownership

                    </span>


                    <strong>
                      {institution.ownership_type ||
                        "Not listed"}
                    </strong>

                  </div>

                </div>

              </aside>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}


export default InstitutionDetails;
