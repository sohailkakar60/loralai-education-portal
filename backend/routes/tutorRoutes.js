const express = require("express");

const {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  approveTutor,
  rejectTutor,
  deleteTutor,
  getPublicTutors,
  getPublicTutorById,
} = require("../controllers/tutorController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================================================
// PUBLIC
// =========================================================

router.get(
  "/public",
  getPublicTutors
);

router.get(
  "/public/:id",
  getPublicTutorById
);


// =========================================================
// ADMIN
// =========================================================

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createTutor
);

router.get(
  "/",
  authenticateToken,
  requireAdmin,
  getAllTutors
);

router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  getTutorById
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateTutor
);

router.put(
  "/:id/approve",
  authenticateToken,
  requireAdmin,
  approveTutor
);

router.put(
  "/:id/reject",
  authenticateToken,
  requireAdmin,
  rejectTutor
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteTutor
);


module.exports = router;