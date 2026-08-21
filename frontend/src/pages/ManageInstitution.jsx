import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import SmartIcon from "../components/SmartIcon";


const TYPE_CONFIG = {
  school: {
    singular: "School",
    plural: "Schools",
    adminBase: "/admin/schools",
    publicBase: "/schools",
    icon: "school",
  },

  college: {
    singular: "College",
    plural: "Colleges",
    adminBase: "/admin/colleges",
    publicBase: "/colleges",
    icon: "college",
  },

  university: {
    singular: "University",
    plural: "Universities",
    adminBase: "/admin/universities",
    publicBase: "/universities",
    icon: "university",
  },

  academy: {
    singular: "Academy",
    plural: "Academies",
    adminBase: "/admin/academies",
    publicBase: "/academies",
    icon: "academy",
  },
};


function ManageInstitution({ type }) {
  const { id } = useParams();

  const navigate = useNavigate();

  const config =
    TYPE_CONFIG[type];


  const [institution, setInstitution] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);


  // =========================================================
  // LOAD INSTITUTION
  // =========================================================

  const loadInstitution = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");


      const token =
        localStorage.getItem(
          "authToken"
        );


      if (!token) {
        throw new Error(
          "Please login as administrator."
        );
      }


      if (!id) {
        throw new Error(
          "Institution ID is missing."
        );
      }


      const response =
        await fetch(
          `http://localhost:5000/api/admin/institutions/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
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
            "Failed to load institution."
        );
      }


      const loaded =
        data.data?.institution;


      if (!loaded) {
        throw new Error(
          "Institution data not found."
        );
      }


      if (
        loaded.institution_type !==
        type
      ) {
        throw new Error(
          `This record is not a ${config.singular.toLowerCase()}.`
        );
      }


      setInstitution(
        loaded
      );

    } catch (err) {

      console.error(
        "Manage institution error:",
        err
      );


      setError(
        err.message ||
          "Failed to load institution."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  useEffect(() => {

    if (!config) {
      setLoading(false);
      setError(
        "Invalid institution type."
      );
      return;
    }


    loadInstitution();

  }, [id, type]);


  // =========================================================
  // INVALID TYPE
  // =========================================================

  if (!config) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-manage-page">

          <div className="lep-manage-container">

            <div className="lep-manage-state">

              <div className="lep-manage-state-icon">

                <SmartIcon
                  name="warning"
                  size={28}
                />

              </div>


              <span className="lep-manage-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Invalid Institution Type
              </h1>


              <p>
                The requested institution
                type does not exist.
              </p>


              <Link
                to="/admin"
                className="lep-manage-primary"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Admin Dashboard

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-manage-page">

          <div className="lep-manage-container">

            <div className="lep-manage-state">

              <div className="lep-manage-state-icon">

                <SmartIcon
                  name={config.icon}
                  size={28}
                />

              </div>


              <span className="lep-manage-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Loading {config.singular}...
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
  // NOT FOUND
  // =========================================================

  if (!institution) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-manage-page">

          <div className="lep-manage-container">

            <div className="lep-manage-state">

              <div className="lep-manage-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-manage-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                {config.singular} Not Found
              </h1>


              <p>
                {error ||
                  "The requested institution could not be found."}
              </p>


              <Link
                to={config.adminBase}
                className="lep-manage-primary"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Back to {config.plural}

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // URLS
  // =========================================================

  const moduleBase =
    `${config.adminBase}/${institution.id}`;


  const publicUrl =
    `${config.publicBase}/${institution.slug}`;


  // =========================================================
  // MODULES
  // =========================================================

  const modules = [
    {
      key: "programs",
      title: "Academic Programs",
      description:
        "Add programs, classes and academic offerings.",
      path:
        `${moduleBase}/programs`,
      icon: "programs",
      accent: "academic",
    },

    {
      key: "teachers",
      title: "Teachers",
      description:
        "Manage faculty and teacher information.",
      path:
        `${moduleBase}/teachers`,
      icon: "teacher",
      accent: "teachers",
    },

    {
      key: "facilities",
      title: "Facilities",
      description:
        "Manage laboratories, libraries, playgrounds and facilities.",
      path:
        `${moduleBase}/facilities`,
      icon: "facilities",
      accent: "facilities",
    },

    {
      key: "contacts",
      title: "Contacts",
      description:
        "Manage phone, email and website information.",
      path:
        `${moduleBase}/contacts`,
      icon: "contacts",
      accent: "contacts",
    },

    {
      key: "fees",
      title: "Fees",
      description:
        "Manage tuition and other fee information.",
      path:
        `${moduleBase}/fees`,
      icon: "fees",
      accent: "fees",
    },

    {
      key: "admissions",
      title: "Admissions",
      description:
        "Manage current and upcoming admissions.",
      path:
        `${moduleBase}/admissions`,
      icon: "admissions",
      accent: "admissions",
    },
  ];


  return (
    <>
      <style>{styles}</style>


      <main className="lep-manage-page">

        <div className="lep-manage-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-manage-header">


            <div className="lep-manage-heading">


              <div className="lep-manage-page-icon">

                <SmartIcon
                  name={config.icon}
                  size={30}
                />

              </div>


              <div>

                <span className="lep-manage-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  ADMINISTRATION

                </span>


                <h1>
                  {institution.name}
                </h1>


                <p>
                  Manage all information for
                  this{" "}
                  {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            <div className="lep-manage-header-actions">


              <button
                type="button"
                className="lep-manage-refresh"
                onClick={() =>
                  loadInstitution(true)
                }
                disabled={
                  refreshing
                }
              >

                <SmartIcon
                  name="settings"
                  size={14}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>


              <Link
                to={`${config.adminBase}/${institution.id}/edit`}
                className="lep-manage-edit"
              >

                <SmartIcon
                  name="edit"
                  size={14}
                />

                Edit

              </Link>


              <Link
                to={publicUrl}
                className="lep-manage-view"
              >

                <SmartIcon
                  name="external"
                  size={14}
                />

                Public Profile

              </Link>


              <Link
                to={config.adminBase}
                className="lep-manage-back"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                {config.plural}

              </Link>

            </div>

          </header>


          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (

            <div className="lep-manage-message">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {/* =====================================================
              HERO CARD
          ===================================================== */}

          <section className="lep-manage-hero">


            <div className="lep-manage-hero-top">


              <div className="lep-manage-hero-icon">

                {institution.logo_url ? (

                  <img
                    src={
                      institution.logo_url.startsWith(
                        "http"
                      )
                        ? institution.logo_url
                        : `http://localhost:5000${institution.logo_url}`
                    }
                    alt={
                      institution.name
                    }
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <SmartIcon
                    name={config.icon}
                    size={32}
                  />

                )}

              </div>


              <div className="lep-manage-hero-content">


                <div className="lep-manage-hero-label">

                  <span>
                    {config.singular}
                  </span>


                  <span
                    className={
                      `lep-manage-status ${
                        institution.status ||
                        "draft"
                      }`
                    }
                  >

                    <SmartIcon
                      name={
                        institution.status ===
                        "approved"
                          ? "verified"
                          : "calendar"
                      }
                      size={10}
                    />

                    {institution.status ||
                      "Draft"}

                  </span>

                </div>


                <h2>
                  {institution.name}
                </h2>


                <div className="lep-manage-location">

                  <SmartIcon
                    name="location"
                    size={13}
                  />

                  <span>

                    {institution.area
                      ? `${institution.area}, `
                      : ""}

                    {institution.city ||
                      "Loralai"}

                    {institution.district
                      ? `, ${institution.district}`
                      : ""}

                  </span>

                </div>

              </div>


              <div className="lep-manage-hero-actions">

                <Link
                  to={`${config.adminBase}/${institution.id}/edit`}
                  className="lep-manage-hero-btn"
                >

                  <SmartIcon
                    name="edit"
                    size={13}
                  />

                  Edit Institution

                </Link>

              </div>

            </div>


            {/* HERO STATS */}

            <div className="lep-manage-stats">


              <div className="lep-manage-stat">

                <div className="lep-manage-stat-icon">

                  <SmartIcon
                    name={config.icon}
                    size={17}
                  />

                </div>


                <span>
                  TYPE
                </span>


                <strong>
                  {config.singular}
                </strong>

              </div>


              <div className="lep-manage-stat">

                <div className="lep-manage-stat-icon">

                  <SmartIcon
                    name="verified"
                    size={17}
                  />

                </div>


                <span>
                  VERIFICATION
                </span>


                <strong>
                  {institution.verification_status ||
                    "Unverified"}
                </strong>

              </div>


              <div className="lep-manage-stat">

                <div className="lep-manage-stat-icon">

                  <SmartIcon
                    name="students"
                    size={17}
                  />

                </div>


                <span>
                  STUDENTS
                </span>


                <strong>
                  {institution.student_count ??
                    0}
                </strong>

              </div>


              <div className="lep-manage-stat">

                <div className="lep-manage-stat-icon">

                  <SmartIcon
                    name="teacher"
                    size={17}
                  />

                </div>


                <span>
                  TEACHERS
                </span>


                <strong>
                  {institution.teacher_count ??
                    0}
                </strong>

              </div>

            </div>

          </section>


          {/* =====================================================
              MANAGEMENT MODULES
          ===================================================== */}

          <section className="lep-manage-section">


            <div className="lep-manage-section-heading">


              <div className="lep-manage-section-icon">

                <SmartIcon
                  name="dashboard"
                  size={22}
                />

              </div>


              <div>

                <span>
                  MANAGEMENT CENTER
                </span>


                <h2>
                  Manage Detailed Information
                </h2>


                <p>
                  Manage every important part of
                  this institution from one place.
                </p>

              </div>

            </div>


            <div className="lep-manage-module-grid">

              {modules.map(
                (module) => (

                  <Link
                    key={module.key}
                    to={module.path}
                    className={
                      `lep-manage-module ${module.accent}`
                    }
                  >


                    <div className="lep-manage-module-top">


                      <div className="lep-manage-module-icon">

                        <SmartIcon
                          name={module.icon}
                          size={23}
                        />

                      </div>


                      <span className="lep-manage-module-arrow">

                        <SmartIcon
                          name="external"
                          size={12}
                        />

                      </span>

                    </div>


                    <h3>
                      {module.title}
                    </h3>


                    <p>
                      {module.description}
                    </p>


                    <div className="lep-manage-module-link">

                      Open Module

                      <SmartIcon
                        name="arrow-right"
                        size={12}
                      />

                    </div>

                  </Link>

                )
              )}

            </div>

          </section>


          {/* =====================================================
              QUICK ACTIONS
          ===================================================== */}

          <section className="lep-manage-section">


            <div className="lep-manage-section-heading">


              <div className="lep-manage-section-icon">

                <SmartIcon
                  name="settings"
                  size={22}
                />

              </div>


              <div>

                <span>
                  QUICK ACTIONS
                </span>


                <h2>
                  Institution Actions
                </h2>


                <p>
                  Quickly access the most common
                  administrative actions.
                </p>

              </div>

            </div>


            <div className="lep-manage-quick-grid">


              <Link
                to={`${config.adminBase}/${institution.id}/edit`}
                className="lep-manage-quick-card"
              >

                <div className="lep-manage-quick-icon">

                  <SmartIcon
                    name="edit"
                    size={21}
                  />

                </div>


                <div>

                  <strong>
                    Edit Institution
                  </strong>

                  <span>
                    Update institution details.
                  </span>

                </div>


                <SmartIcon
                  name="arrow-right"
                  size={13}
                />

              </Link>


              <Link
                to={`${config.adminBase}/${institution.id}/programs`}
                className="lep-manage-quick-card"
              >

                <div className="lep-manage-quick-icon">

                  <SmartIcon
                    name="programs"
                    size={21}
                  />

                </div>


                <div>

                  <strong>
                    Academic Programs
                  </strong>

                  <span>
                    Manage courses and programs.
                  </span>

                </div>


                <SmartIcon
                  name="arrow-right"
                  size={13}
                />

              </Link>


              <Link
                to={`${config.adminBase}/${institution.id}/teachers`}
                className="lep-manage-quick-card"
              >

                <div className="lep-manage-quick-icon">

                  <SmartIcon
                    name="teacher"
                    size={21}
                  />

                </div>


                <div>

                  <strong>
                    Teachers
                  </strong>

                  <span>
                    Manage faculty information.
                  </span>

                </div>


                <SmartIcon
                  name="arrow-right"
                  size={13}
                />

              </Link>


              <Link
                to={publicUrl}
                className="lep-manage-quick-card"
              >

                <div className="lep-manage-quick-icon">

                  <SmartIcon
                    name="external"
                    size={21}
                  />

                </div>


                <div>

                  <strong>
                    Public Profile
                  </strong>

                  <span>
                    View the public institution page.
                  </span>

                </div>


                <SmartIcon
                  name="arrow-right"
                  size={13}
                />

              </Link>

            </div>

          </section>


          {/* =====================================================
              BASIC INFORMATION
          ===================================================== */}

          <section className="lep-manage-section">


            <div className="lep-manage-section-heading">


              <div className="lep-manage-section-icon">

                <SmartIcon
                  name="document"
                  size={22}
                />

              </div>


              <div>

                <span>
                  INSTITUTION DATA
                </span>


                <h2>
                  Basic Information
                </h2>


                <p>
                  Current information stored in
                  the institution record.
                </p>

              </div>

            </div>


            <div className="lep-manage-info-grid">


              <div className="lep-manage-info-card">

                <span>
                  OWNERSHIP
                </span>

                <strong>
                  {institution.ownership_type ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  GENDER TYPE
                </span>

                <strong>
                  {institution.gender_type ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  PRINCIPAL / HEAD
                </span>

                <strong>
                  {institution.principal_name ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  ESTABLISHED
                </span>

                <strong>
                  {institution.established_year ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  PHONE
                </span>

                <strong>
                  {institution.phone ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  EMAIL
                </span>

                <strong>
                  {institution.email ||
                    "Not provided"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  CITY
                </span>

                <strong>
                  {institution.city ||
                    "Loralai"}
                </strong>

              </div>


              <div className="lep-manage-info-card">

                <span>
                  DISTRICT
                </span>

                <strong>
                  {institution.district ||
                    "Loralai"}
                </strong>

              </div>

            </div>

          </section>


          {/* =====================================================
              LOCATION
          ===================================================== */}

          <section className="lep-manage-section">


            <div className="lep-manage-section-heading">


              <div className="lep-manage-section-icon">

                <SmartIcon
                  name="location"
                  size={22}
                />

              </div>


              <div>

                <span>
                  LOCATION
                </span>


                <h2>
                  Institution Address
                </h2>


                <p>
                  Physical location information.
                </p>

              </div>

            </div>


            <div className="lep-manage-address">


              <div className="lep-manage-address-icon">

                <SmartIcon
                  name="location"
                  size={24}
                />

              </div>


              <div>

                <strong>
                  {institution.address ||
                    "Address not provided."}
                </strong>


                <p>

                  {institution.area
                    ? `${institution.area}, `
                    : ""}

                  {institution.city ||
                    "Loralai"}

                  {institution.district
                    ? `, ${institution.district}`
                    : ""}

                  {institution.province
                    ? `, ${institution.province}`
                    : ""}

                  {institution.country
                    ? `, ${institution.country}`
                    : ""}

                </p>

              </div>

            </div>

          </section>


          {/* =====================================================
              DESCRIPTION
          ===================================================== */}

          {institution.description && (

            <section className="lep-manage-section">


              <div className="lep-manage-section-heading">

                <div className="lep-manage-section-icon">

                  <SmartIcon
                    name="document"
                    size={22}
                  />

                </div>


                <div>

                  <span>
                    PROFILE
                  </span>


                  <h2>
                    Description
                  </h2>

                </div>

              </div>


              <div className="lep-manage-description">

                {institution.description}

              </div>

            </section>

          )}

        </div>

      </main>
    </>
  );
}


// =========================================================
// CSS
// =========================================================

const styles = `

  .lep-manage-page {
    min-height: 100vh;

    padding: 45px 0 90px;

    background:
      radial-gradient(
        circle at 90% 5%,
        rgba(44,95,138,.13),
        transparent 25%
      ),
      radial-gradient(
        circle at 5% 70%,
        rgba(255,107,0,.06),
        transparent 22%
      ),
      linear-gradient(
        180deg,
        #f7f9fc,
        #edf3f8
      );

    color: #2d3748;
  }


  .lep-manage-container {
    width:
      min(
        1200px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* =====================================================
     HEADER
  ===================================================== */

  .lep-manage-header {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      25px;

    margin-bottom:
      23px;
  }


  .lep-manage-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-manage-page-icon {
    width:
      62px;

    height:
      62px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

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
      0 9px 0 #142b47,
      0 19px 35px
      rgba(26,54,93,.18);

    transform:
      perspective(700px)
      rotateX(4deg)
      rotateY(-4deg);
  }


  .lep-manage-eyebrow {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    color:
      #ff6b00;

    font-size:
      9px;

    font-weight:
      900;

    letter-spacing:
      1.5px;
  }


  .lep-manage-heading h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      clamp(
        34px,
        5vw,
        53px
      );

    line-height:
      1;

    letter-spacing:
      -1.9px;
  }


  .lep-manage-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-manage-header-actions {
    display:
      flex;

    align-items:
      center;

    justify-content:
      flex-end;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-manage-refresh,
  .lep-manage-edit,
  .lep-manage-view,
  .lep-manage-back {
    min-height:
      39px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 11px;

    border-radius:
      8px;

    font-family:
      inherit;

    font-size:
      9px;

    font-weight:
      900;

    text-decoration:
      none;

    cursor:
      pointer;

    transition:
      transform .2s ease,
      background .2s ease,
      border-color .2s ease;
  }


  .lep-manage-refresh {
    border:
      1px solid #dce4ec;

    background:
      #ffffff;

    color:
      #1a365d;
  }


  .lep-manage-edit {
    border:
      none;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ffffff;

    box-shadow:
      0 7px 15px
      rgba(26,54,93,.12);
  }


  .lep-manage-view {
    border:
      1px solid #f2d9c7;

    background:
      #fff8f3;

    color:
      #d85c00;
  }


  .lep-manage-back {
    border:
      1px solid #dce4ec;

    background:
      #ffffff;

    color:
      #1a365d;
  }


  .lep-manage-refresh:hover,
  .lep-manage-edit:hover,
  .lep-manage-view:hover,
  .lep-manage-back:hover {
    transform:
      translateY(-2px);
  }


  .lep-manage-edit:hover {
    background:
      linear-gradient(
        135deg,
        #ff6b00,
        #e65f00
      );
  }


  /* =====================================================
     MESSAGE
  ===================================================== */

  .lep-manage-message {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    margin-bottom:
      14px;

    padding:
      12px 14px;

    border:
      1px solid #f1cccc;

    border-radius:
      9px;

    background:
      #fff2f2;

    color:
      #b42318;

    font-size:
      10px;

    font-weight:
      800;
  }


  /* =====================================================
     HERO
  ===================================================== */

  .lep-manage-hero {
    position:
      relative;

    overflow:
      hidden;

    padding:
      20px;

    border:
      1px solid rgba(255,255,255,.24);

    border-radius:
      18px;

    background:
      linear-gradient(
        135deg,
        #122f4f,
        #1a365d 55%,
        #2c5f8a
      );

    color:
      #ffffff;

    box-shadow:
      0 18px 42px
      rgba(26,54,93,.19);
  }


  .lep-manage-hero::before {
    content:
      "";

    position:
      absolute;

    width:
      260px;

    height:
      260px;

    right:
      -120px;

    top:
      -160px;

    border-radius:
      50%;

    background:
      rgba(255,255,255,.05);
  }


  .lep-manage-hero::after {
    content:
      "";

    position:
      absolute;

    width:
      180px;

    height:
      180px;

    left:
      -100px;

    bottom:
      -120px;

    border-radius:
      50%;

    background:
      rgba(255,107,0,.08);
  }


  .lep-manage-hero-top {
    position:
      relative;

    z-index:
      1;

    display:
      grid;

    grid-template-columns:
      72px
      minmax(0,1fr)
      auto;

    gap:
      15px;

    align-items:
      center;
  }


  .lep-manage-hero-icon {
    width:
      72px;

    height:
      72px;

    display:
      grid;

    place-items:
      center;

    overflow:
      hidden;

    border:
      1px solid
      rgba(255,255,255,.15);

    border-radius:
      17px;

    background:
      rgba(255,255,255,.08);

    color:
      #ff9348;

    box-shadow:
      0 9px 0
      rgba(0,0,0,.18),
      0 18px 26px
      rgba(0,0,0,.12);

    transform:
      perspective(700px)
      rotateX(5deg)
      rotateY(-4deg);
  }


  .lep-manage-hero-icon img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-manage-hero-label {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1px;

    color:
      #b9c8d7;
  }


  .lep-manage-status {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    padding:
      5px 7px;

    border-radius:
      6px;

    background:
      rgba(255,255,255,.10);

    color:
      #cbd9e6;

    text-transform:
      uppercase;
  }


  .lep-manage-status.approved {
    background:
      rgba(33,150,83,.20);

    color:
      #9cf2b4;
  }


  .lep-manage-hero-content h2 {
    margin-top:
      6px;

    color:
      #ffffff;

    font-size:
      clamp(
        21px,
        3vw,
        29px
      );

    line-height:
      1.2;
  }


  .lep-manage-location {
    display:
      flex;

    align-items:
      center;

    gap:
      5px;

    margin-top:
      8px;

    color:
      #c2d1de;

    font-size:
      9px;
  }


  .lep-manage-location svg {
    color:
      #ff9348;
  }


  .lep-manage-hero-actions {
    display:
      flex;

    justify-content:
      flex-end;
  }


  .lep-manage-hero-btn {
    min-height:
      39px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 11px;

    border:
      1px solid
      rgba(255,255,255,.16);

    border-radius:
      8px;

    background:
      rgba(255,255,255,.08);

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      900;

    backdrop-filter:
      blur(4px);

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-manage-hero-btn:hover {
    transform:
      translateY(-2px);

    background:
      rgba(255,107,0,.92);
  }


  /* HERO STATS */

  .lep-manage-stats {
    position:
      relative;

    z-index:
      1;

    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      9px;

    margin-top:
      18px;

    padding-top:
      17px;

    border-top:
      1px solid
      rgba(255,255,255,.11);
  }


  .lep-manage-stat {
    padding:
      10px;

    border-radius:
      10px;

    background:
      rgba(255,255,255,.055);

    border:
      1px solid
      rgba(255,255,255,.06);
  }


  .lep-manage-stat-icon {
    width:
      30px;

    height:
      30px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      8px;

    background:
      rgba(255,255,255,.09);

    color:
      #ff9348;
  }


  .lep-manage-stat span {
    display:
      block;

    margin-top:
      8px;

    color:
      #94aabd;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      .9px;
  }


  .lep-manage-stat strong {
    display:
      block;

    margin-top:
      3px;

    color:
      #ffffff;

    font-size:
      13px;

    text-transform:
      capitalize;
  }


  /* =====================================================
     SECTIONS
  ===================================================== */

  .lep-manage-section {
    margin-top:
      17px;

    padding:
      24px;

    background:
      rgba(255,255,255,.97);

    border:
      1px solid #e2e8f0;

    border-radius:
      17px;

    box-shadow:
      0 12px 30px
      rgba(26,54,93,.055);
  }


  .lep-manage-section-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      19px;
  }


  .lep-manage-section-icon {
    width:
      46px;

    height:
      46px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 8px 0 #142b47,
      0 13px 23px
      rgba(26,54,93,.13);
  }


  .lep-manage-section-heading span {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-manage-section-heading h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      22px;
  }


  .lep-manage-section-heading p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.5;
  }


  /* =====================================================
     MODULE CARDS
  ===================================================== */

  .lep-manage-module-grid {
    display:
      grid;

    grid-template-columns:
      repeat(3,1fr);

    gap:
      12px;
  }


  .lep-manage-module {
    position:
      relative;

    overflow:
      hidden;

    min-height:
      185px;

    padding:
      17px;

    border:
      1px solid #e2e8f0;

    border-radius:
      14px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f5f8fb
      );

    text-decoration:
      none;

    box-shadow:
      0 8px 20px
      rgba(26,54,93,.04);

    transition:
      transform .28s ease,
      box-shadow .28s ease,
      border-color .28s ease;
  }


  .lep-manage-module::after {
    content:
      "";

    position:
      absolute;

    width:
      110px;

    height:
      110px;

    right:
      -60px;

    bottom:
      -60px;

    border-radius:
      50%;

    background:
      rgba(44,95,138,.045);
  }


  .lep-manage-module:hover {
    transform:
      translateY(-6px);

    border-color:
      rgba(44,95,138,.24);

    box-shadow:
      0 20px 42px
      rgba(26,54,93,.10);
  }


  .lep-manage-module-top {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;
  }


  .lep-manage-module-icon {
    width:
      48px;

    height:
      48px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 7px 0 #142b47,
      0 13px 20px
      rgba(26,54,93,.12);

    transform:
      perspective(600px)
      rotateX(4deg)
      rotateY(-3deg);

    transition:
      transform .3s ease;
  }


  .lep-manage-module:hover
  .lep-manage-module-icon {
    transform:
      perspective(600px)
      rotateX(0)
      rotateY(0)
      translateY(-3px);
  }


  .lep-manage-module-arrow {
    width:
      28px;

    height:
      28px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      8px;

    background:
      #f1f5f9;

    color:
      #64748b;
  }


  .lep-manage-module h3 {
    margin-top:
      18px;

    color:
      #1a365d;

    font-size:
      16px;
  }


  .lep-manage-module p {
    margin-top:
      6px;

    color:
      #718096;

    font-size:
      9px;

    line-height:
      1.6;
  }


  .lep-manage-module-link {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    margin-top:
      14px;

    color:
      #2c5f8a;

    font-size:
      8px;

    font-weight:
      900;

    text-transform:
      uppercase;

    letter-spacing:
      .6px;
  }


  .lep-manage-module:hover
  .lep-manage-module-link {
    color:
      #ff6b00;
  }


  /* =====================================================
     QUICK ACTIONS
  ===================================================== */

  .lep-manage-quick-grid {
    display:
      grid;

    grid-template-columns:
      repeat(2,1fr);

    gap:
      10px;
  }


  .lep-manage-quick-card {
    display:
      grid;

    grid-template-columns:
      46px minmax(0,1fr) auto;

    gap:
      11px;

    align-items:
      center;

    padding:
      13px;

    border:
      1px solid #e2e8f0;

    border-radius:
      11px;

    background:
      #f9fbfd;

    color:
      #2d3748;

    text-decoration:
      none;

    transition:
      transform .22s ease,
      box-shadow .22s ease,
      border-color .22s ease;
  }


  .lep-manage-quick-card:hover {
    transform:
      translateY(-3px);

    border-color:
      rgba(44,95,138,.22);

    box-shadow:
      0 13px 27px
      rgba(26,54,93,.07);
  }


  .lep-manage-quick-icon {
    width:
      46px;

    height:
      46px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      11px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 6px 0 #142b47;
  }


  .lep-manage-quick-card strong {
    display:
      block;

    color:
      #1a365d;

    font-size:
      11px;
  }


  .lep-manage-quick-card span {
    display:
      block;

    margin-top:
      4px;

    color:
      #718096;

    font-size:
      8px;
  }


  .lep-manage-quick-card > svg {
    color:
      #94a3b8;
  }


  /* =====================================================
     BASIC INFORMATION
  ===================================================== */

  .lep-manage-info-grid {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      9px;
  }


  .lep-manage-info-card {
    padding:
      12px;

    border:
      1px solid #e5ebf1;

    border-radius:
      9px;

    background:
      #f9fbfd;
  }


  .lep-manage-info-card span {
    display:
      block;

    color:
      #94a3b8;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      .8px;
  }


  .lep-manage-info-card strong {
    display:
      block;

    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      10px;

    line-height:
      1.45;

    text-transform:
      capitalize;
  }


  /* =====================================================
     ADDRESS
  ===================================================== */

  .lep-manage-address {
    display:
      grid;

    grid-template-columns:
      52px minmax(0,1fr);

    gap:
      12px;

    align-items:
      center;

    padding:
      15px;

    border:
      1px solid #e2e8f0;

    border-radius:
      11px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f7fafc
      );
  }


  .lep-manage-address-icon {
    width:
      52px;

    height:
      52px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-manage-address strong {
    display:
      block;

    color:
      #1a365d;

    font-size:
      11px;

    line-height:
      1.5;
  }


  .lep-manage-address p {
    margin-top:
      5px;

    color:
      #718096;

    font-size:
      9px;

    line-height:
      1.6;
  }


  /* =====================================================
     DESCRIPTION
  ===================================================== */

  .lep-manage-description {
    padding:
      16px;

    border:
      1px solid #e2e8f0;

    border-radius:
      11px;

    background:
      #f9fbfd;

    color:
      #5b6b7b;

    font-size:
      10px;

    line-height:
      1.8;
  }


  /* =====================================================
     STATE
  ===================================================== */

  .lep-manage-state {
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
      40px;

    text-align:
      center;

    background:
      rgba(255,255,255,.96);

    border:
      1px solid #e2e8f0;

    border-radius:
      18px;

    box-shadow:
      0 15px 36px
      rgba(26,54,93,.06);
  }


  .lep-manage-state-icon {
    width:
      62px;

    height:
      62px;

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
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 10px 22px
      rgba(26,54,93,.15);
  }


  .lep-manage-state h1 {
    color:
      #1a365d;

    font-size:
      24px;
  }


  .lep-manage-state p {
    max-width:
      500px;

    margin-top:
      8px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.6;
  }


  .lep-manage-primary {
    min-height:
      41px;

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
      10px;

    font-weight:
      900;
  }


  /* =====================================================
     RESPONSIVE
  ===================================================== */

  @media (max-width: 1050px) {

    .lep-manage-header {
      display:
        block;
    }


    .lep-manage-header-actions {
      margin-top:
        16px;

      justify-content:
        flex-start;
    }


    .lep-manage-module-grid {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-manage-info-grid {
      grid-template-columns:
        repeat(2,1fr);
    }

  }


  @media (max-width: 760px) {

    .lep-manage-hero-top {
      grid-template-columns:
        58px minmax(0,1fr);
    }


    .lep-manage-hero-icon {
      width:
        58px;

      height:
        58px;
    }


    .lep-manage-hero-actions {
      grid-column:
        1 / -1;

      justify-content:
        flex-start;
    }


    .lep-manage-stats {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-manage-quick-grid {
      grid-template-columns:
        1fr;
    }

  }


  @media (max-width: 560px) {

    .lep-manage-page {
      padding-top:
        30px;
    }


    .lep-manage-heading {
      align-items:
        flex-start;
    }


    .lep-manage-heading h1 {
      font-size:
        37px;
    }


    .lep-manage-header-actions {
      display:
        grid;

      grid-template-columns:
        1fr 1fr;
    }


    .lep-manage-refresh,
    .lep-manage-edit,
    .lep-manage-view,
    .lep-manage-back {
      width:
        100%;
    }


    .lep-manage-module-grid {
      grid-template-columns:
        1fr;
    }


    .lep-manage-info-grid {
      grid-template-columns:
        1fr;
    }


    .lep-manage-stats {
      grid-template-columns:
        1fr 1fr;
    }


    .lep-manage-section {
      padding:
        19px;
    }


    .lep-manage-state {
      padding:
        25px 17px;
    }

  }

`;

export default ManageInstitution;