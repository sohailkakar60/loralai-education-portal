import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SmartIcon from "../components/SmartIcon";


function AdminReviews() {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [ratingFilter, setRatingFilter] =
    useState("all");


  // =========================================================
  // LOAD REVIEWS
  // =========================================================

  const loadReviews = async () => {
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
          "http://localhost:5000/api/admin/reviews/pending",
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
            "Failed to load reviews."
        );
      }


      setReviews(
        data.data?.reviews || []
      );

    } catch (err) {

      console.error(
        "Load reviews error:",
        err
      );

      setError(
        err.message ||
          "Failed to load reviews."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadReviews();
  }, []);


  // =========================================================
  // APPROVE / REJECT
  // =========================================================

  const handleAction = async (
    id,
    action
  ) => {

    const confirmed =
      window.confirm(
        action === "approve"
          ? "Approve this review and publish it?"
          : "Reject this review?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setActionLoading(id);
      setError("");
      setMessage("");


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
          `http://localhost:5000/api/admin/reviews/${id}/${action}`,
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
            `Failed to ${action} review.`
        );
      }


      setMessage(
        action === "approve"
          ? "Review approved successfully."
          : "Review rejected successfully."
      );


      await loadReviews();

    } catch (err) {

      console.error(
        "Review action error:",
        err
      );


      setError(
        err.message ||
          `Failed to ${action} review.`
      );

    } finally {

      setActionLoading(null);

    }
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filteredReviews =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      return reviews.filter(
        (review) => {

          const rating =
            Number(
              review.rating || 0
            );


          const matchesSearch =
            !query ||
            review.title
              ?.toLowerCase()
              .includes(query) ||
            review.reviewer_name
              ?.toLowerCase()
              .includes(query) ||
            review.institution_name
              ?.toLowerCase()
              .includes(query) ||
            review.review_text
              ?.toLowerCase()
              .includes(query);


          const matchesRating =
            ratingFilter === "all" ||
            rating ===
              Number(ratingFilter);


          return (
            matchesSearch &&
            matchesRating
          );

        }
      );

    }, [
      reviews,
      search,
      ratingFilter,
    ]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const averageRating =
    reviews.length
      ? (
          reviews.reduce(
            (sum, review) =>
              sum +
              Number(
                review.rating || 0
              ),
            0
          ) /
          reviews.length
        ).toFixed(1)
      : "0.0";


  const fiveStarCount =
    reviews.filter(
      (review) =>
        Number(review.rating) ===
        5
    ).length;


  const lowRatingCount =
    reviews.filter(
      (review) =>
        Number(review.rating) <=
        2
    ).length;


  // =========================================================
  // STARS
  // =========================================================

  const renderStars = (
    rating
  ) => {

    const safeRating =
      Math.min(
        5,
        Math.max(
          0,
          Number(rating || 0)
        )
      );


    return (
      <span className="lep-review-stars">

        {"★".repeat(
          safeRating
        )}

        {"☆".repeat(
          5 - safeRating
        )}

      </span>
    );
  };


  return (
    <>
      <style>{styles}</style>


      <main className="lep-admin-reviews">

        <div className="lep-reviews-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lep-reviews-header">

            <div className="lep-reviews-heading">

              <div className="lep-reviews-page-icon">

                <SmartIcon
                  name="reviews"
                  size={29}
                />

              </div>


              <div>

                <span className="lep-reviews-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  ADMINISTRATION

                </span>


                <h1>
                  Review Moderation
                </h1>


                <p>
                  Review, approve or reject
                  feedback submitted by users.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="lep-reviews-refresh"
              onClick={loadReviews}
              disabled={loading}
            >

              <SmartIcon
                name="settings"
                size={14}
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </header>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (

            <div className="lep-reviews-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {message && (

            <div className="lep-reviews-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {message}

            </div>

          )}


          {/* =================================================
              METRICS
          ================================================= */}

          <section className="lep-reviews-metrics">


            <div className="lep-reviews-metric">

              <div className="lep-reviews-metric-icon">

                <SmartIcon
                  name="reviews"
                  size={19}
                />

              </div>


              <span>
                PENDING REVIEWS
              </span>


              <strong>
                {reviews.length}
              </strong>

            </div>


            <div className="lep-reviews-metric">

              <div className="lep-reviews-metric-icon">

                <SmartIcon
                  name="star"
                  size={19}
                />

              </div>


              <span>
                AVERAGE RATING
              </span>


              <strong>
                {averageRating}
              </strong>

            </div>


            <div className="lep-reviews-metric">

              <div className="lep-reviews-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                FIVE STAR
              </span>


              <strong>
                {fiveStarCount}
              </strong>

            </div>


            <div className="lep-reviews-metric">

              <div className="lep-reviews-metric-icon">

                <SmartIcon
                  name="warning"
                  size={19}
                />

              </div>


              <span>
                LOW RATING
              </span>


              <strong>
                {lowRatingCount}
              </strong>

            </div>

          </section>


          {/* =================================================
              REVIEW DIRECTORY
          ================================================= */}

          <section className="lep-reviews-section">


            <div className="lep-reviews-section-header">

              <div className="lep-reviews-section-icon">

                <SmartIcon
                  name="reviews"
                  size={22}
                />

              </div>


              <div>

                <span>
                  MODERATION QUEUE
                </span>


                <h2>
                  Pending Reviews
                </h2>


                <p>
                  Approve trustworthy reviews
                  before they appear publicly.
                </p>

              </div>

            </div>


            {reviews.length > 0 && (

              <div className="lep-reviews-filter">


                <div className="lep-reviews-search">

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
                    placeholder="Search reviewer, institution or review..."
                  />

                </div>


                <select
                  value={
                    ratingFilter
                  }
                  onChange={(event) =>
                    setRatingFilter(
                      event.target.value
                    )
                  }
                  className="lep-reviews-rating-filter"
                >

                  <option value="all">
                    All Ratings
                  </option>

                  <option value="5">
                    5 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="1">
                    1 Star
                  </option>

                </select>


                <div className="lep-reviews-count">

                  <span>
                    SHOWING
                  </span>

                  <strong>
                    {
                      filteredReviews.length
                    }
                  </strong>

                </div>

              </div>

            )}


            {loading ? (

              <div className="lep-reviews-state">

                <div className="lep-reviews-state-icon">

                  <SmartIcon
                    name="reviews"
                    size={28}
                  />

                </div>


                <h2>
                  Loading Reviews...
                </h2>


                <p>
                  Please wait while we load
                  the moderation queue.
                </p>

              </div>

            ) : reviews.length === 0 ? (

              <div className="lep-reviews-state">

                <div className="lep-reviews-state-icon">

                  <SmartIcon
                    name="verified"
                    size={28}
                  />

                </div>


                <h2>
                  No Pending Reviews
                </h2>


                <p>
                  There are currently no reviews
                  waiting for moderation.
                </p>

              </div>

            ) : filteredReviews.length === 0 ? (

              <div className="lep-reviews-state">

                <div className="lep-reviews-state-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h2>
                  No Matching Reviews
                </h2>


                <p>
                  Try another search term or
                  rating filter.
                </p>

              </div>

            ) : (

              <div className="lep-reviews-list">

                {filteredReviews.map(
                  (review) => {

                    const processing =
                      actionLoading ===
                      review.id;


                    return (

                      <article
                        key={
                          review.id
                        }
                        className="lep-review-card"
                      >


                        {/* CARD ICON */}

                        <div className="lep-review-avatar">

                          <SmartIcon
                            name="reviews"
                            size={23}
                          />

                        </div>


                        {/* CONTENT */}

                        <div className="lep-review-content">


                          <div className="lep-review-top">


                            <div>

                              <div className="lep-review-title-row">

                                <span className="lep-review-pending">

                                  <SmartIcon
                                    name="calendar"
                                    size={10}
                                  />

                                  Pending

                                </span>


                                <span className="lep-review-rating">

                                  {
                                    Number(
                                      review.rating ||
                                        0
                                    )
                                  }/5

                                </span>

                              </div>


                              <h3>
                                {
                                  review.title ||
                                  "Institution Review"
                                }
                              </h3>


                              <p className="lep-review-meta">

                                <SmartIcon
                                  name="user"
                                  size={11}
                                />

                                {
                                  review.reviewer_name ||
                                  "User"
                                }


                                <span>
                                  •
                                </span>


                                <SmartIcon
                                  name="school"
                                  size={11}
                                />

                                {
                                  review.institution_name ||
                                  "Institution"
                                }

                              </p>

                            </div>


                            <div className="lep-review-stars-wrapper">

                              {renderStars(
                                review.rating
                              )}

                            </div>

                          </div>


                          <p className="lep-review-text">

                            {
                              review.review_text ||
                              "No review text provided."
                            }

                          </p>


                          <div className="lep-review-actions">


                            <button
                              type="button"
                              className="lep-review-approve"
                              onClick={() =>
                                handleAction(
                                  review.id,
                                  "approve"
                                )
                              }
                              disabled={
                                processing
                              }
                            >

                              <SmartIcon
                                name="verified"
                                size={13}
                              />

                              {processing
                                ? "Processing..."
                                : "Approve"}

                            </button>


                            <button
                              type="button"
                              className="lep-review-reject"
                              onClick={() =>
                                handleAction(
                                  review.id,
                                  "reject"
                                )
                              }
                              disabled={
                                processing
                              }
                            >

                              <SmartIcon
                                name="delete"
                                size={13}
                              />

                              Reject

                            </button>

                          </div>

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>

        </div>

      </main>
    </>
  );
}


const styles = `

  .lep-admin-reviews {
    min-height: 100vh;

    padding:
      45px 0 90px;

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


  .lep-reviews-container {
    width:
      min(
        1150px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* HEADER */

  .lep-reviews-header {
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


  .lep-reviews-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-reviews-page-icon {
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


  .lep-reviews-eyebrow {
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


  .lep-reviews-heading h1 {
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


  .lep-reviews-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-reviews-refresh {
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

    font-family:
      inherit;

    font-size:
      10px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  .lep-reviews-refresh:hover {
    border-color:
      #2c5f8a;
  }


  /* MESSAGES */

  .lep-reviews-message {
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


  .lep-reviews-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-reviews-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* METRICS */

  .lep-reviews-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-reviews-metric {
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


  .lep-reviews-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-reviews-metric-icon {
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


  .lep-reviews-metric span {
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


  .lep-reviews-metric strong {
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

  .lep-reviews-section {
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


  .lep-reviews-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      20px;
  }


  .lep-reviews-section-icon {
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
      0 8px 0 #142b47;
  }


  .lep-reviews-section-header span {
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


  .lep-reviews-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-reviews-section-header p {
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

  .lep-reviews-filter {
    display:
      grid;

    grid-template-columns:
      minmax(0,1fr)
      170px
      100px;

    gap:
      9px;

    margin-bottom:
      15px;
  }


  .lep-reviews-search {
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


  .lep-reviews-search svg {
    color:
      #2c5f8a;
  }


  .lep-reviews-search input {
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


  .lep-reviews-rating-filter {
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


  .lep-reviews-count {
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


  .lep-reviews-count span {
    color:
      #aebfce;

    font-size:
      7px;

    font-weight:
      900;
  }


  .lep-reviews-count strong {
    color:
      #ff9348;

    font-size:
      17px;
  }


  /* REVIEW CARDS */

  .lep-reviews-list {
    display:
      grid;

    gap:
      11px;
  }


  .lep-review-card {
    position:
      relative;

    overflow:
      hidden;

    display:
      grid;

    grid-template-columns:
      50px
      minmax(0,1fr);

    gap:
      14px;

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
        #f4f8fb
      );

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }


  .lep-review-card::before {
    content:
      "";

    position:
      absolute;

    left:
      0;

    top:
      0;

    bottom:
      0;

    width:
      4px;

    background:
      linear-gradient(
        180deg,
        #1a365d,
        #ff6b00
      );
  }


  .lep-review-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 18px 38px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-review-avatar {
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


  .lep-review-top {
    display:
      flex;

    align-items:
      flex-start;

    justify-content:
      space-between;

    gap:
      15px;
  }


  .lep-review-title-row {
    display:
      flex;

    align-items:
      center;

    gap:
      7px;

    margin-bottom:
      6px;
  }


  .lep-review-pending {
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
      #fff5e8;

    color:
      #b25c00;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-review-rating {
    display:
      inline-flex;

    align-items:
      center;

    padding:
      5px 7px;

    border-radius:
      6px;

    background:
      #f0f4f8;

    color:
      #475569;

    font-size:
      7px;

    font-weight:
      900;
  }


  .lep-review-content h3 {
    color:
      #1a365d;

    font-size:
      16px;
  }


  .lep-review-meta {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      5px;

    margin-top:
      6px;

    color:
      #718096;

    font-size:
      8px;
  }


  .lep-review-meta svg {
    color:
      #2c5f8a;
  }


  .lep-review-meta span {
    color:
      #c2ccd5;
  }


  .lep-review-stars-wrapper {
    flex-shrink:
      0;

    padding:
      6px 9px;

    border-radius:
      8px;

    background:
      #fffaf0;
  }


  .lep-review-stars {
    color:
      #e89b16;

    font-size:
      14px;

    letter-spacing:
      1px;

    white-space:
      nowrap;
  }


  .lep-review-text {
    margin-top:
      13px;

    padding:
      12px;

    border:
      1px solid #edf1f5;

    border-radius:
      9px;

    background:
      #f9fbfd;

    color:
      #556575;

    font-size:
      10px;

    line-height:
      1.75;
  }


  .lep-review-actions {
    display:
      flex;

    gap:
      8px;

    margin-top:
      12px;
  }


  .lep-review-approve,
  .lep-review-reject {
    min-height:
      37px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 12px;

    border-radius:
      8px;

    font-family:
      inherit;

    font-size:
      9px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  .lep-review-approve {
    border:
      none;

    background:
      #16803c;

    color:
      #ffffff;
  }


  .lep-review-approve:hover {
    background:
      #11652f;
  }


  .lep-review-reject {
    border:
      1px solid #f0caca;

    background:
      #fff7f7;

    color:
      #b42318;
  }


  .lep-review-reject:hover {
    background:
      #ffeded;
  }


  /* STATE */

  .lep-reviews-state {
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
      40px;

    text-align:
      center;

    border:
      1px solid #e7edf2;

    border-radius:
      13px;

    background:
      #f9fbfd;
  }


  .lep-reviews-state-icon {
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


  .lep-reviews-state h2 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-reviews-state p {
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


  /* RESPONSIVE */

  @media (max-width: 850px) {

    .lep-reviews-header {
      display:
        block;
    }


    .lep-reviews-refresh {
      margin-top:
        16px;
    }


    .lep-reviews-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-reviews-filter {
      grid-template-columns:
        1fr;
    }

  }


  @media (max-width: 620px) {

    .lep-reviews-heading {
      align-items:
        flex-start;
    }


    .lep-reviews-heading h1 {
      font-size:
        37px;
    }


    .lep-reviews-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-reviews-section {
      padding:
        19px;
    }


    .lep-review-card {
      grid-template-columns:
        44px
        minmax(0,1fr);
    }


    .lep-review-avatar {
      width:
        44px;

      height:
        44px;
    }


    .lep-review-top {
      display:
        block;
    }


    .lep-review-stars-wrapper {
      display:
        inline-block;

      margin-top:
        9px;
    }


    .lep-review-actions {
      display:
        grid;

      grid-template-columns:
        1fr 1fr;
    }


    .lep-review-approve,
    .lep-review-reject {
      width:
        100%;
    }

  }

`;

export default AdminReviews;