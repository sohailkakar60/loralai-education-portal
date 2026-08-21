import ReviewForm from "../components/ReviewForm";
import ReviewsSection from "../components/ReviewsSection";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function SchoolDetails() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchool = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/public/institutions/${slug}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load school."
          );
        }

        setData(result.data);
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

    loadSchool();
  }, [slug]);

  if (loading) {
    return (
      <main className="school-details-page">
        <div className="container">
          <div className="page-heading">
            <span className="official-label">
              LORALAI EDUCATION PORTAL
            </span>

            <h1>
              Loading School...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="school-details-page">
        <div className="container">
          <div className="school-details-error">
            <span className="official-label">
              LORALAI EDUCATION PORTAL
            </span>

            <h1>
              School Not Found
            </h1>

            <p>
              {error ||
                "The requested school could not be found."}
            </p>

            <Link
              to="/schools"
              className="dashboard-primary-btn"
            >
              ← Back to Schools
            </Link>
          </div>
        </div>
      </main>
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
    <main className="school-details-page">

      <section className="school-details-hero">

        <div className="container">

          <Link
            to="/schools"
            className="school-back-link"
          >
            ← Back to Schools
          </Link>

          <div className="school-details-heading">

            <div className="school-details-logo">
              {institution.logo_url ? (
                <img
                  src={`http://localhost:5000${institution.logo_url}`}
                  alt={institution.name}
                />
              ) : (
                institution.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"
              )}
            </div>

            <div>

              <span className="school-profile-verified-badge">
  ✓ Verified Institution
</span>

              <h1>
                {institution.name}
              </h1>

              <p>
                📍{" "}
                {institution.area
                  ? `${institution.area}, `
                  : ""}
                {institution.city},{" "}
                {institution.district}
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="school-details-content">

        <div className="container">

          <div className="school-details-layout">

            <div className="school-details-main">

              {/* ABOUT */}

              <section className="detail-card">

                <span className="detail-label">
                  ABOUT
                </span>

                <h2>
                  About the Institution
                </h2>

                <p>
                  {institution.description ||
                    "No description has been added yet."}
                </p>

              </section>


              {/* OVERVIEW */}

              <section className="detail-card">

                <span className="detail-label">
                  OVERVIEW
                </span>

                <h2>
                  School Information
                </h2>

                <div className="detail-grid">

                  <div>
                    <span>
                      Ownership
                    </span>

                    <strong>
                      {institution.ownership_type ||
                        "Not listed"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Gender Type
                    </span>

                    <strong>
                      {institution.gender_type ||
                        "Not listed"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Principal
                    </span>

                    <strong>
                      {institution.principal_name ||
                        "Not listed"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Established
                    </span>

                    <strong>
                      {institution.established_year ||
                        "Not listed"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Students
                    </span>

                    <strong>
                      {institution.student_count ?? 0}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Teachers
                    </span>

                    <strong>
                      {institution.teacher_count ?? 0}
                    </strong>
                  </div>

                </div>

              </section>


              {/* PROGRAMS */}

              <section className="detail-card">

                <span className="detail-label">
                  ACADEMICS
                </span>

                <h2>
                  Academic Programs
                </h2>

                {programs.length === 0 ? (
                  <p>
                    No academic programs available.
                  </p>
                ) : (
                  <div className="detail-list">

                    {programs.map((program) => (
                      <div
                        key={program.id}
                        className="detail-list-item"
                      >
                        <strong>
                          {program.name}
                        </strong>

                        <span>
                          {program.level ||
                            "Program"}
                        </span>
                      </div>
                    ))}

                  </div>
                )}

              </section>


              {/* TEACHERS */}

              <section className="detail-card">

                <span className="detail-label">
                  FACULTY
                </span>

                <h2>
                  Teachers
                </h2>

                {teachers.length === 0 ? (
                  <p>
                    No teacher information available.
                  </p>
                ) : (
                  <div className="teacher-grid">

                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="teacher-public-card"
                      >

                        <div className="teacher-public-avatar">
                          {teacher.profile_photo_url ? (
                            <img
                              src={`http://localhost:5000${teacher.profile_photo_url}`}
                              alt={teacher.full_name}
                            />
                          ) : (
                            teacher.full_name
                              ?.charAt(0)
                              ?.toUpperCase() || "T"
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
                          {teacher.subject ||
                            teacher.specialization ||
                            "Teacher"}
                        </span>

                      </div>
                    ))}

                  </div>
                )}

              </section>


              {/* FACILITIES */}

              <section className="detail-card">

                <span className="detail-label">
                  FACILITIES
                </span>

                <h2>
                  Facilities
                </h2>

                {facilities.length === 0 ? (
                  <p>
                    No facilities available.
                  </p>
                ) : (
                  <div className="facility-public-list">

                    {facilities.map((facility) => (
                      <div
                        key={facility.id}
                        className="facility-public-item"
                      >
                        ✓{" "}
                        {facility.facility_name}
                      </div>
                    ))}

                  </div>
                )}

              </section>


              {/* FEES */}

              <section className="detail-card">

                <span className="detail-label">
                  FEES
                </span>

                <h2>
                  Fee Information
                </h2>

                {fees.length === 0 ? (
                  <p>
                    No public fee information available.
                  </p>
                ) : (
                  <div className="detail-list">

                    {fees.map((fee) => (
                      <div
                        key={fee.id}
                        className="detail-list-item"
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
                    ))}

                  </div>
                )}

              </section>


              {/* ADMISSIONS */}

              <section className="detail-card">
                
                <ReviewsSection
  institutionId={institution.id}
/>
<ReviewForm
  institutionId={institution.id}
/>
                <span className="detail-label">
                  ADMISSIONS
                </span>

                <h2>
                  Admissions
                </h2>

                {admissions.length === 0 ? (
                  <p>
                    No admission information available.
                  </p>
                ) : (
                  <div className="admission-list">

                    {admissions.map((admission) => (
                      <div
                        key={admission.id}
                        className="admission-card"
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

                        <span
                          className={
                            `admission-status ${admission.admission_status}`
                          }
                        >
                          {admission.admission_status}
                        </span>

                      </div>
                    ))}

                  </div>
                )}

              </section>

            </div>


            {/* SIDEBAR */}

            <aside className="school-details-sidebar">

              <div className="sidebar-card">

                <span className="detail-label">
                  LOCATION
                </span>

                <h3>
                  Address
                </h3>

                <p>
                  {institution.address}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${institution.address}, ${institution.city}, ${institution.district}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  Open in Google Maps ↗
                </a>

              </div>


              <div className="sidebar-card">

                <span className="detail-label">
                  CONTACT
                </span>

                <h3>
                  Contact Information
                </h3>

                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="contact-public-item"
                    >
                      <span>
                        {contact.contact_type}
                      </span>

                      <strong>
                        {contact.contact_value}
                      </strong>
                    </div>
                  ))
                ) : (
                  <>
                    {institution.phone && (
                      <div className="contact-public-item">
                        <span>Phone</span>
                        <strong>
                          {institution.phone}
                        </strong>
                      </div>
                    )}

                    {institution.email && (
                      <div className="contact-public-item">
                        <span>Email</span>
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

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}

export default SchoolDetails;