const express = require("express");

const {
  createAdmission,
  getInstitutionAdmissions,
  updateAdmission,
  deleteAdmission,
} = require("../controllers/admissionController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionAdmissions
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createAdmission
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateAdmission
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteAdmission
);

module.exports = router;