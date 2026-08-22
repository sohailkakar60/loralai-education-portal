import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_URL from "../config/api";


function AdminSchools() {
  const [schools, setSchools] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD SCHOOLS
  // =========================================================

  const loadSchools = async () => {
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

      const response =
        await fetch(
          `${API_URL}/api/admin/institutions`,
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
            "Failed to load schools."
        );
      }

      const allInstitutions =
        data.data?.institutions || [];

      // Only show schools on this page
      const schoolInstitutions =
        allInstitutions.filter(
          (institution) =>
            institution.institution_type ===
            "school"
        );

      setSchools(
        schoolInstitutions
      );

    } catch (err) {
      console.error(
        "Load schools error:",
        err
      );

      setError(
        err.message ||
          "Failed to load schools."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSchools();
  }, []);


  // =========================================================
  // APPROVE SCHOOL
  // =========================================================

  const handleApprove = async (
    schoolId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to approve this school? It will become publicly visible."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        schoolId
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
          `${API_URL}/api/admin/institutions/${schoolId}/approve`,
          {
            method: "PUT",

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
            "Failed to approve school."
        );
      }

      setSuccess(
        "School approved and published successfully."
      );

      await loadSchools();

    } catch (err) {
      console.error(
        "Approve school error:",
        err
      );

      setError(
        err.message ||
          "Failed to approve school."
      );

    } finally {
      setActionLoading(null);
    }
  };


  return (
    <main className="admin-schools-page">

      <div className="container">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="admin-schools-header">

          <div>

            <span className="official-label">
              ADMINISTRATION
            </span>

            <h1>
              Manage Schools
            </h1>

            <p>
              View, edit and verify the school information
              you have collected.
            </p>

          </div>


          <div className="admin-schools-header-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={
                loadSchools
              }
              disabled={
                loading
              }
            >
              Refresh
            </button>


            <Link
              to="/admin/schools/add"
              className="dashboard-primary-btn"
            >
              + Add School
            </Link>

          </div>

        </div>


        {/* =====================================================
            MESSAGES
        ===================================================== */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {success && (
          <div className="form-success">
            {success}
          </div>
        )}


        {/* =====================================================
            LOADING / EMPTY / LIST
        ===================================================== */}

        {loading ? (

          <div className="admin-schools-state">
            Loading schools...
          </div>

        ) : schools.length === 0 ? (

          <div className="admin-schools-state">

            <h3>
              No Schools Yet
            </h3>

            <p>
              Start by adding a school you have
              personally visited.
            </p>

            <Link
              to="/admin/schools/add"
              className="dashboard-primary-btn"
            >
              + Add First School
            </Link>

          </div>

        ) : (

          <div className="admin-school-list">

            {schools.map(
              (school) => (

                <article
                  key={
                    school.id
                  }
                  className="admin-school-card"
                >

                  {/* =================================================
                      MAIN INFORMATION
                  ================================================= */}

                  <div className="admin-school-card-main">

                    <div className="admin-school-icon">

                      {school.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "S"}

                    </div>


                    <div>

                      <div className="admin-school-title-row">

                        <h2>
                          {school.name}
                        </h2>


                        <span
                          className={
                            `school-status-badge status-${school.status}`
                          }
                        >
                          {school.status}
                        </span>

                      </div>


                      <p>
                        {school.institution_type}
                        {" • "}
                        {school.ownership_type}
                      </p>


                      <p>
                        {school.area
                          ? `${school.area}, `
                          : ""}

                        {school.city},{" "}

                        {school.district}
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      META
                  ================================================= */}

                  <div className="admin-school-meta">

                    <div>

                      <span>
                        Verification
                      </span>

                      <strong>
                        {
                          school.verification_status
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Students
                      </span>

                      <strong>
                        {
                          school.student_count ??
                          0
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Teachers
                      </span>

                      <strong>
                        {
                          school.teacher_count ??
                          0
                        }
                      </strong>

                    </div>

                  </div>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="admin-school-actions">

                    <Link
                      to={
                        `/admin/schools/${school.id}/edit`
                      }
                      className="secondary-btn"
                    >
                      Edit
                    </Link>


                    <Link
                      to={
                        `/schools/${school.slug}`
                      }
                      className="secondary-btn"
                    >
                      View
                    </Link>


                    <Link
                      to={
                        `/admin/schools/${school.id}/manage`
                      }
                      className="secondary-btn"
                    >
                      Manage
                    </Link>


                    <Link
                      to="/admin/schools/add"
                      className="dashboard-primary-btn"
                    >
                      + Add School
                    </Link>


                    <Link
                      to="/admin/schools/add"
                      className="dashboard-primary-btn"
                    >
                      + Add First School
                    </Link>


                    {school.status !==
                    "approved" ? (

                      <button
                        type="button"
                        className="dashboard-primary-btn"
                        onClick={() =>
                          handleApprove(
                            school.id
                          )
                        }
                        disabled={
                          actionLoading ===
                          school.id
                        }
                      >

                        {
                          actionLoading ===
                          school.id
                            ? "Approving..."
                            : "Approve"
                        }

                      </button>

                    ) : (

                      <span className="approved-label">
                        ✓ Published
                      </span>

                    )}

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}


export default AdminSchools;