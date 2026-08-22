
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function Rankings() {
  const [rankings, setRankings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [sortMode, setSortMode] =
    useState("rating");


  // =========================================================
  // LOAD RANKINGS
  // =========================================================

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        setError("");


        const response =
          await fetch(
            `${API_URL}/api/public/rankings`
          );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load rankings."
          );
        }


        setRankings(
          data.data?.rankings || []
        );

      } catch (err) {

        console.error(
          "Load rankings error:",
          err
        );


        setError(
          err.message ||
            "Failed to load rankings."
        );

      } finally {

        setLoading(false);

      }
    };


    loadRankings();

  }, []);


  // =========================================================
  // SORT
  // =========================================================

  const sortedRankings =
    useMemo(() => {

      const copy =
        [...rankings];


      if (
        sortMode === "reviews"
      ) {

        return copy.sort(
          (a, b) =>
            Number(
              b.review_count || 0
            ) -
            Number(
              a.review_count || 0
            )
        );

      }


      if (
        sortMode === "name"
      ) {

        return copy.sort(
          (a, b) =>
            String(
              a.name || ""
            ).localeCompare(
              String(
                b.name || ""
              )
            )
        );

      }


      return copy.sort(
        (a, b) =>
          Number(
            b.average_rating || 0
          ) -
          Number(
            a.average_rating || 0
          )
      );

    }, [
      rankings,
      sortMode,
    ]);


  // =========================================================
  // HELPERS
  // =========================================================

  const getRating =
    (school) =>
      Number(
        school.average_rating || 0
      );


  const getReviewCount =
    (school) =>
      Number(
        school.review_count || 0
      );


  const getStars =
    (rating) => {

      const rounded =
        Math.max(
          0,
          Math.min(
            5,
            Math.round(
              Number(rating)
            )
          )
        );


      return (
        "â˜…".repeat(
          rounded
        ) +
        "â˜†".repeat(
          5 - rounded
        )
      );

    };


  const formatOwnership =
    (value) => {

      if (!value) {
        return "INSTITUTION";
      }


      return value
        .replaceAll(
          "_",
          " "
        )
        .toUpperCase();

    };


  const totalReviews =
    rankings.reduce(
      (total, school) =>
        total +
        getReviewCount(
          school
        ),
      0
    );


  const averageRating =
    rankings.length
      ? (
          rankings.reduce(
            (total, school) =>
              total +
              getRating(
                school
              ),
            0
          ) /
          rankings.length
        ).toFixed(1)
      : "0.0";


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <style>{styles}</style>


      <main className="lep-rankings-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="lep-rankings-hero">

          <div className="lep-rankings-container">

            <div className="lep-rankings-hero-grid">


              <div>

                <span className="lep-rankings-eyebrow">

                  <SmartIcon
                    name="rankings"
                    size={13}
                  />

                  LORALAI EDUCATION PORTAL

                </span>


                <h1>
                  School
                  <span>
                    Rankings
                  </span>
                </h1>


                <p>
                  Explore verified schools ranked
                  by community ratings and reviews.
                  Discover institutions receiving the
                  strongest feedback from the Loralai
                  education community.
                </p>


                <div className="lep-rankings-hero-stats">

                  <div>

                    <strong>
                      {rankings.length}
                    </strong>

                    <span>
                      Ranked Schools
                    </span>

                  </div>


                  <div>

                    <strong>
                      {averageRating}
                    </strong>

                    <span>
                      Average Rating
                    </span>

                  </div>


                  <div>

                    <strong>
                      {totalReviews}
                    </strong>

                    <span>
                      Total Reviews
                    </span>

                  </div>

                </div>

              </div>


              <div className="lep-rankings-feature-card">

                <div className="lep-rankings-feature-icon">

                  <SmartIcon
                    name="verified"
                    size={28}
                  />

                </div>


                <span>
                  COMMUNITY RANKINGS
                </span>


                <h2>
                  Discover top-rated schools
                  in Loralai.
                </h2>


                <p>
                  Rankings are based on available
                  community ratings and reviews.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="lep-rankings-content">

          <div className="lep-rankings-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="lep-rankings-section-header">

              <div>

                <span>
                  VERIFIED INSTITUTIONS
                </span>


                <h2>
                  Top Schools
                </h2>


                <p>
                  Browse schools according to
                  community feedback.
                </p>

              </div>


              <div className="lep-rankings-result-badge">

                <SmartIcon
                  name="rankings"
                  size={13}
                />

                {sortedRankings.length}{" "}
                {sortedRankings.length === 1
                  ? "School"
                  : "Schools"}

              </div>

            </div>


            {/* =================================================
                SORT BAR
            ================================================= */}

            <div className="lep-rankings-sort-bar">

              <span>
                SORT BY
              </span>


              <button
                type="button"
                className={
                  sortMode === "rating"
                    ? "lep-ranking-sort active"
                    : "lep-ranking-sort"
                }
                onClick={() =>
                  setSortMode(
                    "rating"
                  )
                }
              >

                <SmartIcon
                  name="star"
                  size={11}
                />

                Rating

              </button>


              <button
                type="button"
                className={
                  sortMode === "reviews"
                    ? "lep-ranking-sort active"
                    : "lep-ranking-sort"
                }
                onClick={() =>
                  setSortMode(
                    "reviews"
                  )
                }
              >

                <SmartIcon
                  name="reviews"
                  size={11}
                />

                Reviews

              </button>


              <button
                type="button"
                className={
                  sortMode === "name"
                    ? "lep-ranking-sort active"
                    : "lep-ranking-sort"
                }
                onClick={() =>
                  setSortMode(
                    "name"
                  )
                }
              >

                <SmartIcon
                  name="school"
                  size={11}
                />

                Name

              </button>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="lep-rankings-state">

                <div className="lep-rankings-state-icon">

                  <SmartIcon
                    name="rankings"
                    size={29}
                  />

                </div>


                <h3>
                  Loading Rankings...
                </h3>


                <p>
                  Please wait while we load
                  the latest school rankings.
                </p>

              </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading &&
              error && (

                <div className="lep-rankings-state error">

                  <div className="lep-rankings-state-icon">

                    <SmartIcon
                      name="warning"
                      size={29}
                    />

                  </div>


                  <h3>
                    Unable to Load Rankings
                  </h3>


                  <p>
                    {error}
                  </p>


                  <button
                    type="button"
                    className="lep-rankings-retry"
                    onClick={() =>
                      window.location.reload()
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
              sortedRankings.length === 0 && (

                <div className="lep-rankings-state">

                  <div className="lep-rankings-state-icon">

                    <SmartIcon
                      name="rankings"
                      size={29}
                    />

                  </div>


                  <h3>
                    No Ranked Schools Yet
                  </h3>


                  <p>
                    Verified schools will appear
                    here as reviews and ratings
                    are added.
                  </p>

                </div>

              )}


            {/* =================================================
                RANKINGS
            ================================================= */}

            {!loading &&
              !error &&
              sortedRankings.length > 0 && (

                <div className="lep-rankings-list">

                  {sortedRankings.map(
                    (
                      school,
                      index
                    ) => {

                      const rating =
                        getRating(
                          school
                        );


                      const reviews =
                        getReviewCount(
                          school
                        );


                      const isFirst =
                        index === 0 &&
                        sortMode ===
                          "rating";


                      return (

                        <article
                          key={
                            school.id
                          }
                          className={
                            isFirst
                              ? "lep-ranking-card top-ranked"
                              : "lep-ranking-card"
                          }
                        >


                          {/* RANK */}

                          <div className="lep-ranking-position">

                            {index === 0 &&
                            sortMode ===
                              "rating" ? (

                              <SmartIcon
                                name="award"
                                size={19}
                              />

                            ) : (

                              index + 1

                            )}

                          </div>


                          {/* LOGO */}

                          <div className="lep-ranking-logo">

                            {school.logo_url ? (

                              <img
                                src={
                                  school.logo_url.startsWith(
                                    "http"
                                  )
                                    ? school.logo_url
                                    : `${API_URL}${school.logo_url}`
                                }
                                alt={
                                  school.name
                                }
                              />

                            ) : (

                              <SmartIcon
                                name="school"
                                size={25}
                              />

                            )}

                          </div>


                          {/* SCHOOL INFO */}

                          <div className="lep-ranking-school-info">

                            <span className="lep-ranking-type">

                              <SmartIcon
                                name="school"
                                size={9}
                              />

                              {
                                formatOwnership(
                                  school.ownership_type
                                )
                              }

                            </span>


                            <h2>
                              {
                                school.name
                              }
                            </h2>


                            <p>

                              <SmartIcon
                                name="location"
                                size={11}
                              />

                              {school.area
                                ? `${school.area}, `
                                : ""}

                              {
                                school.city ||
                                "Loralai"
                              }

                            </p>

                          </div>


                          {/* RATING */}

                          <div className="lep-ranking-rating">

                            <strong>
                              {rating.toFixed(
                                1
                              )}
                            </strong>


                            <div className="lep-ranking-stars">

                              {getStars(
                                rating
                              )}

                            </div>


                            <span>

                              {reviews}{" "}
                              {reviews === 1
                                ? "review"
                                : "reviews"}

                            </span>

                          </div>


                          {/* ACTION */}

                          <Link
                            to={
                              `/schools/${school.slug}`
                            }
                            className="lep-ranking-view-btn"
                          >

                            View School

                            <SmartIcon
                              name="arrow-right"
                              size={12}
                            />

                          </Link>

                        </article>

                      );

                    }
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

  .lep-rankings-page {
    min-height: 100vh;

    background:
      linear-gradient(
        180deg,
        #f5f8fb,
        #edf3f8
      );
  }


  .lep-rankings-container {
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

  .lep-rankings-hero {
    position:
      relative;

    overflow:
      hidden;

    padding:
      68px 0 72px;

    background:
      radial-gradient(
        circle at 90% 10%,
        rgba(255,107,0,.15),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #142f4f,
        #275a86
      );

    color:
      #ffffff;
  }


  .lep-rankings-hero::before {
    content:
      "";

    position:
      absolute;

    width:
      450px;

    height:
      450px;

    right:
      -160px;

    bottom:
      -280px;

    border-radius:
      50%;

    background:
      rgba(255,255,255,.05);
  }


  .lep-rankings-hero::after {
    content:
      "";

    position:
      absolute;

    width:
      260px;

    height:
      260px;

    left:
      -130px;

    top:
      -150px;

    border-radius:
      50%;

    border:
      1px solid
      rgba(255,255,255,.10);
  }


  .lep-rankings-hero-grid {
    position:
      relative;

    z-index:
      1;

    display:
      grid;

    grid-template-columns:
      minmax(0,1.35fr)
      minmax(280px,.65fr);

    gap:
      45px;

    align-items:
      center;
  }


  .lep-rankings-eyebrow {
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


  .lep-rankings-hero h1 {
    margin-top:
      12px;

    color:
      #ffffff;

    font-size:
      clamp(
        44px,
        6vw,
        66px
      );

    line-height:
      .96;

    letter-spacing:
      -2.7px;
  }


  .lep-rankings-hero h1 span {
    display:
      block;

    color:
      #ff9348;
  }


  .lep-rankings-hero p {
    max-width:
      670px;

    margin-top:
      17px;

    color:
      #d5e3ee;

    font-size:
      13px;

    line-height:
      1.8;
  }


  .lep-rankings-hero-stats {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      10px;

    margin-top:
      25px;
  }


  .lep-rankings-hero-stats div {
    min-width:
      116px;

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


  .lep-rankings-hero-stats strong {
    display:
      block;

    color:
      #ffffff;

    font-size:
      22px;
  }


  .lep-rankings-hero-stats span {
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
      .6px;
  }


  .lep-rankings-feature-card {
    padding:
      27px;

    border:
      1px solid
      rgba(255,255,255,.14);

    border-radius:
      18px;

    background:
      rgba(255,255,255,.08);

    box-shadow:
      0 25px 50px
      rgba(0,0,0,.12);

    backdrop-filter:
      blur(13px);

    transform:
      perspective(900px)
      rotateY(-5deg)
      rotateX(2deg);

    transition:
      transform .3s ease;
  }


  .lep-rankings-feature-card:hover {
    transform:
      perspective(900px)
      rotateY(0)
      rotateX(0)
      translateY(-5px);
  }


  .lep-rankings-feature-icon {
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


  .lep-rankings-feature-card > span {
    display:
      block;

    margin-top:
      21px;

    color:
      #ffb06e;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-rankings-feature-card h2 {
    margin-top:
      7px;

    color:
      #ffffff;

    font-size:
      25px;

    line-height:
      1.22;
  }


  .lep-rankings-feature-card p {
    margin-top:
      9px;

    color:
      #c7d6e3;

    font-size:
      10px;

    line-height:
      1.7;
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  .lep-rankings-content {
    padding:
      29px 0 80px;
  }


  .lep-rankings-section-header {
    display:
      flex;

    align-items:
      flex-end;

    justify-content:
      space-between;

    gap:
      15px;

    margin-bottom:
      15px;
  }


  .lep-rankings-section-header > div:first-child span {
    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.3px;
  }


  .lep-rankings-section-header h2 {
    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      26px;
  }


  .lep-rankings-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;
  }


  .lep-rankings-result-badge {
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
      #eef4f8;

    color:
      #2c5f8a;

    font-size:
      8px;

    font-weight:
      900;
  }


  /* =======================================================
     SORT
  ======================================================= */

  .lep-rankings-sort-bar {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;

    margin-bottom:
      17px;
  }


  .lep-rankings-sort-bar > span {
    margin-right:
      3px;

    color:
      #94a3b8;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1px;
  }


  .lep-ranking-sort {
    min-height:
      34px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      5px;

    padding:
      0 9px;

    border:
      1px solid
      #dbe4ec;

    border-radius:
      8px;

    background:
      #ffffff;

    color:
      #475569;

    font-family:
      inherit;

    font-size:
      8px;

    font-weight:
      800;

    cursor:
      pointer;

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-ranking-sort:hover {
    transform:
      translateY(-2px);
  }


  .lep-ranking-sort.active {
    background:
      #1a365d;

    border-color:
      #1a365d;

    color:
      #ffffff;

    box-shadow:
      0 5px 0
      #142b47;
  }


  /* =======================================================
     RANKING LIST
  ======================================================= */

  .lep-rankings-list {
    display:
      grid;

    gap:
      12px;
  }


  .lep-ranking-card {
    display:
      grid;

    grid-template-columns:
      48px
      58px
      minmax(0,1fr)
      130px
      130px;

    gap:
      13px;

    align-items:
      center;

    padding:
      15px;

    border:
      1px solid
      #e0e8ef;

    border-radius:
      15px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f4f8fb
      );

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.05);

    transition:
      transform .3s ease,
      box-shadow .3s ease,
      border-color .3s ease;
  }


  .lep-ranking-card:hover {
    transform:
      perspective(1000px)
      rotateX(2deg)
      rotateY(-1deg)
      translateY(-5px);

    box-shadow:
      0 23px 46px
      rgba(26,54,93,.11);

    border-color:
      rgba(44,95,138,.23);
  }


  .lep-ranking-card.top-ranked {
    border:
      1px solid
      rgba(255,107,0,.25);

    background:
      linear-gradient(
        145deg,
        #fffdf9,
        #f4f8fb
      );
  }


  .lep-ranking-position {
    width:
      43px;

    height:
      43px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      11px;

    background:
      #1a365d;

    color:
      #ff9348;

    font-size:
      16px;

    font-weight:
      900;

    box-shadow:
      0 7px 0
      #142b47;
  }


  .lep-ranking-card.top-ranked
    .lep-ranking-position {
    background:
      linear-gradient(
        145deg,
        #ff6b00,
        #e65f00
      );

    color:
      #ffffff;

    box-shadow:
      0 7px 0
      #b84b00;
  }


  .lep-ranking-logo {
    width:
      58px;

    height:
      58px;

    display:
      grid;

    place-items:
      center;

    overflow:
      hidden;

    border:
      1px solid
      #e2e8ef;

    border-radius:
      14px;

    background:
      #f6f9fb;

    color:
      #2c5f8a;
  }


  .lep-ranking-logo img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-ranking-school-info {
    min-width:
      0;
  }


  .lep-ranking-type {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    padding:
      4px 6px;

    border-radius:
      5px;

    background:
      #eef4f8;

    color:
      #2c5f8a;

    font-size:
      6px;

    font-weight:
      900;

    letter-spacing:
      .6px;
  }


  .lep-ranking-school-info h2 {
    margin-top:
      6px;

    overflow:
      hidden;

    color:
      #1a365d;

    font-size:
      16px;

    white-space:
      nowrap;

    text-overflow:
      ellipsis;
  }


  .lep-ranking-school-info p {
    display:
      flex;

    align-items:
      center;

    gap:
      5px;

    margin-top:
      4px;

    color:
      #718096;

    font-size:
      8px;
  }


  .lep-ranking-rating {
    text-align:
      center;
  }


  .lep-ranking-rating strong {
    display:
      block;

    color:
      #1a365d;

    font-size:
      24px;

    line-height:
      1;
  }


  .lep-ranking-stars {
    margin-top:
      4px;

    color:
      #e9a12d;

    font-size:
      11px;

    letter-spacing:
      1px;
  }


  .lep-ranking-rating span {
    display:
      block;

    margin-top:
      4px;

    color:
      #94a3b8;

    font-size:
      7px;
  }


  .lep-ranking-view-btn {
    min-height:
      38px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 10px;

    border-radius:
      8px;

    background:
      #1a365d;

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      8px;

    font-weight:
      900;

    box-shadow:
      0 6px 0
      #142b47;

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-ranking-view-btn:hover {
    transform:
      translateY(-2px);

    background:
      #2c5f8a;
  }


  /* =======================================================
     STATES
  ======================================================= */

  .lep-rankings-state {
    min-height:
      320px;

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
      #e0e8ef;

    border-radius:
      15px;

    background:
      #ffffff;

    box-shadow:
      0 12px 28px
      rgba(26,54,93,.045);
  }


  .lep-rankings-state.error {
    border-color:
      #efcccc;

    background:
      #fffafa;
  }


  .lep-rankings-state-icon {
    width:
      63px;

    height:
      63px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      13px;

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
      0 9px 0
      #142b47;
  }


  .lep-rankings-state.error
    .lep-rankings-state-icon {
    background:
      linear-gradient(
        145deg,
        #6b2430,
        #a83343
      );

    color:
      #ffb5bd;

    box-shadow:
      0 9px 0
      #501b23;
  }


  .lep-rankings-state h3 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-rankings-state p {
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


  .lep-rankings-retry {
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
  }


  /* =======================================================
     RESPONSIVE
  ======================================================= */

  @media (max-width: 1050px) {

    .lep-ranking-card {
      grid-template-columns:
        48px
        58px
        minmax(0,1fr)
        120px;
    }


    .lep-ranking-view-btn {
      grid-column:
        4;
    }

  }


  @media (max-width: 850px) {

    .lep-rankings-hero-grid {
      grid-template-columns:
        1fr;
    }


    .lep-rankings-feature-card {
      max-width:
        460px;

      transform:
        none;
    }


    .lep-ranking-card {
      grid-template-columns:
        48px
        58px
        minmax(0,1fr);
    }


    .lep-ranking-rating {
      grid-column:
        3;

      justify-self:
        start;

      text-align:
        left;
    }


    .lep-ranking-view-btn {
      grid-column:
        3;

      width:
        max-content;
    }

  }


  @media (max-width: 600px) {

    .lep-rankings-container {
      width:
        calc(100% - 24px);
    }


    .lep-rankings-hero {
      padding:
        48px 0 52px;
    }


    .lep-rankings-hero h1 {
      font-size:
        43px;
    }


    .lep-rankings-hero-stats {
      display:
        grid;

      grid-template-columns:
        repeat(
          3,
          minmax(0,1fr)
        );
    }


    .lep-rankings-hero-stats div {
      min-width:
        0;

      padding:
        10px;
    }


    .lep-rankings-section-header {
      display:
        block;
    }


    .lep-rankings-result-badge {
      margin-top:
        10px;
    }


    .lep-ranking-card {
      grid-template-columns:
        43px
        54px
        minmax(0,1fr);

      gap:
        10px;

      padding:
        12px;
    }


    .lep-ranking-logo {
      width:
        54px;

      height:
        54px;
    }


    .lep-ranking-school-info h2 {
      font-size:
        14px;
    }


    .lep-ranking-rating {
      grid-column:
        1 / -1;

      justify-self:
        stretch;

      display:
        flex;

      align-items:
        center;

      gap:
        8px;

      text-align:
        left;

      padding-top:
        8px;

      border-top:
        1px solid
        #edf1f4;
    }


    .lep-ranking-rating strong {
      font-size:
        20px;
    }


    .lep-ranking-stars {
      margin-top:
        0;
    }


    .lep-ranking-rating span {
      margin-top:
        0;
    }


    .lep-ranking-view-btn {
      grid-column:
        1 / -1;

      width:
        100%;
    }

  }

`;

export default Rankings;
