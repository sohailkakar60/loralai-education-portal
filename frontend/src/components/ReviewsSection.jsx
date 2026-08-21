import { useEffect, useState } from "react";

function ReviewsSection({ institutionId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    total_reviews: 0,
    average_rating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/reviews/institution/${institutionId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load reviews."
          );
        }

        setReviews(data.data?.reviews || []);

        setSummary(
          data.data?.summary || {
            total_reviews: 0,
            average_rating: 0,
          }
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Failed to load reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    if (institutionId) {
      loadReviews();
    }
  }, [institutionId]);

  const average =
    Number(summary.average_rating || 0);

  return (
    <section className="detail-card reviews-section">

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
              Math.round(average)
            )}
            {"☆".repeat(
              5 - Math.round(average)
            )}
          </div>

          <span>
            {summary.total_reviews}{" "}
            {summary.total_reviews === 1
              ? "review"
              : "reviews"}
          </span>

        </div>

      </div>


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

          {reviews.map((review) => (

            <article
              key={review.id}
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
                    Number(review.rating || 0)
                  )}

                  {"☆".repeat(
                    5 -
                      Number(
                        review.rating || 0
                      )
                  )}
                </div>

              </div>


              <p className="review-text">
                {review.review_text}
              </p>


              <span className="review-date">
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </span>

            </article>

          ))}

        </div>
      )}

    </section>
  );
}

export default ReviewsSection;