import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import API_URL from "../config/api";


function Schools() {
  const [searchParams, setSearchParams] =
    useSearchParams();


  const [schools, setSchools] =
    useState([]);


  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );


  const [ownership, setOwnership] =
    useState(
      searchParams.get("ownership") || ""
    );


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD SCHOOLS
  // =========================================================

  const loadSchools = async (
    searchValue = search,
    ownershipValue = ownership
  ) => {

    try {

      setLoading(true);
      setError("");


      const params =
        new URLSearchParams();


      params.set(
        "type",
        "school"
      );


      params.set(
        "limit",
        "100"
      );


      if (
        searchValue.trim()
      ) {

        params.set(
          "search",
          searchValue.trim()
        );

      }


      if (
        ownershipValue
      ) {

        params.set(
          "ownership",
          ownershipValue
        );

      }


      const response =
        await fetch(
          `${API_URL}/api/public/institutions?${params.toString()}`
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


      setSchools(
        data.data?.institutions ||
          []
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


      setSchools([]);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOAD WHEN URL FILTERS CHANGE
  // =========================================================

  useEffect(() => {

    const urlSearch =
      searchParams.get(
        "search"
      ) || "";


    const urlOwnership =
      searchParams.get(
        "ownership"
      ) || "";


    setSearch(
      urlSearch
    );


    setOwnership(
      urlOwnership
    );


    loadSchools(
      urlSearch,
      urlOwnership
    );

  }, [searchParams]);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    const params = {};


    if (
      search.trim()
    ) {

      params.search =
        search.trim();

    }


    if (
      ownership
    ) {

      params.ownership =
        ownership;

    }


    setSearchParams(
      params
    );

  };


  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {

    setSearch("");
    setOwnership("");

    setSearchParams({});

  };


  // =========================================================
  // IMAGE URL HELPER
  // =========================================================

  const getImageUrl =
    (imageUrl) => {

      if (!imageUrl) {
        return "";
      }


      if (
        imageUrl.startsWith(
          "http://"
        ) ||
        imageUrl.startsWith(
          "https://"
        ) ||
        imageUrl.startsWith(
          "data:"
        ) ||
        imageUrl.startsWith(
          "blob:"
        )
      ) {

        return imageUrl;

      }


      return `${API_URL}${imageUrl}`;

    };


  return (
    <main className="schools-page">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="schools-hero">

        <div className="container">

          <span className="official-label">
            LORALAI EDUCATION PORTAL
          </span>


          <h1>
            Schools in Loralai
          </h1>


          <p>
            Explore verified schools collected and
            reviewed by the Loralai Education Portal
            administration.
          </p>

        </div>

      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="schools-content">

        <div className="container">


          <form
            className="school-search-form"
            onSubmit={
              handleSubmit
            }
          >

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search school name, area or city..."
            />


            <select
              value={ownership}
              onChange={(event) =>
                setOwnership(
                  event.target.value
                )
              }
            >

              <option value="">
                All Ownership
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


            <button type="submit">
              Search
            </button>

          </form>


          {/* =================================================
              ACTIVE FILTERS
          ================================================= */}

          {(search || ownership) && (

            <div className="school-active-filters">

              <span>
                Filters:
              </span>


              {search && (

                <span className="school-filter-tag">
                  Search: {search}
                </span>

              )}


              {ownership && (

                <span className="school-filter-tag">

                  {ownership.replaceAll(
                    "_",
                    " "
                  )}

                </span>

              )}


              <button
                type="button"
                onClick={
                  handleClear
                }
                className="school-clear-filter"
              >
                Clear
              </button>

            </div>

          )}


          {/* =================================================
              CONTENT
          ================================================= */}

          {loading ? (

            <div className="schools-state">

              <h3>
                Loading schools...
              </h3>


              <p>
                Please wait while we load verified
                institutions.
              </p>

            </div>

          ) : error ? (

            <div className="schools-state schools-error">

              <h3>
                Unable to load schools
              </h3>


              <p>
                {error}
              </p>


              <button
                type="button"
                className="school-retry-btn"
                onClick={() =>
                  loadSchools()
                }
              >
                Try Again
              </button>

            </div>

          ) : schools.length === 0 ? (

            <div className="schools-state">

              <div className="schools-empty-icon">
                🔎
              </div>


              <h3>
                No approved schools found
              </h3>


              <p>
                We couldn't find a published school
                matching your search.
              </p>


              {(search || ownership) && (

                <button
                  type="button"
                  className="dashboard-primary-btn"
                  onClick={
                    handleClear
                  }
                >
                  View All Schools
                </button>

              )}

            </div>

          ) : (

            <>

              {/* =============================================
                  RESULTS HEADER
              ============================================= */}

              <div className="schools-results-header">

                <div>

                  <span>
                    VERIFIED INSTITUTIONS
                  </span>


                  <h2>

                    {schools.length}{" "}

                    {schools.length === 1
                      ? "School"
                      : "Schools"}

                  </h2>

                </div>

              </div>


              {/* =============================================
                  SCHOOL GRID
              ============================================= */}

              <div className="schools-grid">

                {schools.map(
                  (school) => (

                    <article
                      key={
                        school.id
                      }
                      className="school-card"
                    >


                      {/* IMAGE */}

                      <div className="school-card-image">

                        {school.cover_image_url ? (

                          <img
                            src={
                              getImageUrl(
                                school.cover_image_url
                              )
                            }
                            alt={
                              school.name
                            }
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="school-card-placeholder">
                            🏫
                          </div>

                        )}


                        <span className="verified-badge-public">
                          ✓ Verified
                        </span>

                      </div>


                      {/* BODY */}

                      <div className="school-card-body">

                        <span className="school-card-type">

                          {(
                            school.ownership_type ||
                            "private"
                          )
                            .replaceAll(
                              "_",
                              " "
                            )
                            .toUpperCase()}

                        </span>


                        <h3>
                          {school.name}
                        </h3>


                        <p className="school-location">

                          📍{" "}

                          {school.area
                            ? `${school.area}, `
                            : ""}

                          {school.city}

                          {school.district
                            ? `, ${school.district}`
                            : ""}

                        </p>


                        <p className="school-description">

                          {school.description ||
                            "Verified educational institution in Loralai."}

                        </p>


                        {/* SCHOOL STATS */}

                        <div className="school-stats">

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


                        {/* GENDER */}

                        <div className="school-card-extra">

                          <span>
                            Gender
                          </span>


                          <strong>

                            {(
                              school.gender_type ||
                              "not_specified"
                            ).replaceAll(
                              "_",
                              " "
                            )}

                          </strong>

                        </div>


                        {/* VIEW */}

                        <Link
                          to={
                            `/schools/${school.slug}`
                          }
                          className="school-view-btn"
                        >
                          View School →
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

    </main>
  );
}


export default Schools;