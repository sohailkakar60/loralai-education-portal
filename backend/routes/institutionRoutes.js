const express = require("express");

const {
  getPublicInstitutions,
  getPublicInstitutionBySlug,
  getPublicStats,
  getPublicRankings,
} = require("../controllers/institutionController");

const router = express.Router();

router.get(
  "/stats",
  getPublicStats
);

router.get(
  "/rankings",
  getPublicRankings
);

router.get(
  "/institutions",
  getPublicInstitutions
);

router.get(
  "/institutions/:slug",
  getPublicInstitutionBySlug
);

module.exports = router;