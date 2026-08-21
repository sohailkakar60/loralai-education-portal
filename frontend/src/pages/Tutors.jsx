
import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function Tutors() {
  const [searchParams, setSearchParams] =
    useSearchParams();


  const [tutors, setTutors] =
    useState([]);


  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );


  const [area, setArea] =
    useState(
      searchParams.get("area") || ""
    );


  const [availability, setAvailability] =
    useState(
      searchParams.get("availability") || ""
    );


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD TUTORS
  // =========================================================

  const loadTutors = async (
    searchValue = search,
    areaValue = area,
    availabilityValue = availability
  ) => {

    try {

      setLoading(true);
      setError("");


      const params =
        new URLSearchParams();


      if (
        searchValue.trim()
      ) {
        params.set(
          "search",
          searchValue.trim()
        );
      }


      if (
        areaValue.trim()
      ) {
        params.set(
          "area",
          areaValue.trim()
        );
      }


      if (
        availabilityValue
      ) {
        params.set(
          "availability",
          availabilityValue
        );
      }


      const query =
        params.toString();


      const response =
        await fetch(
          `http://localhost:5000/api/tutors/public${
            query
              ? `?${query}`
              : ""
          }`
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load tutors."
        );
      }


      setTutors(
        data.data?.tutors || []
      );

    } catch (err) {

      console.error(
        "Load tutors error:",
        err
      );


      setError(
        err.message ||
          "Failed to load tutors."
      );


      setTutors([]);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // URL → STATE
  // =========================================================

  useEffect(() => {

    const urlSearch =
      searchParams.get(
        "search"
      ) || "";


    const urlArea =
      searchParams.get(
        "area"
      ) || "";


    const urlAvailability =
      searchParams.get(
        "availability"
      ) || "";


    setSearch(
      urlSearch
    );


    setArea(
      urlArea
    );


    setAvailability(
      urlAvailability
    );


    loadTutors(
      urlSearch,
      urlArea,
      urlAvailability
    );

  }, [searchParams]);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSubmit =
    (event) => {

      event.preventDefault();


      const params = {};


      if (
        search.trim()
      ) {
        params.search =
          search.trim();
      }


      if (
        area.trim()
      ) {
        params.area =
          area.trim();
      }


      if (
        availability
      ) {
        params.availability =
          availability;
      }


      setSearchParams(
        params
      );

    };


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClear = () => {

    setSearch("");
    setArea("");
    setAvailability("");

    setSearchParams({});

  };


  // =========================================================
  // COUNTS
  // =========================================================

  const availableCount =
    tutors.filter(
      (tutor) =>
        tutor.availability ===
        "available"
    ).length;


  const busyCount =
    tutors.filter(
      (tutor) =>
        tutor.availability ===
        "busy"
    ).length;


  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getAvailabilityLabel =
    (value) => {

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


  return (
    <>
      <style>{styles}</style>


      <main className="lep-tutors-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="lep-tutors-hero">

          <div className="lep-tutors-container">

            <div className="lep-tutors-hero-grid">

              <div>

                <span className="lep-tutors-eyebrow">

                  <SmartIcon
                    name="tutor"
                    size={13}
                  />

                  LORALAI EDUCATION PORTAL

                </span>


                <h1>
                  Find the Right Tutor
                  <span>
                    in Loralai
                  </span>
                </h1>


                <p>
                  Discover verified home tutors
                  for school, college and academic
                  subjects across Loralai.
                </p>


                <div className="lep-tutors-hero-stats">

                  <div>

                    <strong>
                      {tutors.length}
                    </strong>

                    <span>
                      Tutors Found
                    </span>

                  </div>


                  <div>

                    <strong>
                      {availableCount}
                    </strong>

                    <span>
                      Available
                    </span>

                  </div>


                  <div>

                    <strong>
                      {busyCount}
                    </strong>

                    <span>
                      Busy
                    </span>

                  </div>

                </div>

              </div>


              <div className="lep-tutors-hero-card">

                <div className="lep-tutors-hero-card-icon">

                  <SmartIcon
                    name="teacher"
                    size={29}
                  />

                </div>


                <span>
                  VERIFIED TEACHERS
                </span>


                <h2>
                  Learn from
                  experienced educators.
                </h2>


                <p>
                  Compare qualifications,
                  subjects, experience,
                  availability and fees.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="lep-tutors-content">

          <div className="lep-tutors-container">


            {/* =================================================
                SEARCH PANEL
            ================================================= */}

            <section className="lep-tutors-search-panel">

              <div className="lep-tutors-panel-heading">

                <div className="lep-tutors-panel-icon">

                  <SmartIcon
                    name="search"
                    size={20}
                  />

                </div>


                <div>

                  <span>
                    FIND YOUR TUTOR
                  </span>


                  <h2>
                    Search & Filter
                  </h2>


                  <p>
                    Search by tutor, subject,
                    qualification or area.
                  </p>

                </div>

              </div>


              <form
                className="lep-tutors-form"
                onSubmit={
                  handleSubmit
                }
              >

                <div className="lep-tutors-field search-field">

                  <label>

                    <SmartIcon
                      name="search"
                      size={13}
                    />

                    Search

                  </label>


                  <input
                    type="text"
                    value={search}
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Tutor, subject or qualification..."
                  />

                </div>


                <div className="lep-tutors-field">

                  <label>

                    <SmartIcon
                      name="location"
                      size={13}
                    />

                    Area

                  </label>


                  <input
                    type="text"
                    value={area}
                    onChange={(
                      event
                    ) =>
                      setArea(
                        event.target.value
                      )
                    }
                    placeholder="Main City"
                  />

                </div>


                <div className="lep-tutors-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={13}
                    />

                    Availability

                  </label>


                  <select
                    value={
                      availability
                    }
                    onChange={(
                      event
                    ) =>
                      setAvailability(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      All Availability
                    </option>


                    <option value="available">
                      Available
                    </option>


                    <option value="busy">
                      Busy
                    </option>


                    <option value="not_available">
                      Not Available
                    </option>

                  </select>

                </div>


                <button
                  type="submit"
                  className="lep-tutors-search-btn"
                >

                  <SmartIcon
                    name="search"
                    size={14}
                  />

                  Search Tutors

                </button>

              </form>


              {(search ||
                area ||
                availability) && (

                <div className="lep-tutors-filters">

                  <span className="lep-tutors-filter-label">
                    ACTIVE FILTERS
                  </span>


                  {search && (

                    <span className="lep-tutors-filter-tag">

                      <SmartIcon
                        name="search"
                        size={10}
                      />

                      {search}

                    </span>

                  )}


                  {area && (

                    <span className="lep-tutors-filter-tag">

                      <SmartIcon
                        name="location"
                        size={10}
                      />

                      {area}

                    </span>

                  )}


                  {availability && (

                    <span className="lep-tutors-filter-tag">

                      <SmartIcon
                        name="verified"
                        size={10}
                      />

                      {
                        getAvailabilityLabel(
                          availability
                        )
                      }

                    </span>

                  )}


                  <button
                    type="button"
                    className="lep-tutors-clear"
                    onClick={
                      handleClear
                    }
                  >

                    Clear

                  </button>

                </div>

              )}

            </section>


            {/* =================================================
                RESULT HEADER
            ================================================= */}

            <div className="lep-tutors-results-header">

              <div>

                <span>
                  VERIFIED TUTORS
                </span>


                <h2>
                  {loading
                    ? "Finding Tutors..."
                    : `${tutors.length} ${
                        tutors.length === 1
                          ? "Tutor"
                          : "Tutors"
                      }`}
                </h2>

              </div>


              <div className="lep-tutors-result-badge">

                <SmartIcon
                  name="verified"
                  size={13}
                />

                Verified Profiles

              </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="lep-tutors-state">

                <div className="lep-tutors-state-icon">

                  <SmartIcon
                    name="teacher"
                    size={28}
                  />

                </div>


                <h3>
                  Loading Tutors...
                </h3>


                <p>
                  Please wait while we load
                  verified tutors.
                </p>

              </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading &&
              error && (

                <div className="lep-tutors-state error">

                  <div className="lep-tutors-state-icon">

                    <SmartIcon
                      name="warning"
                      size={28}
                    />

                  </div>


                  <h3>
                    Unable to Load Tutors
                  </h3>


                  <p>
                    {error}
                  </p>


                  <button
                    type="button"
                    className="lep-tutors-retry"
                    onClick={() =>
                      loadTutors(
                        search,
                        area,
                        availability
                      )
                    }
                  >

                    Try Again

                  </button>

                </div>

              )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
              !error &&
              tutors.length === 0 && (

                <div className="lep-tutors-state">

                  <div className="lep-tutors-state-icon">

                    <SmartIcon
                      name="search"
                      size={28}
                    />

                  </div>


                  <h3>
                    No Verified Tutors Found
                  </h3>


                  <p>
                    No tutors currently match
                    your search criteria.
                  </p>


                  {(search ||
                    area ||
                    availability) && (

                    <button
                      type="button"
                      className="lep-tutors-retry"
                      onClick={
                        handleClear
                      }
                    >

                      View All Tutors

                    </button>

                  )}

                </div>

              )}


            {/* =================================================
                TUTOR GRID
            ================================================= */}

            {!loading &&
              !error &&
              tutors.length > 0 && (

                <div className="lep-tutors-grid">

                  {tutors.map(
                    (tutor) => (

                      <article
                        key={
                          tutor.id
                        }
                        className="lep-tutor-card"
                      >

                        {/* CARD TOP */}

                        <div className="lep-tutor-card-top">


                          <div className="lep-tutor-avatar">

                            {tutor.profile_photo_url ? (

                              <img
                                src={`http://localhost:5000${tutor.profile_photo_url}`}
                                alt={
                                  tutor.full_name
                                }
                              />

                            ) : (

                              <SmartIcon
                                name="tutor"
                                size={30}
                              />

                            )}

                          </div>


                          <span className="lep-tutor-verified">

                            <SmartIcon
                              name="verified"
                              size={10}
                            />

                            Verified

                          </span>


                        </div>


                        {/* TITLE */}

                        <h3>
                          {
                            tutor.full_name
                          }
                        </h3>


                        <p className="lep-tutor-qualification">

                          <SmartIcon
                            name="document"
                            size={12}
                          />

                          {
                            tutor.qualification ||
                            "Qualification not listed"
                          }

                        </p>


                        <p className="lep-tutor-subjects">

                          <SmartIcon
                            name="programs"
                            size={12}
                          />

                          {
                            tutor.subjects ||
                            "Subjects not listed"
                          }

                        </p>


                        {/* INFO */}

                        <div className="lep-tutor-info">


                          <div>

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


                          <div>

                            <span>
                              Area
                            </span>


                            <strong>

                              {
                                tutor.area ||
                                tutor.city ||
                                "Loralai"
                              }

                            </strong>

                          </div>


                          <div>

                            <span>
                              Availability
                            </span>


                            <strong
                              className={
                                `lep-tutor-availability ${tutor.availability || "available"}`
                              }
                            >

                              {
                                getAvailabilityLabel(
                                  tutor.availability
                                )
                              }

                            </strong>

                          </div>

                        </div>


                        {/* FEE */}

                        {tutor.hourly_fee !==
                          null &&
                          tutor.hourly_fee !==
                            undefined && (

                            <div className="lep-tutor-fee">

                              <span>
                                Hourly Rate
                              </span>


                              <strong>
                                Rs.{" "}
                                {Number(
                                  tutor.hourly_fee
                                ).toLocaleString()}
                              </strong>


                              <small>
                                / hour
                              </small>

                            </div>

                          )}


                        {/* BUTTON */}

                        <Link
                          to={`/tutors/${tutor.id}`}
                          className="lep-tutor-view-btn"
                        >

                          View Tutor

                          <SmartIcon
                            name="arrow-right"
                            size={13}
                          />

                        </Link>

                      </article>

                    )
                  )}

                </div>

              )}

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

  .lep-tutors-page {
    min-height: 100vh;

    background:
      linear-gradient(
        180deg,
        #f6f9fc,
        #edf3f8
      );
  }


  .lep-tutors-container {
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

  .lep-tutors-hero {
    position: relative;

    overflow: hidden;

    padding:
      70px 0 75px;

    background:
      radial-gradient(
        circle at 88% 10%,
        rgba(255,107,0,.16),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #142f4f,
        #275a86
      );

    color: #ffffff;
  }


  .lep-tutors-hero::before {
    content: "";

    position: absolute;

    width: 420px;
    height: 420px;

    right: -150px;
    bottom: -240px;

    border-radius: 50%;

    background:
      rgba(255,255,255,.06);
  }


  .lep-tutors-hero::after {
    content: "";

    position: absolute;

    width: 260px;
    height: 260px;

    left: -130px;
    top: -130px;

    border-radius: 50%;

    border:
      1px solid
      rgba(255,255,255,.10);
  }


  .lep-tutors-hero-grid {
    position: relative;

    z-index: 1;

    display:
      grid;

    grid-template-columns:
      minmax(0,1.35fr)
      minmax(280px,.65fr);

    gap:
      50px;

    align-items:
      center;
  }


  .lep-tutors-eyebrow {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #ffb06e;

    font-size:
      9px;

    font-weight:
      900;

    letter-spacing:
      1.5px;
  }


  .lep-tutors-hero h1 {
    max-width:
      700px;

    margin-top:
      12px;

    font-size:
      clamp(
        40px,
        6vw,
        64px
      );

    line-height:
      .98;

    letter-spacing:
      -2.5px;
  }


  .lep-tutors-hero h1 span {
    display:
      block;

    color:
      #ff9348;
  }


  .lep-tutors-hero > .lep-tutors-container p {
    max-width:
      670px;

    margin-top:
      17px;

    color:
      #d8e4ef;

    font-size:
      13px;

    line-height:
      1.8;
  }


  .lep-tutors-hero-stats {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      10px;

    margin-top:
      27px;
  }


  .lep-tutors-hero-stats div {
    min-width:
      112px;

    padding:
      12px 14px;

    border:
      1px solid
      rgba(255,255,255,.12);

    border-radius:
      10px;

    background:
      rgba(255,255,255,.07);

    backdrop-filter:
      blur(7px);
  }


  .lep-tutors-hero-stats strong {
    display:
      block;

    color:
      #ffffff;

    font-size:
      22px;
  }


  .lep-tutors-hero-stats span {
    display:
      block;

    margin-top:
      3px;

    color:
      #b8cad9;

    font-size:
      8px;

    font-weight:
      800;

    text-transform:
      uppercase;

    letter-spacing:
      .7px;
  }


  .lep-tutors-hero-card {
    padding:
      27px;

    border:
      1px solid
      rgba(255,255,255,.15);

    border-radius:
      18px;

    background:
      rgba(255,255,255,.08);

    box-shadow:
      0 25px 50px
      rgba(0,0,0,.12);

    backdrop-filter:
      blur(14px);

    transform:
      perspective(900px)
      rotateY(-5deg)
      rotateX(2deg);

    transition:
      transform .3s ease;
  }


  .lep-tutors-hero-card:hover {
    transform:
      perspective(900px)
      rotateY(0)
      rotateX(0)
      translateY(-5px);
  }


  .lep-tutors-hero-card-icon {
    width:
      57px;

    height:
      57px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      14px;

    background:
      linear-gradient(
        145deg,
        #ff6b00,
        #f08537
      );

    color:
      #ffffff;

    box-shadow:
      0 8px 0
      #b84b00;
  }


  .lep-tutors-hero-card > span {
    display:
      block;

    margin-top:
      22px;

    color:
      #ffb06e;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.3px;
  }


  .lep-tutors-hero-card h2 {
    margin-top:
      7px;

    font-size:
      25px;

    line-height:
      1.2;
  }


  .lep-tutors-hero-card p {
    margin-top:
      9px;

    color:
      #c8d7e4;

    font-size:
      10px;

    line-height:
      1.7;
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  .lep-tutors-content {
    padding:
      28px 0 80px;
  }


  /* =======================================================
     SEARCH PANEL
  ======================================================= */

  .lep-tutors-search-panel {
    padding:
      22px;

    border:
      1px solid
      #dfe7ef;

    border-radius:
      17px;

    background:
      rgba(255,255,255,.98);

    box-shadow:
      0 14px 34px
      rgba(26,54,93,.055);
  }


  .lep-tutors-panel-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      18px;
  }


  .lep-tutors-panel-icon {
    width:
      44px;

    height:
      44px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

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
      0 7px 0
      #142b47;
  }


  .lep-tutors-panel-heading span {
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


  .lep-tutors-panel-heading h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-tutors-panel-heading p {
    margin-top:
      3px;

    color:
      #718096;

    font-size:
      9px;
  }


  .lep-tutors-form {
    display:
      grid;

    grid-template-columns:
      minmax(0,1.8fr)
      minmax(150px,1fr)
      minmax(160px,1fr)
      auto;

    gap:
      10px;

    align-items:
      end;
  }


  .lep-tutors-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      6px;
  }


  .lep-tutors-field label {
    display:
      flex;

    align-items:
      center;

    gap:
      5px;

    color:
      #475569;

    font-size:
      8px;

    font-weight:
      900;
  }


  .lep-tutors-field label svg {
    color:
      #2c5f8a;
  }


  .lep-tutors-field input,
  .lep-tutors-field select {
    width:
      100%;

    min-height:
      44px;

    padding:
      0 12px;

    border:
      1px solid
      #dfe6ed;

    border-radius:
      9px;

    background:
      #fbfdff;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      10px;

    outline:
      none;

    transition:
      border-color .2s ease,
      box-shadow .2s ease;
  }


  .lep-tutors-field input:focus,
  .lep-tutors-field select:focus {
    border-color:
      #2c5f8a;

    background:
      #ffffff;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-tutors-search-btn {
    min-height:
      44px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 14px;

    border:
      none;

    border-radius:
      9px;

    background:
      #1a365d;

    color:
      #ffffff;

    font-family:
      inherit;

    font-size:
      9px;

    font-weight:
      900;

    cursor:
      pointer;

    box-shadow:
      0 7px 0
      #142b47;
  }


  .lep-tutors-search-btn:hover {
    background:
      #2c5f8a;
  }


  /* =======================================================
     FILTER TAGS
  ======================================================= */

  .lep-tutors-filters {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;

    margin-top:
      13px;

    padding-top:
      13px;

    border-top:
      1px solid
      #edf1f5;
  }


  .lep-tutors-filter-label {
    color:
      #94a3b8;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1px;
  }


  .lep-tutors-filter-tag {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    padding:
      5px 8px;

    border-radius:
      6px;

    background:
      #eef4f8;

    color:
      #2c5f8a;

    font-size:
      8px;

    font-weight:
      800;
  }


  .lep-tutors-clear {
    min-height:
      27px;

    padding:
      0 8px;

    border:
      1px solid
      #efc9c9;

    border-radius:
      6px;

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


  /* =======================================================
     RESULTS HEADER
  ======================================================= */

  .lep-tutors-results-header {
    display:
      flex;

    align-items:
      flex-end;

    justify-content:
      space-between;

    gap:
      15px;

    margin:
      30px 0 15px;
  }


  .lep-tutors-results-header > div:first-child > span {
    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-tutors-results-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      25px;
  }


  .lep-tutors-result-badge {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    padding:
      8px 10px;

    border-radius:
      8px;

    background:
      #eaf7ee;

    color:
      #16803c;

    font-size:
      8px;

    font-weight:
      900;
  }


  /* =======================================================
     GRID
  ======================================================= */

  .lep-tutors-grid {
    display:
      grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0,1fr)
      );

    gap:
      14px;
  }


  .lep-tutor-card {
    position:
      relative;

    display:
      flex;

    flex-direction:
      column;

    min-height:
      430px;

    padding:
      19px;

    border:
      1px solid
      #e1e8ef;

    border-radius:
      16px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f4f8fb
      );

    box-shadow:
      0 10px 28px
      rgba(26,54,93,.055);

    transition:
      transform .3s ease,
      box-shadow .3s ease,
      border-color .3s ease;

    overflow:
      hidden;
  }


  .lep-tutor-card::before {
    content:
      "";

    position:
      absolute;

    left:
      0;

    right:
      0;

    top:
      0;

    height:
      4px;

    background:
      linear-gradient(
        90deg,
        #1a365d,
        #ff6b00
      );
  }


  .lep-tutor-card:hover {
    transform:
      perspective(900px)
      rotateX(2deg)
      rotateY(-2deg)
      translateY(-7px);

    box-shadow:
      0 25px 50px
      rgba(26,54,93,.13);

    border-color:
      rgba(44,95,138,.24);
  }


  .lep-tutor-card-top {
    display:
      flex;

    align-items:
      flex-start;

    justify-content:
      space-between;

    gap:
      10px;
  }


  .lep-tutor-avatar {
    width:
      66px;

    height:
      66px;

    display:
      grid;

    place-items:
      center;

    overflow:
      hidden;

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
      0 8px 0
      #142b47,
      0 15px 25px
      rgba(26,54,93,.13);
  }


  .lep-tutor-avatar img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-tutor-verified {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    padding:
      6px 8px;

    border-radius:
      6px;

    background:
      #eaf7ee;

    color:
      #16803c;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-tutor-card h3 {
    margin-top:
      18px;

    color:
      #1a365d;

    font-size:
      18px;

    line-height:
      1.2;
  }


  .lep-tutor-qualification,
  .lep-tutor-subjects {
    display:
      flex;

    align-items:
      flex-start;

    gap:
      6px;

    margin-top:
      8px;

    font-size:
      9px;

    line-height:
      1.5;
  }


  .lep-tutor-qualification {
    color:
      #718096;
  }


  .lep-tutor-subjects {
    color:
      #2c5f8a;

    font-weight:
      800;
  }


  .lep-tutor-info {
    margin-top:
      16px;

    border-top:
      1px solid
      #e6edf2;

    border-bottom:
      1px solid
      #e6edf2;
  }


  .lep-tutor-info > div {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      10px;

    padding:
      9px 0;

    border-bottom:
      1px solid
      #edf2f6;
  }


  .lep-tutor-info > div:last-child {
    border-bottom:
      none;
  }


  .lep-tutor-info span {
    color:
      #94a3b8;

    font-size:
      8px;
  }


  .lep-tutor-info strong {
    color:
      #1a365d;

    font-size:
      9px;

    text-align:
      right;
  }


  .lep-tutor-availability.available {
    color:
      #16803c;
  }


  .lep-tutor-availability.busy {
    color:
      #b25c00;
  }


  .lep-tutor-availability.not_available {
    color:
      #b42318;
  }


  .lep-tutor-fee {
    display:
      flex;

    align-items:
      baseline;

    gap:
      5px;

    margin-top:
      13px;

    padding:
      10px 11px;

    border:
      1px solid
      #e4eaf0;

    border-radius:
      9px;

    background:
      #f9fbfd;
  }


  .lep-tutor-fee span {
    color:
      #94a3b8;

    font-size:
      8px;
  }


  .lep-tutor-fee strong {
    color:
      #1a365d;

    font-size:
      14px;
  }


  .lep-tutor-fee small {
    color:
      #718096;

    font-size:
      8px;
  }


  .lep-tutor-view-btn {
    min-height:
      40px;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    margin-top:
      auto;

    padding:
      0 12px;

    border-radius:
      9px;

    background:
      #1a365d;

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

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-tutor-view-btn:hover {
    transform:
      translateY(-2px);

    background:
      #2c5f8a;
  }


  /* =======================================================
     STATES
  ======================================================= */

  .lep-tutors-state {
    min-height:
      300px;

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
      1px solid
      #e1e8ef;

    border-radius:
      15px;

    background:
      rgba(255,255,255,.92);

    box-shadow:
      0 12px 28px
      rgba(26,54,93,.045);
  }


  .lep-tutors-state.error {
    border-color:
      #efcccc;

    background:
      #fffafa;
  }


  .lep-tutors-state-icon {
    width:
      60px;

    height:
      60px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      14px;

    border-radius:
      15px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 8px 0
      #142b47;
  }


  .lep-tutors-state h3 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-tutors-state p {
    max-width:
      480px;

    margin-top:
      7px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.7;
  }


  .lep-tutors-retry {
    min-height:
      39px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    margin-top:
      15px;

    padding:
      0 13px;

    border:
      none;

    border-radius:
      9px;

    background:
      #1a365d;

    color:
      #ffffff;

    font-family:
      inherit;

    font-size:
      9px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  /* =======================================================
     RESPONSIVE
  ======================================================= */

  @media (max-width: 1000px) {

    .lep-tutors-hero-grid {
      grid-template-columns:
        1fr;
    }


    .lep-tutors-hero-card {
      max-width:
        460px;

      transform:
        none;
    }


    .lep-tutors-grid {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }


    .lep-tutors-form {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }


    .lep-tutors-search-btn {
      grid-column:
        1 / -1;
    }

  }


  @media (max-width: 650px) {

    .lep-tutors-container {
      width:
        calc(100% - 24px);
    }


    .lep-tutors-hero {
      padding:
        48px 0 52px;
    }


    .lep-tutors-hero h1 {
      font-size:
        41px;
    }


    .lep-tutors-hero-stats {
      display:
        grid;

      grid-template-columns:
        repeat(3,1fr);
    }


    .lep-tutors-hero-stats div {
      min-width:
        0;

      padding:
        10px;
    }


    .lep-tutors-content {
      padding-top:
        18px;
    }


    .lep-tutors-search-panel {
      padding:
        17px;
    }


    .lep-tutors-form {
      grid-template-columns:
        1fr;
    }


    .lep-tutors-search-btn {
      grid-column:
        auto;

      width:
        100%;
    }


    .lep-tutors-results-header {
      display:
        block;
    }


    .lep-tutors-result-badge {
      margin-top:
        9px;
    }


    .lep-tutors-grid {
      grid-template-columns:
        1fr;
    }


    .lep-tutor-card {
      min-height:
        0;
    }

  }

`;

export default Tutors;