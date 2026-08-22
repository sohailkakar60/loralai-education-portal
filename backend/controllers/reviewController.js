const { pool } = require("../config/db");


// =========================================================
// CREATE REVIEW
// =========================================================

const createReview = async (
  req,
  res
) => {

  const {
    institution_id,
    rating,
    title,
    review_text,
  } = req.body;


  if (
    !institution_id ||
    rating === undefined ||
    rating === null ||
    !review_text ||
    !review_text.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution, rating and review text are required.",
    });

  }


  const numericRating =
    Number(rating);


  if (
    !Number.isInteger(
      numericRating
    ) ||
    numericRating < 1 ||
    numericRating > 5
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Rating must be between 1 and 5.",
    });

  }


  if (
    title &&
    title.trim().length > 150
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Review title must be 150 characters or fewer.",
    });

  }


  if (
    review_text.trim().length > 1000
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Review text must be 1000 characters or fewer.",
    });

  }


  try {

    // =======================================================
    // CHECK INSTITUTION
    // =======================================================

    const [institutions] =
      await pool.execute(
        `SELECT id
         FROM institutions
         WHERE id = ?
         LIMIT 1`,
        [institution_id]
      );


    if (
      institutions.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });

    }


    // =======================================================
    // CHECK EXISTING REVIEW
    // =======================================================

    const [existingReviews] =
      await pool.execute(
        `SELECT id
         FROM reviews
         WHERE institution_id = ?
           AND user_id = ?
         LIMIT 1`,
        [
          institution_id,
          req.user.userId,
        ]
      );


    if (
      existingReviews.length > 0
    ) {

      return res.status(409).json({
        success: false,
        message:
          "You have already submitted a review for this institution.",
      });

    }


    // =======================================================
    // CREATE PENDING REVIEW
    // =======================================================

    const [result] =
      await pool.execute(
        `INSERT INTO reviews (
          institution_id,
          user_id,
          rating,
          title,
          review_text,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          institution_id,
          req.user.userId,
          numericRating,
          title?.trim() ||
            null,
          review_text.trim(),
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Review submitted successfully. It is waiting for admin approval.",

      data: {
        id: result.insertId,
        status: "pending",
      },
    });


  } catch (error) {

    console.error(
      "Create review error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to submit review.",
    });

  }

};


// =========================================================
// GET PUBLIC REVIEWS
// =========================================================

const getPublicReviews =
  async (
    req,
    res
  ) => {

    const {
      institutionId,
    } = req.params;


    if (!institutionId) {

      return res.status(400).json({
        success: false,
        message:
          "Institution ID is required.",
      });

    }


    try {

      const [reviews] =
        await pool.execute(
          `SELECT
            r.id,
            r.rating,
            r.title,
            r.review_text,
            r.created_at,
            u.full_name AS reviewer_name
           FROM reviews r
           INNER JOIN users u
             ON u.id = r.user_id
           WHERE r.institution_id = ?
             AND r.status = 'approved'
           ORDER BY r.created_at DESC`,
          [institutionId]
        );


      const [summaryRows] =
        await pool.execute(
          `SELECT
            COUNT(*) AS total_reviews,
            COALESCE(
              AVG(rating),
              0
            ) AS average_rating
           FROM reviews
           WHERE institution_id = ?
             AND status = 'approved'`,
          [institutionId]
        );


      const summary =
        summaryRows[0] || {};


      return res.status(200).json({
        success: true,

        data: {
          summary: {
            total_reviews:
              Number(
                summary.total_reviews
              ) || 0,

            average_rating:
              Number(
                summary.average_rating
              ) || 0,
          },

          reviews,
        },
      });


    } catch (error) {

      console.error(
        "Public reviews error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load reviews.",
      });

    }

  };


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createReview,
  getPublicReviews,
};