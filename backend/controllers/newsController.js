const { pool } = require("../config/db");


// =========================================================
// HELPERS
// =========================================================

const ALLOWED_CATEGORIES = [
  "education",
  "scholarships",
  "admissions",
  "exams",
  "events",
  "jobs",
  "announcements",
  "general",
];


const normalizeCategory = (category) => {
  return ALLOWED_CATEGORIES.includes(category)
    ? category
    : "general";
};


const normalizeStatus = (status) => {
  return status === "published"
    ? "published"
    : "draft";
};


const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


// =========================================================
// CREATE NEWS
// =========================================================

const createNews = async (
  req,
  res
) => {

  const {
    title,
    category,
    summary,
    content,
    cover_image_url,
    status,
  } = req.body;


  if (
    !title ||
    !title.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "News title is required.",
    });

  }


  if (
    !content ||
    !content.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "News content is required.",
    });

  }


  const finalCategory =
    normalizeCategory(category);


  const finalStatus =
    normalizeStatus(status);


  try {

    const baseSlug =
      createSlug(title) ||
      `news-${Date.now()}`;


    let slug =
      baseSlug;

    let counter =
      1;


    while (true) {

      const [existing] =
        await pool.execute(
          `SELECT id
           FROM news
           WHERE slug = ?
           LIMIT 1`,
          [slug]
        );


      if (
        existing.length === 0
      ) {
        break;
      }


      slug =
        `${baseSlug}-${counter}`;

      counter++;

    }


    const [result] =
      await pool.execute(
        `INSERT INTO news (
          title,
          slug,
          category,
          summary,
          content,
          cover_image_url,
          author_id,
          status,
          published_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title.trim(),
          slug,
          finalCategory,
          summary?.trim() ||
            null,
          content.trim(),
          cover_image_url?.trim() ||
            null,
          req.user.userId,
          finalStatus,
          finalStatus ===
          "published"
            ? new Date()
            : null,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "News created successfully.",

      data: {
        id:
          result.insertId,
        slug,
      },
    });


  } catch (error) {

    console.error(
      "Create news error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to create news.",
    });

  }

};


// =========================================================
// GET PUBLISHED NEWS
// =========================================================

const getPublishedNews =
  async (
    req,
    res
  ) => {

    try {

      const [news] =
        await pool.execute(
          `SELECT
            n.id,
            n.title,
            n.slug,
            n.category,
            n.summary,
            n.cover_image_url,
            n.status,
            n.published_at,
            n.created_at,
            u.full_name AS author_name
          FROM news n
          LEFT JOIN users u
            ON u.id = n.author_id
          WHERE n.status = 'published'
          ORDER BY
            n.published_at DESC,
            n.created_at DESC`
        );


      return res.status(200).json({
        success: true,
        data: {
          news,
        },
      });


    } catch (error) {

      console.error(
        "Get published news error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load news.",
      });

    }

  };


// =========================================================
// GET SINGLE PUBLISHED NEWS
// =========================================================

const getPublishedNewsBySlug =
  async (
    req,
    res
  ) => {

    const { slug } =
      req.params;


    if (!slug) {

      return res.status(400).json({
        success: false,
        message:
          "News slug is required.",
      });

    }


    try {

      const [news] =
        await pool.execute(
          `SELECT
            n.id,
            n.title,
            n.slug,
            n.category,
            n.summary,
            n.content,
            n.cover_image_url,
            n.status,
            n.published_at,
            n.created_at,
            n.updated_at,
            u.full_name AS author_name
          FROM news n
          LEFT JOIN users u
            ON u.id = n.author_id
          WHERE n.slug = ?
            AND n.status = 'published'
          LIMIT 1`,
          [slug]
        );


      if (
        news.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "News article not found.",
        });

      }


      return res.status(200).json({
        success: true,
        data: {
          news:
            news[0],
        },
      });


    } catch (error) {

      console.error(
        "Get news article error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load news article.",
      });

    }

  };


// =========================================================
// GET ALL NEWS FOR ADMIN
// =========================================================

const getAllNews = async (
  req,
  res
) => {

  try {

    const [news] =
      await pool.execute(
        `SELECT
          n.id,
          n.title,
          n.slug,
          n.category,
          n.summary,
          n.content,
          n.cover_image_url,
          n.status,
          n.published_at,
          n.created_at,
          n.updated_at,
          u.full_name AS author_name
        FROM news n
        LEFT JOIN users u
          ON u.id = n.author_id
        ORDER BY
          n.created_at DESC`
      );


    return res.status(200).json({
      success: true,
      data: {
        news,
      },
    });


  } catch (error) {

    console.error(
      "Get all news error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin news.",
    });

  }

};


// =========================================================
// UPDATE NEWS
// =========================================================

const updateNews = async (
  req,
  res
) => {

  const { id } =
    req.params;


  const {
    title,
    category,
    summary,
    content,
    cover_image_url,
    status,
  } = req.body;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "News ID is required.",
    });

  }


  if (
    !title ||
    !title.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "News title is required.",
    });

  }


  if (
    !content ||
    !content.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "News content is required.",
    });

  }


  const finalCategory =
    normalizeCategory(category);


  const finalStatus =
    normalizeStatus(status);


  try {

    const [existing] =
      await pool.execute(
        `SELECT
          id,
          published_at
        FROM news
        WHERE id = ?
        LIMIT 1`,
        [id]
      );


    if (
      existing.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "News article not found.",
      });

    }


    let publishedAt =
      existing[0].published_at;


    if (
      finalStatus ===
        "published" &&
      !publishedAt
    ) {

      publishedAt =
        new Date();

    }


    if (
      finalStatus ===
      "draft"
    ) {

      publishedAt =
        null;

    }


    await pool.execute(
      `UPDATE news
       SET
         title = ?,
         category = ?,
         summary = ?,
         content = ?,
         cover_image_url = ?,
         status = ?,
         published_at = ?
       WHERE id = ?`,
      [
        title.trim(),
        finalCategory,
        summary?.trim() ||
          null,
        content.trim(),
        cover_image_url?.trim() ||
          null,
        finalStatus,
        publishedAt,
        id,
      ]
    );


    return res.status(200).json({
      success: true,
      message:
        "News updated successfully.",
    });


  } catch (error) {

    console.error(
      "Update news error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to update news.",
    });

  }

};


// =========================================================
// DELETE NEWS
// =========================================================

const deleteNews = async (
  req,
  res
) => {

  const { id } =
    req.params;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "News ID is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `DELETE FROM news
         WHERE id = ?`,
        [id]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "News article not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "News deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete news error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to delete news.",
    });

  }

};


// =========================================================
// PUBLISH / UNPUBLISH
// =========================================================

const toggleNewsStatus =
  async (
    req,
    res
  ) => {

    const { id } =
      req.params;


    if (!id) {

      return res.status(400).json({
        success: false,
        message:
          "News ID is required.",
      });

    }


    try {

      const [existing] =
        await pool.execute(
          `SELECT
            id,
            status,
            published_at
          FROM news
          WHERE id = ?
          LIMIT 1`,
          [id]
        );


      if (
        existing.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "News article not found.",
        });

      }


      const article =
        existing[0];


      const newStatus =
        article.status ===
        "published"
          ? "draft"
          : "published";


      const publishedAt =
        newStatus ===
        "published"
          ? new Date()
          : null;


      await pool.execute(
        `UPDATE news
         SET
           status = ?,
           published_at = ?
         WHERE id = ?`,
        [
          newStatus,
          publishedAt,
          id,
        ]
      );


      return res.status(200).json({
        success: true,
        message:
          newStatus ===
          "published"
            ? "News published successfully."
            : "News moved to draft.",
      });


    } catch (error) {

      console.error(
        "Toggle news status error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to change news status.",
      });

    }

  };


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createNews,
  getPublishedNews,
  getPublishedNewsBySlug,
  getAllNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
};