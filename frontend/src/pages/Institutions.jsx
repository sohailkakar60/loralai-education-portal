import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Institutions({ type }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ownership, setOwnership] = useState("all");

  const config = {
    school: {
      title: "Schools in Loralai",
      eyebrow: "PRIMARY & SECONDARY EDUCATION",
      description:
        "Explore verified schools and educational institutions in Loralai.",
      singular: "School",
      path: "/schools",
      icon: "S",
    },

    college: {
      title: "Colleges in Loralai",
      eyebrow: "HIGHER EDUCATION",
      description:
        "Explore verified colleges and higher education institutions in Loralai.",
      singular: "College",
      path: "/colleges",
      icon: "C",
    },

    university: {
      title: "Universities in Loralai",
      eyebrow: "HIGHER EDUCATION",
      description:
        "Explore verified universities and degree institutions in Loralai.",
      singular: "University",
      path: "/universities",
      icon: "U",
    },

    academy: {
      title: "Academies in Loralai",
      eyebrow: "LEARNING CENTERS",
      description:
        "Explore verified academies and learning centers in Loralai.",
      singular: "Academy",
      path: "/academies",
      icon: "A",
    },
  };

  const current = config[type] || config.school;

  // =========================================================
  // LOAD INSTITUTIONS
  // =========================================================

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/public/institutions?type=${encodeURIComponent(
            type
          )}&limit=100`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load institutions."
          );
        }

        setInstitutions(
          data.data?.institutions || []
        );
      } catch (err) {
        console.error(
          "Institution loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load institutions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, [type]);

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredInstitutions = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return institutions.filter(
      (institution) => {
        const matchesSearch =
          !query ||
          institution.name
            ?.toLowerCase()
            .includes(query) ||
          institution.area
            ?.toLowerCase()
            .includes(query) ||
          institution.city
            ?.toLowerCase()
            .includes(query) ||
          institution.district
            ?.toLowerCase()
            .includes(query);

        const matchesOwnership =
          ownership === "all" ||
          institution.ownership_type ===
            ownership;

        return (
          matchesSearch &&
          matchesOwnership
        );
      }
    );
  }, [
    institutions,
    search,
    ownership,
  ]);

  return (
    <main className="premium-institutions-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="premium-institutions-hero">

        <div className="premium-institutions-orb orb-one" />
        <div className="premium-institutions-orb orb-two" />

        <div className="container">

          <div className="premium-institutions-hero-content">

            <div className="premium-page-breadcrumb">
              <Link to="/">
                Home
              </Link>

              <span>
                /
              </span>

              <span>
                {current.singular}s
              </span>
            </div>

            <div className="premium-page-icon">
              {current.icon}
            </div>

            <span className="premium-page-eyebrow">
              {current.eyebrow}
            </span>

            <h1>
              {current.title}
            </h1>

            <p>
              {current.description}{" "}
              Find trusted information about
              institutions, locations, students,
              teachers and available educational
              opportunities.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          SEARCH / FILTER BAR
      ===================================================== */}

      <section className="premium-institutions-controls">

        <div className="container">

          <div className="premium-controls-card">

            <div className="premium-control-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={`Search ${current.singular.toLowerCase()}, area or city...`}
              />

            </div>

            <div className="premium-control-select">

              <label>
                OWNERSHIP
              </label>

              <select
                value={ownership}
                onChange={(event) =>
                  setOwnership(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Institutions
                </option>

                <option value="government">
                  Government
                </option>

                <option value="private">
                  Private
                </option>

                <option value="semi_government">
                  Semi Government
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </div>

            <div className="premium-results-count">

              <span>
                SHOWING
              </span>

              <strong>
                {filteredInstitutions.length}
              </strong>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <section className="premium-institutions-content">

        <div className="container">

          {loading && (

            <div className="premium-institutions-state">

              <div className="premium-loading-icon">
                {current.icon}
              </div>

              <h3>
                Loading {current.title}...
              </h3>

              <p>
                Please wait while we load verified
                institutions.
              </p>

            </div>

          )}

          {!loading && error && (

            <div className="premium-institutions-state premium-state-error">

              <div className="premium-state-symbol">
                !
              </div>

              <h3>
                Unable to load institutions
              </h3>

              <p>
                {error}
              </p>

            </div>

          )}

          {!loading &&
            !error &&
            institutions.length === 0 && (

              <div className="premium-institutions-state">

                <div className="premium-state-symbol">
                  {current.icon}
                </div>

                <h3>
                  No {current.singular.toLowerCase()}s
                  published yet
                </h3>

                <p>
                  Verified institutions will appear
                  here as the portal grows.
                </p>

              </div>

          )}

          {!loading &&
            !error &&
            institutions.length > 0 &&
            filteredInstitutions.length === 0 && (

              <div className="premium-institutions-state">

                <div className="premium-state-symbol">
                  ⌕
                </div>

                <h3>
                  No matching institutions
                </h3>

                <p>
                  Try a different search or ownership
                  filter.
                </p>

                <button
                  type="button"
                  className="premium-clear-filter-btn"
                  onClick={() => {
                    setSearch("");
                    setOwnership("all");
                  }}
                >
                  Clear Filters
                </button>

              </div>

          )}

          {!loading &&
            !error &&
            filteredInstitutions.length > 0 && (

              <>

                {/* RESULTS HEADER */}

                <div className="premium-results-heading">

                  <div>

                    <span>
                      VERIFIED DIRECTORY
                    </span>

                    <h2>
                      Discover{" "}
                      {current.singular}s
                    </h2>

                  </div>

                  <p>
                    {filteredInstitutions.length}{" "}
                    {filteredInstitutions.length === 1
                      ? current.singular.toLowerCase()
                      : `${current.singular.toLowerCase()}s`}{" "}
                    available
                  </p>

                </div>

                {/* CARDS */}

                <div className="premium-institution-grid">

                  {filteredInstitutions.map(
                    (institution) => (

                      <article
                        key={institution.id}
                        className="premium-institution-card"
                      >

                        {/* IMAGE */}

                        <Link
                          to={`${current.path}/${institution.slug}`}
                          className="premium-institution-image"
                        >

                          {institution.cover_image_url ? (

                            <img
                              src={`http://localhost:5000${institution.cover_image_url}`}
                              alt={
                                institution.name
                              }
                            />

                          ) : (

                            <div className="premium-institution-placeholder">

                              <span>
                                {current.icon}
                              </span>

                              <small>
                                Loralai Education
                              </small>

                            </div>

                          )}

                          <span className="premium-verified-badge">
                            ✓ Verified
                          </span>

                        </Link>

                        {/* CARD BODY */}

                        <div className="premium-institution-body">

                          <div className="premium-institution-top">

                            <span className="premium-ownership-badge">

                              {(
                                institution.ownership_type ||
                                "private"
                              )
                                .replaceAll(
                                  "_",
                                  " "
                                )
                                .toUpperCase()}

                            </span>

                            {institution.gender_type && (
                              <span className="premium-gender-badge">
                                {institution.gender_type
                                  .replaceAll(
                                    "_",
                                    " "
                                  )}
                              </span>
                            )}

                          </div>

                          <h3>
                            {institution.name}
                          </h3>

                          <div className="premium-location">

                            <span>
                              ◉
                            </span>

                            <p>
                              {institution.area
                                ? `${institution.area}, `
                                : ""}

                              {institution.city}

                              {institution.district
                                ? `, ${institution.district}`
                                : ""}
                            </p>

                          </div>

                          <p className="premium-institution-description">

                            {institution.description ||
                              `Verified ${current.singular.toLowerCase()} in Loralai.`}

                          </p>

                          {/* STATS */}

                          <div className="premium-institution-stats">

                            <div>

                              <span>
                                STUDENTS
                              </span>

                              <strong>
                                {institution.student_count ??
                                  0}
                              </strong>

                            </div>

                            <div>

                              <span>
                                TEACHERS
                              </span>

                              <strong>
                                {institution.teacher_count ??
                                  0}
                              </strong>

                            </div>

                            <div>

                              <span>
                                EST.
                              </span>

                              <strong>
                                {institution.established_year ||
                                  "—"}
                              </strong>

                            </div>

                          </div>

                          {/* ACTION */}

                          <Link
                            to={`${current.path}/${institution.slug}`}
                            className="premium-institution-view"
                          >
                            <span>
                              View{" "}
                              {current.singular}
                            </span>

                            <strong>
                              →
                            </strong>
                          </Link>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </>

          )}

        </div>

      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="premium-directory-cta">

        <div className="container">

          <div>

            <span>
              LORALAI EDUCATION PORTAL
            </span>

            <h2>
              Looking for something specific?
            </h2>

            <p>
              Explore other educational categories
              across Loralai.
            </p>

          </div>

          <div className="premium-directory-actions">

            <Link
              to="/schools"
              className="premium-directory-btn light"
            >
              Schools
            </Link>

            <Link
              to="/colleges"
              className="premium-directory-btn light"
            >
              Colleges
            </Link>

            <Link
              to="/universities"
              className="premium-directory-btn light"
            >
              Universities
            </Link>

            <Link
              to="/tutors"
              className="premium-directory-btn orange"
            >
              Find Tutors →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Institutions;