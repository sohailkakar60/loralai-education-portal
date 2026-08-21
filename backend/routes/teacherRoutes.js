const express = require("express");

const {
  createTeacher,
  getInstitutionTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionTeachers
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createTeacher
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateTeacher
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteTeacher
);

module.exports = router;