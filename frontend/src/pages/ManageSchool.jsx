import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ManageSchool() {
  const { id } = useParams();

  const [school, setSchool] = useState(null);
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchool = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error(
          "Please login as administrator."
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/institutions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load school."
        );
      }

      setSchool(
        data.data?.institution
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load school."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/programs/institution/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return;
      }

      setPrograms(
        data.data?.programs || []
      );
    } catch (err) {
      console.error(
        "Program loading error:",
        err
      );
    }
  };

  useEffect(() => {
    loadSchool();
    loadPrograms();
  }, [id]);

  if (loading) {
    return (
      <main className="manage-school-page">
        <div className="container">

          <div className="manage-school-loading">

            <span className="official-label">
              ADMINISTRATION
            </span>

            <h1>
              Loading School...
            </h1>

          </div>

        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="manage-school-page">
        <div className="container">

          <div className="manage-school-error">

            <span className="official-label">
              ADMINISTRATION
            </span>

            <h1>
              School Not Found
            </h1>

            <p>
              {error ||
                "The requested school could not be loaded."}
            </p>

            <Link
              to="/admin/schools"
              className="secondary-btn"
            >
              ← Back to Schools
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="manage-school-page">

      <div className="container">

        {/* HEADER */}

        <div className="manage-school-header">

          <div>

            <span className="official-label">
              ADMINISTRATION
            </span>

            <h1>
              {school.name}
            </h1>

            <p>
              Manage all information collected for
              this institution.
            </p>

          </div>

          <div className="manage-school-header-actions">

            <Link
              to="/admin/schools"
              className="secondary-btn"
            >
              ← Schools
            </Link>

            <Link
              to={`/admin/schools/${id}/edit`}
              className="secondary-btn"
            >
              
              Edit School
            </Link>
<Link
  to={`/admin/schools/${id}/programs`}
  className="manage-module-card manage-module-card-active"
></Link>
          </div>

        </div>


        {/* SCHOOL SUMMARY */}

        <section className="manage-school-summary">

          <div className="manage-summary-card">

            <span>
              STATUS
            </span>

            <strong>
              {school.status}
            </strong>

          </div>


          <div className="manage-summary-card">

            <span>
              VERIFICATION
            </span>

            <strong>
              {school.verification_status}
            </strong>

          </div>


          <div className="manage-summary-card">

            <span>
              STUDENTS
            </span>

            <strong>
              {school.student_count ?? 0}
            </strong>

          </div>


          <div className="manage-summary-card">

            <span>
              TEACHERS
            </span>

            <strong>
              {school.teacher_count ?? 0}
            </strong>

          </div>

        </section>


        {/* MAIN MANAGEMENT */}

        <section className="manage-school-section">

          <div className="manage-section-title">

            <div>

              <span className="official-label">
                SCHOOL DATA
              </span>

              <h2>
                Manage Detailed Information
              </h2>

              <p>
                Manage everything you collected during
                your school visit.
              </p>

            </div>

          </div>


          <div className="manage-module-grid">

            {/* PROGRAMS */}

            <Link
              to={`/admin/schools/${id}/manage`}
              className="manage-module-card manage-module-card-active"
            >

              <div className="manage-module-icon">
                P
              </div>

              <h3>
                Academic Programs
              </h3>

              <p>
                Add and manage classes and academic
                programs offered by this school.
              </p>

              <span>
                {programs.length}{" "}
                {programs.length === 1
                  ? "program"
                  : "programs"}{" "}
                →
              </span>

            </Link>


            {/* TEACHERS */}

            <Link
              to={`/admin/schools/${id}/teachers`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                T
              </div>

              <h3>
                Teachers
              </h3>

              <p>
                Add and manage verified teacher and
                faculty information.
              </p>

              <span>
                Manage Teachers →
              </span>

            </Link>


            {/* FACILITIES */}

            <Link
              to={`/admin/schools/${id}/facilities`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                F
              </div>

              <h3>
                Facilities
              </h3>

              <p>
                Manage laboratories, library, playground
                and other facilities.
              </p>

              <span>
                Manage Facilities →
              </span>

            </Link>


            {/* CONTACTS */}

            <Link
              to={`/admin/schools/${id}/contacts`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                C
              </div>

              <h3>
                Contacts
              </h3>

              <p>
                Manage phone, WhatsApp, email, website
                and other official contacts.
              </p>

              <span>
                Manage Contacts →
              </span>

            </Link>


            {/* FEES */}

            <Link
              to={`/admin/schools/${id}/fees`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                F
              </div>

              <h3>
                Fees
              </h3>

              <p>
                Add tuition, admission, transport and
                other verified fee information.
              </p>

              <span>
                Manage Fees →
              </span>

            </Link>


            {/* ADMISSIONS */}

            <Link
              to={`/admin/schools/${id}/admissions`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                A
              </div>

              <h3>
                Admissions
              </h3>

              <p>
                Manage current and upcoming admission
                information.
              </p>

              <span>
                Manage Admissions →
              </span>

            </Link>


            {/* EDIT SCHOOL */}

            <Link
              to={`/admin/schools/${id}/edit`}
              className="manage-module-card"
            >

              <div className="manage-module-icon">
                E
              </div>

              <h3>
                Edit School
              </h3>

              <p>
                Update the main information collected
                during your school visit.
              </p>

              <span>
                Edit School →
              </span>

            </Link>

          </div>

        </section>


        {/* BASIC SCHOOL INFORMATION */}

        <section className="manage-school-section">

          <div className="manage-section-title">

            <div>

              <span className="official-label">
                SCHOOL INFORMATION
              </span>

              <h2>
                Basic Details
              </h2>

            </div>

          </div>


          <div className="manage-basic-grid">

            <div>
              <span>
                Institution Type
              </span>

              <strong>
                {school.institution_type}
              </strong>
            </div>


            <div>
              <span>
                Ownership
              </span>

              <strong>
                {school.ownership_type}
              </strong>
            </div>


            <div>
              <span>
                Gender Type
              </span>

              <strong>
                {school.gender_type}
              </strong>
            </div>


            <div>
              <span>
                Principal
              </span>

              <strong>
                {school.principal_name ||
                  "Not provided"}
              </strong>
            </div>


            <div>
              <span>
                Established Year
              </span>

              <strong>
                {school.established_year ||
                  "Not provided"}
              </strong>
            </div>


            <div>
              <span>
                Phone
              </span>

              <strong>
                {school.phone ||
                  "Not provided"}
              </strong>
            </div>


            <div>
              <span>
                Email
              </span>

              <strong>
                {school.email ||
                  "Not provided"}
              </strong>
            </div>


            <div>
              <span>
                Area
              </span>

              <strong>
                {school.area ||
                  "Not provided"}
              </strong>
            </div>


            <div>
              <span>
                City
              </span>

              <strong>
                {school.city}
              </strong>
            </div>


            <div>
              <span>
                District
              </span>

              <strong>
                {school.district}
              </strong>
            </div>

          </div>

        </section>


        {/* ADDRESS */}

        <section className="manage-school-section">

          <div className="manage-section-title">

            <div>

              <span className="official-label">
                LOCATION
              </span>

              <h2>
                School Address
              </h2>

            </div>

          </div>


          <div className="manage-address-box">

            <p>
              {school.address}
            </p>

            <span>
              {school.city},{" "}
              {school.district},{" "}
              {school.province},{" "}
              {school.country}
            </span>

            {(school.latitude !== null &&
              school.longitude !== null) && (
              <span>
                Coordinates:{" "}
                {school.latitude},{" "}
                {school.longitude}
              </span>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

export default ManageSchool;