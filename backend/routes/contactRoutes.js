const express = require("express");

const {
  createContact,
  getInstitutionContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireAdmin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getInstitutionContacts
);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createContact
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateContact
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteContact
);

module.exports = router;