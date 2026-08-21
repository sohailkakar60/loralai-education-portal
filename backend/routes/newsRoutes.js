const express = require("express");

const {
  createNews,
  getPublishedNews,
  getPublishedNewsBySlug,
  getAllNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
} = require("../controllers/newsController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================================================
// PUBLIC NEWS
// =========================================================

router.get(
  "/",
  getPublishedNews
);

router.get(
  "/:slug",
  getPublishedNewsBySlug
);


// =========================================================
// ADMIN NEWS
// =========================================================

router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  getAllNews
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createNews
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateNews
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteNews
);

router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  toggleNewsStatus
);


module.exports = router;