import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../config/api";


function ReviewForm({ institutionId }) {
  const navigate = useNavigate();


  const [rating, setRating] =
    useState(5);

  const [title, setTitle] =
    useState("");

  const [reviewText, setReviewText] =
    useState("");


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      const token =
        localStorage.getItem(
          "authToken"
        );


      const authUser =
        localStorage.getItem(
          "authUser"
        );


      if (
        !token ||
        !authUser
      ) {

        setError(
          "Please login before submitting a review."
        );

        return;
      }


      if (!title.trim()) {

        setError(
          "Please enter a review title."
        );

        return;
      }


      if (!reviewText.trim()) {

        setError(
          "Please write your review."
        );

        return;
      }


      try {

        setLoading(true);


        const response =
          await fetch(
            `${API_URL}/api/reviews`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  institution_id:
                    institutionId,

                  rating:
                    Number(rating),

                  title:
                    title.trim(),

                  review_text:
                    reviewText.trim(),
                }),
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
              "Failed to submit review."
          );

        }


        setSuccess(
          "Your review was submitted and is waiting for admin approval."
        );


        setTitle("");
        setReviewText("");
        setRating(5);


      } catch (err) {

        console.error(
          "Submit review error:",
          err
        );


        setError(
          err.message ||
            "Failed to submit review."
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = () => {
    navigate("/login");
  };


  return (
    <section className="detail-card review-form-section">


      <span className="detail-label">
        SHARE YOUR EXPERIENCE
      </span>


      <h2>
        Write a Review
      </h2>


      <p className="review-form-description">
        Your review will be checked by the portal
        team before it becomes public.
      </p>


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


      <form
        className="review-form"
        onSubmit={
          handleSubmit
        }
      >


        {/* =================================================
            RATING
        ================================================= */}

        <div className="review-rating-input">

          <label>
            Your Rating
          </label>


          <div className="rating-stars-input">

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? "rating-star selected"
                      : "rating-star"
                  }
                  onClick={() =>
                    setRating(
                      star
                    )
                  }
                  aria-label={
                    `${star} stars`
                  }
                  disabled={
                    loading
                  }
                >
                  ★
                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            TITLE
        ================================================= */}

        <div className="form-field">

          <label htmlFor="review-title">
            Review Title
          </label>


          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            placeholder="Example: Excellent school"
            maxLength={150}
            disabled={loading}
          />

        </div>


        {/* =================================================
            REVIEW
        ================================================= */}

        <div className="form-field">

          <label htmlFor="review-text">
            Your Review
          </label>


          <textarea
            id="review-text"
            value={reviewText}
            onChange={(event) =>
              setReviewText(
                event.target.value
              )
            }
            placeholder="Share your experience..."
            rows={5}
            maxLength={1000}
            disabled={loading}
          />

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="review-form-actions">


          <button
            type="submit"
            className="dashboard-primary-btn"
            disabled={
              loading
            }
          >

            {loading
              ? "Submitting..."
              : "Submit Review"}

          </button>


          {!localStorage.getItem(
            "authToken"
          ) && (

            <button
              type="button"
              className="secondary-btn"
              onClick={
                handleLogin
              }
            >
              Login First
            </button>

          )}

        </div>

      </form>

    </section>
  );
}


export default ReviewForm;