const express = require("express");

const {
  getDashboardSummary,
  createInstitution,
  getAllInstitutions,
  getInstitutionById,
  updateInstitution,
  approveInstitution,
  deleteInstitution,
  getPendingReviews,
  approveReview,
  rejectReview,
} = require("../controllers/adminController");
const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();


// Dashboard

router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  getDashboardSummary
);


// Institutions

router.post(
  "/institutions",
  authenticateToken,
  requireAdmin,
  createInstitution
);

router.get(
  "/institutions",
  authenticateToken,
  requireAdmin,
  getAllInstitutions
);

router.put(
  "/institutions/:id",
  authenticateToken,
  requireAdmin,
  updateInstitution
);

router.put(
  "/institutions/:id/approve",
  authenticateToken,
  requireAdmin,
  approveInstitution
);


// Reviews

router.get(
  "/reviews/pending",
  authenticateToken,
  requireAdmin,
  getPendingReviews
);

router.put(
  "/reviews/:id/approve",
  authenticateToken,
  requireAdmin,
  approveReview
);

router.put(
  "/reviews/:id/reject",
  authenticateToken,
  requireAdmin,
  rejectReview
);

router.get(
  "/institutions/:id",
  authenticateToken,
  requireAdmin,
  getInstitutionById
);
router.delete(
  "/institutions/:id",
  authenticateToken,
  requireAdmin,
  deleteInstitution
);

module.exports = router;