import { useEffect, useState } from "react";

import API_URL from "../config/api";


function ReviewsSection({ institutionId }) {
  const [reviews, setReviews] =
    useState([]);

  const [summary, setSummary] =
    useState({
      total_reviews: 0,
      average_rating: 0,
    });


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD REVIEWS
  // =========================================================

  useEffect(() => {

    const loadReviews =
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await fetch(
              `${API_URL}/api/reviews/institution/${institutionId}`
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


          setSummary(
            data.data?.summary || {
              total_reviews: 0,
              average_rating: 0,
            }
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


    if (institutionId) {
      loadReviews();
    } else {
      setLoading(false);
    }

  }, [institutionId]);


  // =========================================================
  // RATING
  // =========================================================

  const average =
    Number(
      summary.average_rating || 0
    );


  const roundedAverage =
    Math.min(
      5,
      Math.max(
        0,
        Math.round(average)
      )
    );


  return (
    <section className="detail-card reviews-section">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="reviews-header">

        <div>

          <span className="detail-label">
            COMMUNITY RATING
          </span>


          <h2>
            Reviews & Ratings
          </h2>

        </div>


        <div className="reviews-summary">

          <strong>
            {average.toFixed(1)}
          </strong>


          <div className="review-stars">

            {"★".repeat(
              roundedAverage
            )}

            {"☆".repeat(
              5 - roundedAverage
            )}

          </div>


          <span>

            {summary.total_reviews}{" "}

            {summary.total_reviews ===
            1
              ? "review"
              : "reviews"}

          </span>

        </div>

      </div>


      {/* =====================================================
          STATES
      ===================================================== */}

      {loading ? (

        <p className="reviews-empty">
          Loading reviews...
        </p>

      ) : error ? (

        <p className="reviews-error">
          {error}
        </p>

      ) : reviews.length === 0 ? (

        <div className="reviews-empty">

          <h3>
            No Reviews Yet
          </h3>


          <p>
            Be the first person to share your
            experience with this institution.
          </p>

        </div>

      ) : (

        <div className="reviews-list">

          {reviews.map(
            (review) => {

              const reviewRating =
                Math.min(
                  5,
                  Math.max(
                    0,
                    Number(
                      review.rating || 0
                    )
                  )
                );


              return (

                <article
                  key={
                    review.id
                  }
                  className="review-card"
                >


                  <div className="review-card-top">

                    <div>

                      <h3>
                        {review.title ||
                          "Institution Review"}
                      </h3>


                      <p className="review-author">

                        {review.reviewer_name ||
                          "Anonymous"}

                      </p>

                    </div>


                    <div className="review-stars">

                      {"★".repeat(
                        reviewRating
                      )}

                      {"☆".repeat(
                        5 - reviewRating
                      )}

                    </div>

                  </div>


                  <p className="review-text">
                    {review.review_text}
                  </p>


                  <span className="review-date">

                    {review.created_at
                      ? new Date(
                          review.created_at
                        ).toLocaleDateString()
                      : ""}

                  </span>

                </article>

              );

            }
          )}

        </div>

      )}

    </section>
  );
}


export default ReviewsSection;