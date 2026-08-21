const express = require("express");

const {
  createFee,
  getInstitutionFees,
  updateFee,
  deleteFee,
} = require("../controllers/feeController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionFees
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createFee
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateFee
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteFee
);

module.exports = router;