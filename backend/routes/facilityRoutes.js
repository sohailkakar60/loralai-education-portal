const express = require("express");

const {
  createFacility,
  getInstitutionFacilities,
  updateFacility,
  deleteFacility,
} = require("../controllers/facilityController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionFacilities
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createFacility
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateFacility
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteFacility
);

module.exports = router;