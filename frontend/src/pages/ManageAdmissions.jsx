import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function ManageAdmissions() {
  const { id } = useParams();


  const [school, setSchool] =
    useState(null);

  const [admissions, setAdmissions] =
    useState([]);


  const [form, setForm] = useState({
    title: "",
    description: "",
    admission_status: "upcoming",
    application_start_date: "",
    application_end_date: "",
    session: "",
  });


  const [search, setSearch] =
    useState("");


  const [statusFilter, setStatusFilter] =
    useState("all");


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(null);


  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {
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


      if (!id) {
        throw new Error(
          "Institution ID is missing."
        );
      }


      const [
        schoolResponse,
        admissionResponse,
      ] = await Promise.all([

        fetch(
          `http://localhost:5000/api/admin/institutions/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `http://localhost:5000/api/admissions/institution/${id}`
        ),

      ]);


      const schoolData =
        await schoolResponse.json();


      const admissionData =
        await admissionResponse.json();


      if (
        !schoolResponse.ok ||
        !schoolData.success
      ) {

        throw new Error(
          schoolData.message ||
            "Failed to load institution."
        );

      }


      if (
        !admissionResponse.ok ||
        !admissionData.success
      ) {

        throw new Error(
          admissionData.message ||
            "Failed to load admissions."
        );

      }


      setSchool(
        schoolData.data?.institution
      );


      setAdmissions(
        admissionData.data?.admissions ||
          []
      );


    } catch (err) {

      console.error(
        "Load admissions error:",
        err
      );


      setError(
        err.message ||
          "Failed to load admission information."
      );


    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadData();
  }, [id]);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setForm({
      title: "",
      description: "",
      admission_status: "upcoming",
      application_start_date: "",
      application_end_date: "",
      session: "",
    });

  };


  // =========================================================
  // ADD ADMISSION
  // =========================================================

  const handleAddAdmission =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (!form.title.trim()) {

        setError(
          "Admission title is required."
        );

        return;
      }


      if (
        form.application_start_date &&
        form.application_end_date &&
        form.application_end_date <
          form.application_start_date
      ) {

        setError(
          "Application end date cannot be before the start date."
        );

        return;
      }


      try {

        setSaving(true);


        const token =
          localStorage.getItem(
            "authToken"
          );


        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }


        const response =
          await fetch(
            "http://localhost:5000/api/admissions",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },


              body: JSON.stringify({

                institution_id:
                  Number(id),

                title:
                  form.title.trim(),

                description:
                  form.description.trim() ||
                  null,

                admission_status:
                  form.admission_status,

                application_start_date:
                  form.application_start_date ||
                  null,

                application_end_date:
                  form.application_end_date ||
                  null,

                session:
                  form.session.trim() ||
                  null,

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
              "Failed to add admission."
          );

        }


        setSuccess(
          "Admission information added successfully."
        );


        resetForm();


        await loadData();


      } catch (err) {

        console.error(
          "Add admission error:",
          err
        );


        setError(
          err.message ||
            "Failed to add admission."
        );


      } finally {

        setSaving(false);

      }
    };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteAdmission =
    async (admissionId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this admission record?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeleting(
          admissionId
        );

        setError("");
        setSuccess("");


        const token =
          localStorage.getItem(
            "authToken"
          );


        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }


        const response =
          await fetch(
            `http://localhost:5000/api/admissions/${admissionId}`,
            {
              method: "DELETE",

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
              "Failed to delete admission."
          );

        }


        setSuccess(
          "Admission record deleted successfully."
        );


        await loadData();


      } catch (err) {

        console.error(
          "Delete admission error:",
          err
        );


        setError(
          err.message ||
            "Failed to delete admission."
        );


      } finally {

        setDeleting(null);

      }

    };


  // =========================================================
  // SEARCH + STATUS FILTER
  // =========================================================

  const filteredAdmissions =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      return admissions.filter(
        (admission) => {

          const matchesSearch =
            !query ||

            admission.title
              ?.toLowerCase()
              .includes(query) ||

            admission.session
              ?.toLowerCase()
              .includes(query) ||

            admission.description
              ?.toLowerCase()
              .includes(query);


          const matchesStatus =
            statusFilter === "all" ||
            admission.admission_status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      admissions,
      search,
      statusFilter,
    ]);


  // =========================================================
  // COUNTS
  // =========================================================

  const openCount =
    admissions.filter(
      (item) =>
        item.admission_status ===
        "open"
    ).length;


  const upcomingCount =
    admissions.filter(
      (item) =>
        item.admission_status ===
        "upcoming"
    ).length;


  const closedCount =
    admissions.filter(
      (item) =>
        item.admission_status ===
        "closed"
    ).length;


  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (value) => {

    if (!value) {
      return "Not set";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }


    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusIcon = (
    status
  ) => {

    if (
      status === "open"
    ) {
      return "verified";
    }


    if (
      status === "closed"
    ) {
      return "warning";
    }


    return "calendar";

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-admissions-page">

          <div className="lep-admissions-container">

            <div className="lep-admissions-state">

              <div className="lep-admissions-state-icon">

                <SmartIcon
                  name="admissions"
                  size={28}
                />

              </div>


              <span className="lep-admissions-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Loading Admissions...
              </h1>


              <p>
                Please wait while we load
                the admission information.
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

  if (!school) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-admissions-page">

          <div className="lep-admissions-container">

            <div className="lep-admissions-state">

              <div className="lep-admissions-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-admissions-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Institution Not Found
              </h1>


              <p>
                {error ||
                  "The institution could not be loaded."}
              </p>


              <Link
                to="/admin/schools"
                className="lep-admissions-primary"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Back to Schools

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>


      <main className="lep-admissions-page">

        <div className="lep-admissions-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-admissions-header">


            <div className="lep-admissions-heading">


              <div className="lep-admissions-page-icon">

                <SmartIcon
                  name="admissions"
                  size={29}
                />

              </div>


              <div>

                <span className="lep-admissions-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  ADMISSIONS MANAGEMENT

                </span>


                <h1>
                  Admissions
                </h1>


                <p>

                  Manage verified admission
                  information for{" "}

                  <strong>
                    {school.name}
                  </strong>.

                </p>

              </div>

            </div>


            <Link
              to={`/admin/schools/${id}/manage`}
              className="lep-admissions-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Manage School

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-admissions-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-admissions-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              METRICS
          ===================================================== */}

          <section className="lep-admissions-metrics">


            <div className="lep-admissions-metric">

              <div className="lep-admissions-metric-icon">

                <SmartIcon
                  name="admissions"
                  size={19}
                />

              </div>


              <span>
                TOTAL RECORDS
              </span>


              <strong>
                {admissions.length}
              </strong>

            </div>


            <div className="lep-admissions-metric">

              <div className="lep-admissions-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                OPEN
              </span>


              <strong>
                {openCount}
              </strong>

            </div>


            <div className="lep-admissions-metric">

              <div className="lep-admissions-metric-icon">

                <SmartIcon
                  name="calendar"
                  size={19}
                />

              </div>


              <span>
                UPCOMING
              </span>


              <strong>
                {upcomingCount}
              </strong>

            </div>


            <div className="lep-admissions-metric">

              <div className="lep-admissions-metric-icon">

                <SmartIcon
                  name="warning"
                  size={19}
                />

              </div>


              <span>
                CLOSED
              </span>


              <strong>
                {closedCount}
              </strong>

            </div>

          </section>


          {/* =====================================================
              ADMISSION DIRECTORY
          ===================================================== */}

          <section className="lep-admissions-section">


            <div className="lep-admissions-section-header">


              <div className="lep-admissions-section-icon">

                <SmartIcon
                  name="admissions"
                  size={21}
                />

              </div>


              <div>

                <span>
                  ADMISSION DIRECTORY
                </span>


                <h2>
                  Admission Records
                </h2>


                <p>
                  Current and upcoming admission
                  information verified by the institution.
                </p>

              </div>

            </div>


            {admissions.length > 0 && (

              <div className="lep-admissions-filter">


                <div className="lep-admissions-search">

                  <SmartIcon
                    name="search"
                    size={16}
                  />


                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search admission, session or details..."
                  />

                </div>


                <select
                  value={
                    statusFilter
                  }
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="lep-admissions-status-filter"
                >

                  <option value="all">
                    All Statuses
                  </option>

                  <option value="open">
                    Open
                  </option>

                  <option value="upcoming">
                    Upcoming
                  </option>

                  <option value="closed">
                    Closed
                  </option>

                </select>


                <div className="lep-admissions-filter-count">

                  <span>
                    SHOWING
                  </span>

                  <strong>
                    {
                      filteredAdmissions.length
                    }
                  </strong>

                </div>

              </div>

            )}


            {admissions.length === 0 ? (

              <div className="lep-admissions-empty">

                <div className="lep-admissions-empty-icon">

                  <SmartIcon
                    name="admissions"
                    size={28}
                  />

                </div>


                <h3>
                  No Admissions Added
                </h3>


                <p>
                  Add the school's current
                  or upcoming admission information.
                </p>

              </div>

            ) : filteredAdmissions.length === 0 ? (

              <div className="lep-admissions-empty">

                <div className="lep-admissions-empty-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h3>
                  No Matching Admissions
                </h3>


                <p>
                  Try another search term
                  or change the status filter.
                </p>

              </div>

            ) : (

              <div className="lep-admissions-list">


                {filteredAdmissions.map(
                  (admission) => {

                    const deletingThis =
                      deleting ===
                      admission.id;


                    const status =
                      admission.admission_status ||
                      "upcoming";


                    return (

                      <article
                        key={
                          admission.id
                        }
                        className="lep-admission-card"
                      >


                        <div className="lep-admission-icon">

                          <SmartIcon
                            name="admissions"
                            size={22}
                          />

                        </div>


                        <div className="lep-admission-content">


                          <div className="lep-admission-title">

                            <h3>
                              {
                                admission.title
                              }
                            </h3>


                            <span
                              className={
                                `lep-admission-status ${status}`
                              }
                            >

                              <SmartIcon
                                name={
                                  getStatusIcon(
                                    status
                                  )
                                }
                                size={10}
                              />

                              {status}

                            </span>

                          </div>


                          <div className="lep-admission-meta">

                            <span>

                              <SmartIcon
                                name="calendar"
                                size={11}
                              />

                              Session:{" "}
                              {
                                admission.session ||
                                "Not specified"
                              }

                            </span>


                            <span>

                              <SmartIcon
                                name="document"
                                size={11}
                              />

                              Applications:
                              {" "}
                              {
                                formatDate(
                                  admission.application_start_date
                                )
                              }
                              {" — "}
                              {
                                formatDate(
                                  admission.application_end_date
                                )
                              }

                            </span>

                          </div>


                          {admission.description && (

                            <p className="lep-admission-description">

                              {
                                admission.description
                              }

                            </p>

                          )}

                        </div>


                        <div className="lep-admission-actions">


                          <button
                            type="button"
                            className="lep-admission-delete"
                            onClick={() =>
                              handleDeleteAdmission(
                                admission.id
                              )
                            }
                            disabled={
                              deletingThis
                            }
                          >

                            <SmartIcon
                              name="delete"
                              size={12}
                            />

                            {deletingThis
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        </div>


                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>


          {/* =====================================================
              ADD ADMISSION
          ===================================================== */}

          <section className="lep-admissions-section">


            <div className="lep-admissions-section-header">


              <div className="lep-admissions-section-icon">

                <SmartIcon
                  name="plus"
                  size={21}
                />

              </div>


              <div>

                <span>
                  ADD ADMISSION
                </span>


                <h2>
                  New Admission Record
                </h2>


                <p>
                  Add current or upcoming
                  admission information.
                </p>

              </div>

            </div>


            <form
              className="lep-admissions-form"
              onSubmit={
                handleAddAdmission
              }
            >


              <div className="lep-admissions-grid">


                {/* TITLE */}

                <div className="lep-admission-field">

                  <label>

                    <SmartIcon
                      name="admissions"
                      size={14}
                    />

                    Admission Title *

                  </label>


                  <input
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2026 Admissions"
                    required
                  />

                </div>


                {/* SESSION */}

                <div className="lep-admission-field">

                  <label>

                    <SmartIcon
                      name="calendar"
                      size={14}
                    />

                    Session

                  </label>


                  <input
                    name="session"
                    value={
                      form.session
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2026-2027"
                  />

                </div>


                {/* STATUS */}

                <div className="lep-admission-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={14}
                    />

                    Admission Status

                  </label>


                  <select
                    name="admission_status"
                    value={
                      form.admission_status
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="open">
                      Open
                    </option>

                    <option value="upcoming">
                      Upcoming
                    </option>

                    <option value="closed">
                      Closed
                    </option>

                  </select>

                </div>


                {/* START DATE */}

                <div className="lep-admission-field">

                  <label>

                    <SmartIcon
                      name="calendar"
                      size={14}
                    />

                    Application Start

                  </label>


                  <input
                    type="date"
                    name="application_start_date"
                    value={
                      form.application_start_date
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                {/* END DATE */}

                <div className="lep-admission-field">

                  <label>

                    <SmartIcon
                      name="calendar"
                      size={14}
                    />

                    Application End

                  </label>


                  <input
                    type="date"
                    name="application_end_date"
                    value={
                      form.application_end_date
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="lep-admission-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Description

                  </label>


                  <textarea
                    name="description"
                    rows="6"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Admission details, eligibility, documents required, important instructions, etc."
                  />

                </div>

              </div>


              <div className="lep-admissions-form-actions">


                <div className="lep-admissions-note">

                  <SmartIcon
                    name="verified"
                    size={15}
                  />

                  <span>
                    Add only verified admission
                    information.
                  </span>

                </div>


                <button
                  type="submit"
                  className="lep-admissions-save"
                  disabled={
                    saving
                  }
                >

                  <SmartIcon
                    name={
                      saving
                        ? "settings"
                        : "plus"
                    }
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : "Add Admission"}

                </button>

              </div>

            </form>

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

  .lep-admissions-page {
    min-height: 100vh;

    padding: 45px 0 90px;

    background:
      radial-gradient(
        circle at 90% 5%,
        rgba(44,95,138,.12),
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
  }


  .lep-admissions-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* HEADER */

  .lep-admissions-header {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      24px;

    margin-bottom:
      25px;
  }


  .lep-admissions-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-admissions-page-icon {
    width:
      60px;

    height:
      60px;

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
      0 18px 32px
      rgba(26,54,93,.18);

    transform:
      perspective(700px)
      rotateX(4deg)
      rotateY(-4deg);
  }


  .lep-admissions-eyebrow {
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


  .lep-admissions-heading h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      clamp(
        35px,
        5vw,
        52px
      );

    line-height:
      1;

    letter-spacing:
      -1.8px;
  }


  .lep-admissions-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-admissions-heading p strong {
    color:
      #1a365d;
  }


  .lep-admissions-back {
    min-height:
      42px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    padding:
      0 13px;

    border:
      1px solid #dce4ec;

    border-radius:
      9px;

    background:
      #ffffff;

    color:
      #1a365d;

    text-decoration:
      none;

    font-size:
      10px;

    font-weight:
      900;
  }


  .lep-admissions-back:hover {
    border-color:
      #2c5f8a;
  }


  /* MESSAGES */

  .lep-admissions-message {
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

    border-radius:
      9px;

    font-size:
      10px;

    font-weight:
      800;
  }


  .lep-admissions-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-admissions-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* METRICS */

  .lep-admissions-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-admissions-metric {
    min-height:
      116px;

    padding:
      18px;

    background:
      #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius:
      14px;

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.055);

    transition:
      transform .3s ease,
      box-shadow .3s ease;
  }


  .lep-admissions-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-admissions-metric-icon {
    width:
      39px;

    height:
      39px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      10px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-admissions-metric span {
    display:
      block;

    margin-top:
      9px;

    color:
      #94a3b8;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1px;
  }


  .lep-admissions-metric strong {
    display:
      block;

    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  /* SECTION */

  .lep-admissions-section {
    margin-top:
      17px;

    padding:
      25px;

    background:
      rgba(255,255,255,.96);

    border:
      1px solid #e2e8f0;

    border-radius:
      17px;

    box-shadow:
      0 12px 30px
      rgba(26,54,93,.055);
  }


  .lep-admissions-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      20px;
  }


  .lep-admissions-section-icon {
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
      0 14px 25px
      rgba(26,54,93,.13);
  }


  .lep-admissions-section-header span {
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


  .lep-admissions-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-admissions-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.5;
  }


  /* FILTER */

  .lep-admissions-filter {
    display:
      grid;

    grid-template-columns:
      minmax(0,1fr)
      180px
      100px;

    gap:
      9px;

    margin-bottom:
      15px;
  }


  .lep-admissions-search {
    min-height:
      46px;

    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    padding:
      0 13px;

    border:
      1px solid #e2e8f0;

    border-radius:
      9px;

    background:
      #fbfdff;
  }


  .lep-admissions-search svg {
    color:
      #2c5f8a;
  }


  .lep-admissions-search input {
    width:
      100%;

    border:
      none;

    outline:
      none;

    background:
      transparent;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      11px;
  }


  .lep-admissions-status-filter {
    min-height:
      46px;

    padding:
      0 10px;

    border:
      1px solid #e2e8f0;

    border-radius:
      9px;

    background:
      #ffffff;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      10px;

    outline:
      none;
  }


  .lep-admissions-filter-count {
    min-height:
      46px;

    display:
      flex;

    flex-direction:
      column;

    justify-content:
      center;

    padding:
      0 11px;

    border-radius:
      9px;

    background:
      #1a365d;
  }


  .lep-admissions-filter-count span {
    color:
      #aebfce;

    font-size:
      7px;

    font-weight:
      900;
  }


  .lep-admissions-filter-count strong {
    color:
      #ff9348;

    font-size:
      17px;
  }


  /* ADMISSION CARDS */

  .lep-admissions-list {
    display:
      grid;

    gap:
      10px;
  }


  .lep-admission-card {
    display:
      grid;

    grid-template-columns:
      50px
      minmax(0,1fr)
      auto;

    gap:
      13px;

    align-items:
      center;

    padding:
      15px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f4f8fb
      );

    border:
      1px solid #e2e8f0;

    border-radius:
      13px;

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }


  .lep-admission-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 17px 34px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-admission-icon {
    width:
      50px;

    height:
      50px;

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


  .lep-admission-title {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-admission-title h3 {
    color:
      #1a365d;

    font-size:
      15px;
  }


  .lep-admission-status {
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

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-admission-status.open {
    background:
      #eaf7ee;

    color:
      #16803c;
  }


  .lep-admission-status.upcoming {
    background:
      #eef4ff;

    color:
      #2563eb;
  }


  .lep-admission-status.closed {
    background:
      #fff1e9;

    color:
      #b25c00;
  }


  .lep-admission-meta {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      10px;

    margin-top:
      6px;
  }


  .lep-admission-meta span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    color:
      #718096;

    font-size:
      8px;

    line-height:
      1.5;
  }


  .lep-admission-description {
    margin-top:
      6px;

    color:
      #94a3b8;

    font-size:
      9px;

    line-height:
      1.6;
  }


  .lep-admission-delete {
    min-height:
      35px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      5px;

    padding:
      0 10px;

    border:
      1px solid #f0caca;

    border-radius:
      8px;

    background:
      #fff7f7;

    color:
      #b42318;

    font-family:
      inherit;

    font-size:
      8px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  /* EMPTY */

  .lep-admissions-empty,
  .lep-admissions-state {
    min-height:
      270px;

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

    border:
      1px solid #e7edf2;

    border-radius:
      13px;

    background:
      #f9fbfd;
  }


  .lep-admissions-empty-icon,
  .lep-admissions-state-icon {
    width:
      58px;

    height:
      58px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      13px;

    border-radius:
      14px;

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
      rgba(26,54,93,.14);
  }


  .lep-admissions-empty h3,
  .lep-admissions-state h1 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-admissions-empty p,
  .lep-admissions-state p {
    max-width:
      480px;

    margin-top:
      7px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.6;
  }


  .lep-admissions-primary {
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
      0 13px;

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


  /* FORM */

  .lep-admissions-form {
    display:
      grid;

    gap:
      15px;
  }


  .lep-admissions-grid {
    display:
      grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap:
      13px;
  }


  .lep-admission-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-admission-field.full {
    grid-column:
      1 / -1;
  }


  .lep-admission-field label {
    display:
      flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #475569;

    font-size:
      9px;

    font-weight:
      900;
  }


  .lep-admission-field label svg {
    color:
      #2c5f8a;
  }


  .lep-admission-field input,
  .lep-admission-field select,
  .lep-admission-field textarea {
    width:
      100%;

    padding:
      12px 13px;

    border:
      1px solid #dfe6ed;

    border-radius:
      9px;

    background:
      #fbfdff;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      11px;

    outline:
      none;

    transition:
      border-color .2s ease,
      box-shadow .2s ease;
  }


  .lep-admission-field input:focus,
  .lep-admission-field select:focus,
  .lep-admission-field textarea:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-admission-field textarea {
    min-height:
      115px;

    resize:
      vertical;

    line-height:
      1.65;
  }


  .lep-admissions-form-actions {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      15px;

    padding:
      17px 18px;

    border-radius:
      13px;

    background:
      #1a365d;
  }


  .lep-admissions-note {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    color:
      #c8d6e3;

    font-size:
      9px;
  }


  .lep-admissions-note svg {
    color:
      #ff9348;
  }


  .lep-admissions-save {
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

    padding:
      0 14px;

    border:
      none;

    border-radius:
      9px;

    background:
      #ff6b00;

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
  }


  .lep-admissions-save:hover {
    background:
      #e65f00;
  }


  /* RESPONSIVE */

  @media (max-width: 900px) {

    .lep-admissions-header {
      display:
        block;
    }


    .lep-admissions-back {
      margin-top:
        16px;
    }


    .lep-admissions-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-admissions-filter {
      grid-template-columns:
        1fr;
    }


    .lep-admission-card {
      grid-template-columns:
        50px
        minmax(0,1fr);
    }


    .lep-admission-actions {
      grid-column:
        1 / -1;
    }

  }


  @media (max-width: 650px) {

    .lep-admissions-heading {
      align-items:
        flex-start;
    }


    .lep-admissions-heading h1 {
      font-size:
        37px;
    }


    .lep-admissions-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-admissions-grid {
      grid-template-columns:
        1fr;
    }


    .lep-admission-field.full {
      grid-column:
        auto;
    }


    .lep-admissions-section {
      padding:
        19px;
    }


    .lep-admissions-form-actions {
      display:
        block;
    }


    .lep-admissions-save {
      width:
        100%;

      margin-top:
        12px;
    }

  }

`;

export default ManageAdmissions;