const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const express = require("express");
const cors = require("cors");

const {
  testDatabaseConnection,
} = require("./config/db");


// =========================================================
// ROUTES
// =========================================================

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const programRoutes = require("./routes/programRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const contactRoutes = require("./routes/contactRoutes");
const feeRoutes = require("./routes/feeRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const newsRoutes = require("./routes/newsRoutes");


// =========================================================
// APP
// =========================================================

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;


// =========================================================
// CORS
// =========================================================

// Keep this simple for local development.
app.use(
  cors()
);


// =========================================================
// BODY PARSER
// =========================================================

app.use(
  express.json({
    limit: "1mb",
  })
);


// =========================================================
// HEALTH CHECK
// =========================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "Loralai Education Portal API is running.",
    });

  }
);


// =========================================================
// AUTHENTICATION
// =========================================================

app.use(
  "/api/auth",
  authRoutes
);


// =========================================================
// ADMIN
// =========================================================

app.use(
  "/api/admin",
  adminRoutes
);


// =========================================================
// PUBLIC INSTITUTIONS
// =========================================================

app.use(
  "/api/public",
  institutionRoutes
);


// =========================================================
// REVIEWS
// =========================================================

app.use(
  "/api/reviews",
  reviewRoutes
);


// =========================================================
// ACADEMIC PROGRAMS
// =========================================================

app.use(
  "/api/programs",
  programRoutes
);


// =========================================================
// TEACHERS
// =========================================================

app.use(
  "/api/teachers",
  teacherRoutes
);


// =========================================================
// FACILITIES
// =========================================================

app.use(
  "/api/facilities",
  facilityRoutes
);


// =========================================================
// CONTACTS
// =========================================================

app.use(
  "/api/contacts",
  contactRoutes
);


// =========================================================
// FEES
// =========================================================

app.use(
  "/api/fees",
  feeRoutes
);


// =========================================================
// ADMISSIONS
// =========================================================

app.use(
  "/api/admissions",
  admissionRoutes
);


// =========================================================
// TUTORS
// =========================================================

app.use(
  "/api/tutors",
  tutorRoutes
);


// =========================================================
// NEWS
// =========================================================

app.use(
  "/api/news",
  newsRoutes
);


// =========================================================
// 404
// =========================================================

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,
      message:
        "API endpoint not found.",
    });

  }
);


// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Server error:",
      error
    );


    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });

  }
);


// =========================================================
// START SERVER
// =========================================================

app.listen(
  PORT,
  async () => {

    console.log(
      `Loralai Education Portal API running on http://localhost:${PORT}`
    );

    await testDatabaseConnection();

  }
);