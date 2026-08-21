const express = require("express");

const {
  createProgram,
  getInstitutionPrograms,
  updateProgram,
  deleteProgram,
} = require("../controllers/programController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionPrograms
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createProgram
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateProgram
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteProgram
);

module.exports = router;