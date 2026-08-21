const { pool } = require("../config/db");

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


// =========================================================
// DASHBOARD
// =========================================================

const getDashboardSummary = async (req, res) => {
  try {
    const [[institutions]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM institutions`
    );

    const [[approved]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM institutions
       WHERE status = 'approved'`
    );

    const [[pending]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM institutions
       WHERE status = 'pending'`
    );

    const [[rejected]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM institutions
       WHERE status = 'rejected'`
    );

    const [[reviews]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM reviews`
    );

    const [[teachers]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM teachers`
    );

    const [[programs]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM programs`
    );

    return res.status(200).json({
      success: true,
      data: {
        institutions: Number(institutions.total),

        approved_institutions: Number(
          approved.total
        ),

        pending_institutions: Number(
          pending.total
        ),

        rejected_institutions: Number(
          rejected.total
        ),

        reviews: Number(reviews.total),

        teachers: Number(teachers.total),

        academic_programs: Number(
          programs.total
        ),
      },
    });
  } catch (error) {
    console.error(
      "Dashboard summary error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};


// =========================================================
// CREATE INSTITUTION
// =========================================================

const createInstitution = async (req, res) => {
  const {
    name,
    institution_type,
    ownership_type,
    gender_type,
    principal_name,
    established_year,
    description,
    phone,
    email,
    website,
    address,
    area,
    city,
    district,
    province,
    country,
    latitude,
    longitude,
    student_count,
    teacher_count,
  } = req.body;

  if (!name || !institution_type || !address) {
    return res.status(400).json({
      success: false,
      message:
        "Name, institution type and address are required.",
    });
  }

  const validTypes = [
    "school",
    "college",
    "university",
    "academy",
  ];

  if (!validTypes.includes(institution_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid institution type.",
    });
  }

  // Safely convert coordinates.
  // Empty strings become NULL instead of 0 or invalid values.
  const finalLatitude =
    latitude === undefined ||
    latitude === null ||
    latitude === ""
      ? null
      : Number(latitude);

  const finalLongitude =
    longitude === undefined ||
    longitude === null ||
    longitude === ""
      ? null
      : Number(longitude);

  // Validate latitude.
  if (
    finalLatitude !== null &&
    (
      Number.isNaN(finalLatitude) ||
      finalLatitude < -90 ||
      finalLatitude > 90
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Latitude must be between -90 and 90.",
    });
  }

  // Validate longitude.
  if (
    finalLongitude !== null &&
    (
      Number.isNaN(finalLongitude) ||
      finalLongitude < -180 ||
      finalLongitude > 180
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Longitude must be between -180 and 180.",
    });
  }

  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    const baseSlug =
      createSlug(name) ||
      `institution-${Date.now()}`;

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const [existing] =
        await connection.execute(
          `SELECT id
           FROM institutions
           WHERE slug = ?
           LIMIT 1`,
          [slug]
        );

      if (existing.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const [result] =
      await connection.execute(
        `INSERT INTO institutions (
          name,
          slug,
          institution_type,
          ownership_type,
          gender_type,
          principal_name,
          established_year,
          description,
          phone,
          email,
          website,
          address,
          area,
          city,
          district,
          province,
          country,
          latitude,
          longitude,
          student_count,
          teacher_count,
          status,
          verification_status,
          created_by
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          'draft',
          'unverified',
          ?
        )`,
        [
          name.trim(),

          slug,

          institution_type,

          ownership_type ||
            "private",

          gender_type ||
            "not_specified",

          principal_name ||
            null,

          established_year ||
            null,

          description ||
            null,

          phone ||
            null,

          email ||
            null,

          website ||
            null,

          address.trim(),

          area ||
            null,

          city ||
            "Loralai",

          district ||
            "Loralai",

          province ||
            "Balochistan",

          country ||
            "Pakistan",

          finalLatitude,

          finalLongitude,

          Number(
            student_count || 0
          ),

          Number(
            teacher_count || 0
          ),

          req.user.userId,
        ]
      );

    const institutionId =
      result.insertId;

    await connection.execute(
      `INSERT INTO institution_verification (
        institution_id,
        submitted_by,
        verification_status
      )
      VALUES (?, ?, 'pending')`,
      [
        institutionId,
        req.user.userId,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,

      message:
        "Institution created successfully.",

      data: {
        id: institutionId,

        name: name.trim(),

        slug,

        institution_type,

        status: "draft",

        verification_status:
          "unverified",
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Create institution error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.sqlMessage ||
        error.message ||
        "Failed to create institution.",
    });
  } finally {
    connection.release();
  }
};


// =========================================================
// GET ALL INSTITUTIONS
// =========================================================

const getAllInstitutions = async (req, res) => {
  try {
    const [institutions] =
      await pool.execute(
        `SELECT
          id,
          name,
          slug,
          institution_type,
          ownership_type,
          gender_type,
          principal_name,
          established_year,
          phone,
          email,
          address,
          area,
          city,
          district,
          student_count,
          teacher_count,
          status,
          verification_status,
          created_at,
          updated_at
        FROM institutions
        ORDER BY created_at DESC`
      );

    return res.status(200).json({
      success: true,
      data: {
        institutions,
      },
    });
  } catch (error) {
    console.error(
      "Get institutions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load institutions.",
    });
  }
};


// =========================================================
// UPDATE INSTITUTION
// =========================================================

const updateInstitution = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    institution_type,
    ownership_type,
    gender_type,
    principal_name,
    established_year,
    description,
    phone,
    email,
    website,
    address,
    area,
    city,
    district,
    province,
    country,
    latitude,
    longitude,
    student_count,
    teacher_count,
  } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message:
        "Institution ID is required.",
    });
  }

  if (!name || !institution_type || !address) {
    return res.status(400).json({
      success: false,
      message:
        "Name, institution type and address are required.",
    });
  }

  const validTypes = [
    "school",
    "college",
    "university",
    "academy",
  ];

  if (!validTypes.includes(institution_type)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid institution type.",
    });
  }

  // Safely convert coordinates.
  const finalLatitude =
    latitude === undefined ||
    latitude === null ||
    latitude === ""
      ? null
      : Number(latitude);

  const finalLongitude =
    longitude === undefined ||
    longitude === null ||
    longitude === ""
      ? null
      : Number(longitude);

  // Validate latitude.
  if (
    finalLatitude !== null &&
    (
      Number.isNaN(finalLatitude) ||
      finalLatitude < -90 ||
      finalLatitude > 90
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Latitude must be between -90 and 90.",
    });
  }

  // Validate longitude.
  if (
    finalLongitude !== null &&
    (
      Number.isNaN(finalLongitude) ||
      finalLongitude < -180 ||
      finalLongitude > 180
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Longitude must be between -180 and 180.",
    });
  }

  try {
    const [existing] =
      await pool.execute(
        `SELECT id
         FROM institutions
         WHERE id = ?
         LIMIT 1`,
        [id]
      );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    await pool.execute(
      `UPDATE institutions
       SET
         name = ?,
         institution_type = ?,
         ownership_type = ?,
         gender_type = ?,
         principal_name = ?,
         established_year = ?,
         description = ?,
         phone = ?,
         email = ?,
         website = ?,
         address = ?,
         area = ?,
         city = ?,
         district = ?,
         province = ?,
         country = ?,
         latitude = ?,
         longitude = ?,
         student_count = ?,
         teacher_count = ?
       WHERE id = ?`,
      [
        name.trim(),

        institution_type,

        ownership_type ||
          "private",

        gender_type ||
          "not_specified",

        principal_name ||
          null,

        established_year ||
          null,

        description ||
          null,

        phone ||
          null,

        email ||
          null,

        website ||
          null,

        address.trim(),

        area ||
          null,

        city ||
          "Loralai",

        district ||
          "Loralai",

        province ||
          "Balochistan",

        country ||
          "Pakistan",

        finalLatitude,

        finalLongitude,

        Number(
          student_count || 0
        ),

        Number(
          teacher_count || 0
        ),

        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Institution updated successfully.",
    });
  } catch (error) {
    console.error(
      "Update institution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to update institution.",
    });
  }
};


// =========================================================
// APPROVE INSTITUTION
// =========================================================

const approveInstitution = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message:
        "Institution ID is required.",
    });
  }

  try {
    const [existing] =
      await pool.execute(
        `SELECT id
         FROM institutions
         WHERE id = ?
         LIMIT 1`,
        [id]
      );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    await pool.execute(
      `UPDATE institutions
       SET
         status = 'approved',
         verification_status = 'verified'
       WHERE id = ?`,
      [id]
    );

    await pool.execute(
      `UPDATE institution_verification
       SET
         verification_status = 'approved',
         reviewed_by = ?,
         reviewed_at = CURRENT_TIMESTAMP
       WHERE institution_id = ?`,
      [
        req.user.userId,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Institution approved successfully.",
    });
  } catch (error) {
    console.error(
      "Approve institution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve institution.",
    });
  }
};


// =========================================================
// PENDING REVIEWS
// =========================================================

const getPendingReviews = async (
  req,
  res
) => {
  try {
    const [reviews] =
      await pool.execute(
        `SELECT
          r.id,
          r.institution_id,
          r.user_id,
          r.rating,
          r.title,
          r.review_text,
          r.status,
          r.created_at,
          u.full_name AS reviewer_name,
          i.name AS institution_name
        FROM reviews r
        INNER JOIN users u
          ON u.id = r.user_id
        INNER JOIN institutions i
          ON i.id = r.institution_id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC`
      );

    return res.status(200).json({
      success: true,
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.error(
      "Pending reviews error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load pending reviews.",
    });
  }
};


// =========================================================
// APPROVE REVIEW
// =========================================================

const approveReview = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const [result] =
      await pool.execute(
        `UPDATE reviews
         SET
           status = 'approved',
           reviewed_by = ?,
           reviewed_at = CURRENT_TIMESTAMP
         WHERE id = ?
           AND status = 'pending'`,
        [
          req.user.userId,
          id,
        ]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pending review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Review approved successfully.",
    });
  } catch (error) {
    console.error(
      "Approve review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve review.",
    });
  }
};


// =========================================================
// REJECT REVIEW
// =========================================================

const rejectReview = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const [result] =
      await pool.execute(
        `UPDATE reviews
         SET
           status = 'rejected',
           reviewed_by = ?,
           reviewed_at = CURRENT_TIMESTAMP
         WHERE id = ?
           AND status = 'pending'`,
        [
          req.user.userId,
          id,
        ]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pending review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Review rejected successfully.",
    });
  } catch (error) {
    console.error(
      "Reject review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject review.",
    });
  }
};


// =========================================================
// GET INSTITUTION BY ID
// =========================================================

const getInstitutionById = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message:
        "Institution ID is required.",
    });
  }

  try {
    const [institutions] =
      await pool.execute(
        `SELECT
          id,
          name,
          slug,
          institution_type,
          ownership_type,
          gender_type,
          principal_name,
          established_year,
          description,
          phone,
          email,
          website,
          address,
          area,
          city,
          district,
          province,
          country,
          latitude,
          longitude,
          logo_url,
          cover_image_url,
          student_count,
          teacher_count,
          status,
          verification_status
        FROM institutions
        WHERE id = ?
        LIMIT 1`,
        [id]
      );

    if (institutions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        institution:
          institutions[0],
      },
    });
  } catch (error) {
    console.error(
      "Get institution by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load institution.",
    });
  }
};
// =========================================================
// DELETE INSTITUTION
// =========================================================

const deleteInstitution = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Institution ID is required.",
    });
  }

  try {
    const [existing] = await pool.execute(
      `SELECT
        id,
        name,
        institution_type
       FROM institutions
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Institution not found.",
      });
    }

    await pool.execute(
      `DELETE FROM institutions
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        `${existing[0].institution_type} "${existing[0].name}" deleted successfully.`,
    });
  } catch (error) {
    console.error(
      "Delete institution error:",
      error
    );

    // Foreign-key protection
    if (
      error.code ===
      "ER_ROW_IS_REFERENCED_2"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This institution still has related records. Delete its programs, teachers, facilities, fees, admissions, and other related records first.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to delete institution.",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
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
};