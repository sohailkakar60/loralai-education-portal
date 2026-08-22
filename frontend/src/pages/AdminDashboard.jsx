import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


const INSTITUTION_TYPES = [
  {
    type: "school",
    title: "Schools",
    singular: "School",
    path: "/admin/schools",
    icon: "school",
  },
  {
    type: "college",
    title: "Colleges",
    singular: "College",
    path: "/admin/colleges",
    icon: "college",
  },
  {
    type: "university",
    title: "Universities",
    singular: "University",
    path: "/admin/universities",
    icon: "university",
  },
  {
    type: "academy",
    title: "Academies",
    singular: "Academy",
    path: "/admin/academies",
    icon: "academy",
  },
];


const MODULE_CONFIG = {
  programs: {
    title: "Academic Programs",
    description:
      "Manage academic programs associated with educational institutions.",
    icon: "programs",
  },

  teachers: {
    title: "Teachers",
    description:
      "Manage teacher information, qualifications, subjects and profiles.",
    icon: "teacher",
  },

  facilities: {
    title: "Facilities",
    description:
      "Manage institution facilities and available educational resources.",
    icon: "facilities",
  },

  fees: {
    title: "Fees",
    description:
      "Manage public fee information for institutions and programs.",
    icon: "fees",
  },

  admissions: {
    title: "Admissions",
    description:
      "Manage admission information, status and application details.",
    icon: "admissions",
  },
};


function AdminDashboard() {
  const navigate = useNavigate();


  const [summary, setSummary] = useState({
    institutions: 0,
    approved_institutions: 0,
    pending_institutions: 0,
    rejected_institutions: 0,
    reviews: 0,
    teachers: 0,
    academic_programs: 0,
    news: 0,
  });


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [modulePicker, setModulePicker] =
    useState(null);


  const [institutions, setInstitutions] =
    useState([]);


  const [institutionsLoading, setInstitutionsLoading] =
    useState(false);


  const [institutionsError, setInstitutionsError] =
    useState("");


  const loadDashboard =
    async () => {
      try {
        setLoading(true);
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


        const dashboardResponse =
          await fetch(
            `${API_URL}/api/admin/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const dashboardData =
          await dashboardResponse.json();


        if (
          !dashboardResponse.ok ||
          !dashboardData.success
        ) {
          throw new Error(
            dashboardData.message ||
              "Failed to load dashboard."
          );
        }


        let newsCount = 0;


        try {
          const newsResponse =
            await fetch(
              `${API_URL}/api/news/admin/all`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const newsData =
            await newsResponse.json();


          if (
            newsResponse.ok &&
            newsData.success
          ) {
            newsCount =
              newsData.data?.news?.length ||
              0;
          }
        } catch (newsError) {
          console.error(
            "News dashboard error:",
            newsError
          );
        }


        setSummary({
          institutions:
            Number(
              dashboardData.data
                ?.institutions || 0
            ),

          approved_institutions:
            Number(
              dashboardData.data
                ?.approved_institutions || 0
            ),

          pending_institutions:
            Number(
              dashboardData.data
                ?.pending_institutions || 0
            ),

          rejected_institutions:
            Number(
              dashboardData.data
                ?.rejected_institutions || 0
            ),

          reviews:
            Number(
              dashboardData.data
                ?.reviews || 0
            ),

          teachers:
            Number(
              dashboardData.data
                ?.teachers || 0
            ),

          academic_programs:
            Number(
              dashboardData.data
                ?.academic_programs || 0
            ),

          news: newsCount,
        });

      } catch (err) {

        console.error(
          "Dashboard error:",
          err
        );


        setError(
          err.message ||
            "Failed to load dashboard."
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    loadDashboard();
  }, []);


  // =========================================================
  // LOAD INSTITUTIONS FOR MODULE PICKER
  // =========================================================

  const loadInstitutions =
    async () => {

      try {

        setInstitutionsLoading(true);
        setInstitutionsError("");


        const token =
          localStorage.getItem(
            "authToken"
          );


        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }


        const responses =
          await Promise.all(
            INSTITUTION_TYPES.map(
              async (config) => {

                const response =
                  await fetch(
                    `${API_URL}/api/admin/institutions?type=${config.type}`,
                    {
                      headers: {
                        Authorization:
                          `Bearer ${token}`,
                      },
                    },
                  );


                if (!response.ok) {
                  return [];
                }


                const data =
                  await response.json();


                if (
                  !data.success
                ) {
                  return [];
                }


                const rows =
                  data.data?.institutions ||
                  data.data?.rows ||
                  [];


                return rows.map(
                  (institution) => ({
                    ...institution,

                    institution_type:
                      institution.institution_type ||
                      config.type,
                  })
                );
              }
            )
          );


        const merged =
          responses
            .flat()
            .filter(
              (institution) =>
                institution?.id
            );


        setInstitutions(
          merged
        );

      } catch (err) {

        console.error(
          "Institution picker error:",
          err
        );


        setInstitutionsError(
          err.message ||
            "Failed to load institutions."
        );

      } finally {

        setInstitutionsLoading(
          false
        );

      }
    };


  // =========================================================
  // OPEN MODULE
  // =========================================================

  const openModulePicker =
    async (moduleKey) => {

      setModulePicker(
        moduleKey
      );

      await loadInstitutions();
    };


  // =========================================================
  // CLOSE MODULE PICKER
  // =========================================================

  const closeModulePicker = () => {
    setModulePicker(null);
    setInstitutions([]);
    setInstitutionsError("");
  };


  // =========================================================
  // OPEN SELECTED MODULE
  // =========================================================

  const openInstitutionModule =
    (institution, moduleKey) => {

      const type =
        institution.institution_type;

      if (!type) {
        return;
      }


      const modulePath =
        moduleKey === "programs"
          ? "programs"
          : moduleKey;


      navigate(
        `/admin/${type}s/${institution.id}/${modulePath}`
      );


      closeModulePicker();
    };


  // =========================================================
  // MANAGEMENT CARD
  // =========================================================

  const ManagementCard = ({
    icon,
    iconClass = "",
    title,
    description,
    managePath,
    addPath,
    featured = false,
    moduleKey = null,
  }) => {

    const handleManage =
      () => {

        if (moduleKey) {
          openModulePicker(
            moduleKey
          );

          return;
        }


        navigate(
          managePath
        );
      };


    return (
      <div
        className={
          featured
            ? "lep-admin-management-card featured"
            : "lep-admin-management-card"
        }
      >

        <div className="lep-admin-card-top">

          <div
            className={
              `lep-admin-icon-box ${iconClass}`
            }
          >

            <SmartIcon
              name={icon}
              size={24}
            />

          </div>


          {featured && (

            <span className="lep-admin-featured-label">
              IMPORTANT
            </span>

          )}

        </div>


        <h3>
          {title}
        </h3>


        <p>
          {description}
        </p>


        <div className="lep-admin-card-actions">

          <button
            type="button"
            className="lep-admin-manage-btn"
            onClick={
              handleManage
            }
          >

            <SmartIcon
              name="dashboard"
              size={14}
            />

            Manage

          </button>


          {addPath && (

            <Link
              to={addPath}
              className="lep-admin-add-btn"
            >

              <SmartIcon
                name="plus"
                size={14}
              />

              Add

            </Link>

          )}

        </div>

      </div>
    );
  };


  return (
    <>
      <style>{styles}</style>


      <main className="lep-admin-page">

        <div className="lep-admin-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lep-admin-header">

            <div>

              <span className="lep-admin-eyebrow">

                <SmartIcon
                  name="dashboard"
                  size={13}
                />

                ADMINISTRATION

              </span>


              <h1 className="lep-admin-title">
                Admin Dashboard
              </h1>


              <p className="lep-admin-description">
                Manage institutions, teachers,
                academic programs, educational news,
                reviews and other portal information
                from one central workspace.
              </p>

            </div>


            <button
              type="button"
              className="lep-admin-refresh"
              onClick={
                loadDashboard
              }
              disabled={
                loading
              }
            >

              <SmartIcon
                name="settings"
                size={15}
              />

              {loading
                ? "Refreshing..."
                : "Refresh Dashboard"}

            </button>

          </header>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="lep-admin-alert">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {/* =================================================
              METRICS
          ================================================= */}

          <section className="lep-admin-metrics">


            <div className="lep-admin-metric">

              <div className="lep-admin-metric-top">

                <div className="lep-admin-metric-icon">

                  <SmartIcon
                    name="school"
                    size={21}
                  />

                </div>


                <small>
                  INSTITUTIONS
                </small>

              </div>


              <strong>
                {summary.institutions}
              </strong>


              <p>
                Total institutions
              </p>

            </div>


            <div className="lep-admin-metric">

              <div className="lep-admin-metric-top">

                <div className="lep-admin-metric-icon">

                  <SmartIcon
                    name="verified"
                    size={21}
                  />

                </div>


                <small>
                  PUBLISHED
                </small>

              </div>


              <strong>
                {summary.approved_institutions}
              </strong>


              <p>
                Approved institutions
              </p>

            </div>


            <div className="lep-admin-metric">

              <div className="lep-admin-metric-top">

                <div className="lep-admin-metric-icon">

                  <SmartIcon
                    name="calendar"
                    size={21}
                  />

                </div>


                <small>
                  PENDING
                </small>

              </div>


              <strong>
                {summary.pending_institutions}
              </strong>


              <p>
                Awaiting review
              </p>

            </div>


            <div className="lep-admin-metric">

              <div className="lep-admin-metric-top">

                <div className="lep-admin-metric-icon">

                  <SmartIcon
                    name="reviews"
                    size={21}
                  />

                </div>


                <small>
                  REVIEWS
                </small>

              </div>


              <strong>
                {summary.reviews}
              </strong>


              <p>
                Community reviews
              </p>

            </div>

          </section>


          {/* =================================================
              INSTITUTION MANAGEMENT
          ================================================= */}

          <section className="lep-admin-section">

            <div className="lep-admin-section-heading">

              <div>

                <span className="lep-admin-section-label">
                  INSTITUTION MANAGEMENT
                </span>


                <h2>
                  Manage Education
                </h2>


                <p>
                  Add, edit, verify and manage
                  educational institutions.
                </p>

              </div>

            </div>


            <div className="lep-admin-management-grid">

              <ManagementCard
                icon="school"
                title="Schools"
                description="Manage verified schools and their detailed educational information."
                managePath="/admin/schools"
                addPath="/admin/schools/add"
              />


              <ManagementCard
                icon="college"
                title="Colleges"
                description="Manage colleges and higher education institutions across Loralai."
                managePath="/admin/colleges"
                addPath="/admin/colleges/add"
              />


              <ManagementCard
                icon="university"
                title="Universities"
                description="Manage universities, degree institutions and higher education data."
                managePath="/admin/universities"
                addPath="/admin/universities/add"
              />


              <ManagementCard
                icon="academy"
                title="Academies"
                description="Manage academies, learning centers and professional education providers."
                managePath="/admin/academies"
                addPath="/admin/academies/add"
              />


              <ManagementCard
                icon="tutor"
                title="Home Tutors"
                description="Manage tutor profiles, approvals, subjects and public availability."
                managePath="/admin/tutors"
                addPath="/admin/tutors/add"
              />


              <ManagementCard
                icon="reviews"
                title="Reviews"
                description="Review community feedback and approve or reject submitted reviews."
                managePath="/admin/reviews"
              />


              <ManagementCard
                icon="news"
                iconClass="orange"
                title="Educational News"
                description="Publish scholarships, admissions, exam notices, events, jobs and announcements."
                managePath="/admin/news"
                featured
              />


              <ManagementCard
                icon="programs"
                title="Academic Programs"
                description="Manage academic programs associated with educational institutions."
                moduleKey="programs"
              />


              <ManagementCard
                icon="teacher"
                title="Teachers"
                description="Manage teacher information, qualifications, subjects and profiles."
                moduleKey="teachers"
              />


              <ManagementCard
                icon="facilities"
                title="Facilities"
                description="Manage institution facilities and available educational resources."
                moduleKey="facilities"
              />


              <ManagementCard
                icon="fees"
                title="Fees"
                description="Manage public fee information for institutions and programs."
                moduleKey="fees"
              />


              <ManagementCard
                icon="admissions"
                title="Admissions"
                description="Manage admission information, status and application details."
                moduleKey="admissions"
              />

            </div>

          </section>


          {/* =================================================
              PORTAL OVERVIEW
          ================================================= */}

          <section className="lep-admin-section">

            <div className="lep-admin-section-heading">

              <div>

                <span className="lep-admin-section-label">
                  PORTAL OVERVIEW
                </span>


                <h2>
                  Current Data
                </h2>


                <p>
                  Quick overview of important
                  portal information.
                </p>

              </div>

            </div>


            <div className="lep-admin-overview-grid">


              <div className="lep-admin-overview-item">

                <div className="lep-admin-overview-title">

                  <SmartIcon
                    name="teacher"
                    size={13}
                  />

                  TEACHERS

                </div>


                <strong className="lep-admin-overview-value">
                  {summary.teachers}
                </strong>

              </div>


              <div className="lep-admin-overview-item">

                <div className="lep-admin-overview-title">

                  <SmartIcon
                    name="programs"
                    size={13}
                  />

                  ACADEMIC PROGRAMS

                </div>


                <strong className="lep-admin-overview-value">
                  {summary.academic_programs}
                </strong>

              </div>


              <div className="lep-admin-overview-item">

                <div className="lep-admin-overview-title">

                  <SmartIcon
                    name="delete"
                    size={13}
                  />

                  REJECTED

                </div>


                <strong className="lep-admin-overview-value">
                  {summary.rejected_institutions}
                </strong>

              </div>


              <div className="lep-admin-overview-item">

                <div className="lep-admin-overview-title">

                  <SmartIcon
                    name="news"
                    size={13}
                  />

                  NEWS ARTICLES

                </div>


                <strong className="lep-admin-overview-value">
                  {summary.news}
                </strong>

              </div>

            </div>

          </section>


        </div>

      </main>


      {/* =====================================================
          MODULE PICKER
      ===================================================== */}

      {modulePicker && (

        <div
          className="lep-module-overlay"
          onClick={
            closeModulePicker
          }
        >

          <div
            className="lep-module-picker"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="lep-module-picker-header">

              <div>

                <span>
                  ADMINISTRATION
                </span>


                <h2>
                  Choose Institution
                </h2>


                <p>
                  Select the institution where you
                  want to manage{" "}
                  <strong>
                    {
                      MODULE_CONFIG[
                        modulePicker
                      ].title
                    }
                  </strong>.
                </p>

              </div>


              <button
                type="button"
                className="lep-module-close"
                onClick={
                  closeModulePicker
                }
              >
                ×
              </button>

            </div>


            {institutionsLoading ? (

              <div className="lep-module-state">

                <SmartIcon
                  name="settings"
                  size={23}
                />

                <h3>
                  Loading Institutions...
                </h3>

                <p>
                  Please wait.
                </p>

              </div>

            ) : institutionsError ? (

              <div className="lep-module-state error">

                <SmartIcon
                  name="warning"
                  size={23}
                />

                <h3>
                  Could Not Load Institutions
                </h3>

                <p>
                  {institutionsError}
                </p>


                <button
                  type="button"
                  className="lep-module-retry"
                  onClick={
                    loadInstitutions
                  }
                >
                  Retry
                </button>

              </div>

            ) : institutions.length === 0 ? (

              <div className="lep-module-state">

                <SmartIcon
                  name="school"
                  size={23}
                />

                <h3>
                  No Institutions Found
                </h3>

                <p>
                  Add a school, college, university
                  or academy first.
                </p>

                <Link
                  to="/admin/schools/add"
                  className="lep-module-retry"
                  onClick={
                    closeModulePicker
                  }
                >
                  Add Institution
                </Link>

              </div>

            ) : (

              <div className="lep-institution-picker-grid">

                {institutions.map(
                  (institution) => {

                    const config =
                      INSTITUTION_TYPES.find(
                        (item) =>
                          item.type ===
                          institution.institution_type
                      );


                    return (

                      <button
                        key={
                          `${institution.institution_type}-${institution.id}`
                        }
                        type="button"
                        className="lep-institution-option"
                        onClick={() =>
                          openInstitutionModule(
                            institution,
                            modulePicker
                          )
                        }
                      >

                        <div className="lep-institution-option-icon">

                          <SmartIcon
                            name={
                              config?.icon ||
                              "school"
                            }
                            size={23}
                          />

                        </div>


                        <div>

                          <strong>
                            {
                              institution.name
                            }
                          </strong>


                          <span>

                            {config?.singular ||
                              "Institution"}

                            {institution.city
                              ? ` • ${institution.city}`
                              : ""}

                          </span>

                        </div>


                        <SmartIcon
                          name="arrow-right"
                          size={15}
                        />

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

.lep-admin-page {
  min-height: 100vh;
  padding: 45px 0 90px;

  background:
    radial-gradient(
      circle at 90% 5%,
      rgba(44,95,138,.12),
      transparent 25%
    ),
    linear-gradient(
      180deg,
      #f7f9fc,
      #edf3f8
    );

  color: #2d3748;
}


.lep-admin-container {
  width:
    min(
      1200px,
      calc(100% - 32px)
    );

  margin: 0 auto;
}


.lep-admin-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 27px;
}


.lep-admin-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: #ff6b00;

  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
}


.lep-admin-title {
  margin-top: 8px;

  color: #1a365d;

  font-size:
    clamp(
      35px,
      5vw,
      53px
    );

  line-height: 1;
  letter-spacing: -1.8px;
}


.lep-admin-description {
  max-width: 700px;
  margin-top: 10px;

  color: #718096;

  font-size: 13px;
  line-height: 1.7;
}


.lep-admin-refresh {
  min-height: 43px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  padding: 0 15px;

  border: 1px solid #d8e1ea;
  border-radius: 9px;

  background: #ffffff;
  color: #1a365d;

  font-family: inherit;

  font-size: 11px;
  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 8px 20px
    rgba(26,54,93,.05);
}


.lep-admin-alert {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 22px;
  padding: 12px 14px;

  border: 1px solid #f0cccc;
  border-radius: 10px;

  background: #fff4f4;
  color: #b42318;

  font-size: 12px;
}


.lep-admin-metrics {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 13px;

  margin-bottom: 25px;
}


.lep-admin-metric {
  position: relative;
  overflow: hidden;

  min-height: 125px;
  padding: 20px;

  background:
    rgba(255,255,255,.96);

  border: 1px solid #e2e8f0;
  border-radius: 15px;

  box-shadow:
    0 12px 30px
    rgba(26,54,93,.06);

  transition:
    transform .3s ease,
    box-shadow .3s ease;
}


.lep-admin-metric:hover {
  transform:
    translateY(-5px);

  box-shadow:
    0 22px 45px
    rgba(26,54,93,.11);
}


.lep-admin-metric-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}


.lep-admin-metric-icon {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #1a365d,
      #2c5f8a
    );

  color: #ff9348;

  box-shadow:
    0 9px 18px
    rgba(26,54,93,.14);
}


.lep-admin-metric small {
  color: #94a3b8;

  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1px;
}


.lep-admin-metric strong {
  display: block;

  margin-top: 6px;

  color: #1a365d;

  font-size: 29px;
}


.lep-admin-metric p {
  margin-top: 3px;

  color: #718096;

  font-size: 9px;
}


.lep-admin-section {
  margin-top: 24px;
  padding: 27px;

  background:
    rgba(255,255,255,.94);

  border: 1px solid #e2e8f0;
  border-radius: 18px;

  box-shadow:
    0 14px 35px
    rgba(26,54,93,.055);

  backdrop-filter: blur(12px);
}


.lep-admin-section-heading {
  margin-bottom: 20px;
}


.lep-admin-section-label {
  color: #ff6b00;

  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}


.lep-admin-section-heading h2 {
  margin-top: 6px;

  color: #1a365d;

  font-size: 25px;
  letter-spacing: -.6px;
}


.lep-admin-section-heading p {
  margin-top: 5px;

  color: #718096;

  font-size: 11px;
}


.lep-admin-management-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;
}


.lep-admin-management-card {
  min-height: 225px;
  padding: 20px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f3f7fa
    );

  border: 1px solid #e2e8f0;
  border-radius: 15px;

  box-shadow:
    0 9px 23px
    rgba(26,54,93,.045);

  transition:
    transform .3s ease,
    box-shadow .3s ease,
    border-color .3s ease;
}


.lep-admin-management-card:hover {
  transform:
    perspective(900px)
    rotateX(2deg)
    rotateY(-2deg)
    translateY(-7px);

  box-shadow:
    0 26px 50px
    rgba(26,54,93,.12);

  border-color:
    rgba(44,95,138,.25);
}


.lep-admin-management-card.featured {
  background:
    linear-gradient(
      145deg,
      #1a365d,
      #2c5f8a
    );

  color: #ffffff;
  border-color: transparent;
}


.lep-admin-management-card.featured h3 {
  color: #ffffff;
}


.lep-admin-management-card.featured p {
  color: #c8d6e3;
}


.lep-admin-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.lep-admin-icon-box {
  width: 48px;
  height: 48px;

  display: grid;
  place-items: center;

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      #1a365d,
      #2c5f8a
    );

  color: #ff9348;

  box-shadow:
    0 9px 0 #142b47,
    0 16px 27px
    rgba(26,54,93,.14);
}


.lep-admin-icon-box.orange {
  background:
    linear-gradient(
      145deg,
      #ff6b00,
      #e65f00
    );

  color: #ffffff;

  box-shadow:
    0 9px 0 #b84900,
    0 16px 27px
    rgba(255,107,0,.17);
}


.lep-admin-management-card h3 {
  margin-top: 18px;

  color: #1a365d;

  font-size: 18px;
}


.lep-admin-management-card.featured h3 {
  color: #ffffff;
}


.lep-admin-management-card p {
  min-height: 50px;

  margin-top: 7px;

  color: #718096;

  font-size: 10px;
  line-height: 1.65;
}


.lep-admin-management-card.featured p {
  color: #c8d6e3;
}


.lep-admin-featured-label {
  padding: 5px 7px;

  border-radius: 5px;

  background:
    rgba(255,255,255,.12);

  color: #ffc28d;

  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1px;
}


.lep-admin-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  margin-top: 17px;
}


.lep-admin-manage-btn,
.lep-admin-add-btn {
  min-height: 34px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 0 10px;

  border-radius: 8px;

  text-decoration: none;

  font-family: inherit;

  font-size: 9px;
  font-weight: 800;

  cursor: pointer;
}


.lep-admin-manage-btn {
  border: none;

  background: #eef3f8;
  color: #1a365d;
}


.lep-admin-management-card.featured
.lep-admin-manage-btn {
  background: #ffffff;
  color: #1a365d;
}


.lep-admin-add-btn {
  border: none;

  background: #1a365d;
  color: #ffffff;
}


.lep-admin-management-card.featured
.lep-admin-add-btn {
  background: #ff6b00;
  color: #ffffff;
}


.lep-admin-overview-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 10px;
}


.lep-admin-overview-item {
  padding: 17px;

  border: 1px solid #e2e8f0;
  border-radius: 11px;

  background: #f8fafc;
}


.lep-admin-overview-title {
  display: flex;
  align-items: center;
  gap: 6px;

  color: #94a3b8;

  font-size: 8px;
  font-weight: 900;
  letter-spacing: .8px;
}


.lep-admin-overview-title svg {
  color: #2c5f8a;
}


.lep-admin-overview-value {
  display: block;

  margin-top: 7px;

  color: #1a365d;

  font-size: 23px;
  font-weight: 900;
}


/* =========================================================
   MODULE PICKER
========================================================= */

.lep-module-overlay {
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: grid;
  place-items: center;

  padding: 20px;

  background:
    rgba(11, 28, 47, .60);

  backdrop-filter:
    blur(8px);
}


.lep-module-picker {
  width:
    min(
      760px,
      100%
    );

  max-height:
    min(
      680px,
      calc(100vh - 40px)
    );

  overflow-y: auto;

  padding: 25px;

  background:
    #ffffff;

  border:
    1px solid
    rgba(255,255,255,.45);

  border-radius: 20px;

  box-shadow:
    0 30px 80px
    rgba(0,0,0,.25);

  animation:
    lepPickerIn
    .22s ease;
}


@keyframes lepPickerIn {

  from {
    opacity: 0;

    transform:
      translateY(18px)
      scale(.97);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }

}


.lep-module-picker-header {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;
}


.lep-module-picker-header > div > span {
  color: #ff6b00;

  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.3px;
}


.lep-module-picker-header h2 {
  margin-top: 5px;

  color: #1a365d;

  font-size: 26px;
}


.lep-module-picker-header p {
  max-width: 560px;

  margin-top: 7px;

  color: #718096;

  font-size: 11px;

  line-height: 1.6;
}


.lep-module-picker-header strong {
  color: #1a365d;
}


.lep-module-close {
  width: 37px;
  height: 37px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid #dce4ec;
  border-radius: 9px;

  background: #f8fafc;

  color: #1a365d;

  font-size: 22px;

  cursor: pointer;
}


.lep-institution-picker-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;
}


.lep-institution-option {
  width: 100%;

  min-height: 78px;

  display: grid;

  grid-template-columns:
    45px
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 11px;

  padding: 12px;

  border:
    1px solid #e2e8f0;

  border-radius: 12px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f5f8fb
    );

  color: #1a365d;

  text-align: left;

  cursor: pointer;

  transition:
    transform .2s ease,
    border-color .2s ease,
    box-shadow .2s ease;
}


.lep-institution-option:hover {
  transform:
    translateY(-3px);

  border-color:
    rgba(44,95,138,.25);

  box-shadow:
    0 15px 30px
    rgba(26,54,93,.10);
}


.lep-institution-option-icon {
  width: 45px;
  height: 45px;

  display: grid;
  place-items: center;

  border-radius: 11px;

  background:
    linear-gradient(
      145deg,
      #1a365d,
      #2c5f8a
    );

  color: #ff9348;

  box-shadow:
    0 6px 0 #142b47;
}


.lep-institution-option strong {
  display: block;

  overflow: hidden;

  color: #1a365d;

  font-size: 11px;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.lep-institution-option span {
  display: block;

  margin-top: 4px;

  color: #94a3b8;

  font-size: 8px;
}


.lep-module-state {
  min-height: 230px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 30px;

  text-align: center;

  border:
    1px dashed #d9e1e9;

  border-radius: 13px;

  background: #f8fafc;

  color: #2c5f8a;
}


.lep-module-state h3 {
  margin-top: 10px;

  color: #1a365d;

  font-size: 16px;
}


.lep-module-state p {
  max-width: 420px;

  margin-top: 5px;

  color: #718096;

  font-size: 10px;

  line-height: 1.6;
}


.lep-module-state.error {
  color: #b42318;
}


.lep-module-retry {
  min-height: 37px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  margin-top: 14px;
  padding: 0 12px;

  border: none;
  border-radius: 8px;

  background:
    #1a365d;

  color: #ffffff;

  text-decoration: none;

  font-family: inherit;

  font-size: 9px;
  font-weight: 900;

  cursor: pointer;
}


@media (max-width: 1050px) {

  .lep-admin-management-grid {
    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }


  .lep-admin-metrics {
    grid-template-columns:
      repeat(2,1fr);
  }


  .lep-admin-overview-grid {
    grid-template-columns:
      repeat(2,1fr);
  }

}


@media (max-width: 700px) {

  .lep-admin-header {
    display: block;
  }


  .lep-admin-refresh {
    margin-top: 16px;
  }


  .lep-admin-management-grid,
  .lep-institution-picker-grid {
    grid-template-columns: 1fr;
  }


  .lep-admin-metrics,
  .lep-admin-overview-grid {
    grid-template-columns: 1fr;
  }


  .lep-admin-section {
    padding: 20px;
  }

}
`;

export default AdminDashboard;