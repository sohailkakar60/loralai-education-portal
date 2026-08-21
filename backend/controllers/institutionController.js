const { pool } = require("../config/db");


// =========================================================
// VALID VALUES
// =========================================================

const VALID_INSTITUTION_TYPES = [
  "school",
  "college",
  "university",
  "academy",
];

const VALID_OWNERSHIP_TYPES = [
  "private",
  "government",
  "semi_government",
  "other",
];

const VALID_GENDER_TYPES = [
  "boys",
  "girls",
  "co_education",
  "not_specified",
];


// =========================================================
// HELPER
// =========================================================

const validateInstitutionType = (type) => {
  return VALID_INSTITUTION_TYPES.includes(type);
};


// =========================================================
// CREATE INSTITUTION
// =========================================================

const createInstitution = async (req, res) => {
  try {
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
      logo_url,
      cover_image_url,
      student_count,
      teacher_count,
    } = req.body;

    // -------------------------
    // Required fields
    // -------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Institution name is required.",
      });
    }

    if (!institution_type) {
      return res.status(400).json({
        success: false,
        message:
          "Institution type is required.",
      });
    }

    if (
      !validateInstitutionType(
        institution_type
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid institution type. Allowed types: school, college, university, academy.",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required.",
      });
    }

    // -------------------------
    // Optional validation
    // -------------------------

    const finalOwnership =
      ownership_type &&
      VALID_OWNERSHIP_TYPES.includes(
        ownership_type
      )
        ? ownership_type
        : "private";

    const finalGender =
      gender_type &&
      VALID_GENDER_TYPES.includes(
        gender_type
      )
        ? gender_type
        : "not_specified";

    const finalCity =
      city?.trim() || "Loralai";

    const finalDistrict =
      district?.trim() || "Loralai";

    const finalProvince =
      province?.trim() || "Balochistan";

    const finalCountry =
      country?.trim() || "Pakistan";

    const finalStudents = Number(
      student_count || 0
    );

    const finalTeachers = Number(
      teacher_count || 0
    );

    const finalEstablishedYear =
      established_year
        ? Number(established_year)
        : null;

    const finalLatitude =
      latitude !== null &&
      latitude !== undefined &&
      latitude !== ""
        ? Number(latitude)
        : null;

    const finalLongitude =
      longitude !== null &&
      longitude !== undefined &&
      longitude !== ""
        ? Number(longitude)
        : null;

    // -------------------------
    // Generate slug
    // -------------------------

    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug || "institution";

    let slugCounter = 1;

    while (true) {
      const [existing] =
        await pool.execute(
          `SELECT id
           FROM institutions
           WHERE slug = ?
           LIMIT 1`,
          [slug]
        );

      if (existing.length === 0) {
        break;
      }

      slug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }

    // -------------------------
    // Create institution
    // -------------------------

    const [result] =
      await pool.execute(
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
          logo_url,
          cover_image_url,
          student_count,
          teacher_count,
          status,
          verification_status,
          created_by
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, 'draft', 'unverified', ?
        )`,
        [
          name.trim(),
          slug,
          institution_type,
          finalOwnership,
          finalGender,
          principal_name?.trim() || null,
          finalEstablishedYear,
          description?.trim() || null,
          phone?.trim() || null,
          email?.trim() || null,
          website?.trim() || null,
          address.trim(),
          area?.trim() || null,
          finalCity,
          finalDistrict,
          finalProvince,
          finalCountry,
          finalLatitude,
          finalLongitude,
          logo_url?.trim() || null,
          cover_image_url?.trim() || null,
          finalStudents,
          finalTeachers,
          req.user?.userId || null,
        ]
      );

    return res.status(201).json({
      success: true,
      message: `${institution_type} created successfully.`,
      data: {
        id: result.insertId,
        slug,
        institution_type,
        status: "draft",
        verification_status:
          "unverified",
      },
    });
  } catch (error) {
    console.error(
      "CREATE INSTITUTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to create institution.",
    });
  }
};


// =========================================================
// ADMIN: GET ALL INSTITUTIONS
// =========================================================

const getAdminInstitutions = async (
  req,
  res
) => {
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
          verification_status,
          created_at,
          updated_at
        FROM institutions
        ORDER BY id DESC`
      );

    return res.status(200).json({
      success: true,
      data: {
        institutions,
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN INSTITUTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load institutions.",
    });
  }
};


// Alias for compatibility
const getAllInstitutions =
  getAdminInstitutions;


// =========================================================
// ADMIN: GET ONE INSTITUTION
// =========================================================

const getAdminInstitutionById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

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
          verification_status,
          created_at,
          updated_at
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
      "GET ADMIN INSTITUTION ERROR:",
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
// UPDATE INSTITUTION
// =========================================================

const updateInstitution = async (
  req,
  res
) => {
  try {
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
      logo_url,
      cover_image_url,
      student_count,
      teacher_count,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Institution name is required.",
      });
    }

    if (
      institution_type &&
      !validateInstitutionType(
        institution_type
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid institution type.",
      });
    }

    const [existing] =
      await pool.execute(
        `SELECT institution_type
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

    const finalType =
      institution_type ||
      existing[0].institution_type;

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
         logo_url = ?,
         cover_image_url = ?,
         student_count = ?,
         teacher_count = ?
       WHERE id = ?`,
      [
        name.trim(),
        finalType,
        ownership_type || "private",
        gender_type || "not_specified",
        principal_name?.trim() || null,
        established_year
          ? Number(established_year)
          : null,
        description?.trim() || null,
        phone?.trim() || null,
        email?.trim() || null,
        website?.trim() || null,
        address?.trim() || "",
        area?.trim() || null,
        city?.trim() || "Loralai",
        district?.trim() || "Loralai",
        province?.trim() || "Balochistan",
        country?.trim() || "Pakistan",
        latitude !== ""
          ? Number(latitude)
          : null,
        longitude !== ""
          ? Number(longitude)
          : null,
        logo_url?.trim() || null,
        cover_image_url?.trim() || null,
        Number(student_count || 0),
        Number(teacher_count || 0),
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
      "UPDATE INSTITUTION ERROR:",
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
// APPROVE
// =========================================================

const approveInstitution = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [result] =
      await pool.execute(
        `UPDATE institutions
         SET
           status = 'approved',
           verification_status = 'verified'
         WHERE id = ?`,
        [id]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Institution approved successfully.",
    });
  } catch (error) {
    console.error(
      "APPROVE INSTITUTION ERROR:",
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
// REJECT
// =========================================================

const rejectInstitution = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [result] =
      await pool.execute(
        `UPDATE institutions
         SET status = 'rejected'
         WHERE id = ?`,
        [id]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Institution rejected successfully.",
    });
  } catch (error) {
    console.error(
      "REJECT INSTITUTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject institution.",
    });
  }
};


// =========================================================
// PUBLIC INSTITUTIONS
// =========================================================

const getPublicInstitutions = async (
  req,
  res
) => {
  try {
    const {
      type,
      search,
      ownership,
      limit = 100,
    } = req.query;

    const conditions = [
      `status = 'approved'`,
      `verification_status = 'verified'`,
    ];

    const values = [];

    if (type) {
      if (
        !validateInstitutionType(type)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid institution type.",
        });
      }

      conditions.push(
        `institution_type = ?`
      );

      values.push(type);
    }

    if (ownership) {
      conditions.push(
        `ownership_type = ?`
      );

      values.push(ownership);
    }

    if (search) {
      conditions.push(`
        (
          name LIKE ?
          OR area LIKE ?
          OR city LIKE ?
          OR district LIKE ?
        )
      `);

      const searchValue =
        `%${search}%`;

      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    const safeLimit = Math.min(
      Math.max(
        Number(limit) || 100,
        1
      ),
      100
    );

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
          teacher_count
        FROM institutions
        WHERE ${conditions.join(" AND ")}
        ORDER BY name ASC
        LIMIT ${safeLimit}`,
        values
      );

    return res.status(200).json({
      success: true,
      data: {
        institutions,
      },
    });
  } catch (error) {
    console.error(
      "PUBLIC INSTITUTIONS ERROR:",
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
// PUBLIC INSTITUTION BY SLUG
// =========================================================

const getPublicInstitutionBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

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
          teacher_count
        FROM institutions
        WHERE slug = ?
          AND status = 'approved'
          AND verification_status = 'verified'
        LIMIT 1`,
        [slug]
      );

    if (institutions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });
    }

    const institution =
      institutions[0];

    // Programs
    let programs = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT *
           FROM programs
           WHERE institution_id = ?
           ORDER BY id DESC`,
          [institution.id]
        );

      programs = rows;
    } catch (error) {
      console.error(
        "Program query error:",
        error.message
      );
    }

    // Teachers
    let teachers = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT
            id,
            full_name,
            qualification,
            subject,
            specialization,
            experience_years,
            profile_photo_url
           FROM teachers
           WHERE institution_id = ?
           ORDER BY full_name ASC`,
          [institution.id]
        );

      teachers = rows;
    } catch (error) {
      console.error(
        "Teacher query error:",
        error.message
      );
    }

    // Facilities
    let facilities = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT *
           FROM facilities
           WHERE institution_id = ?
           ORDER BY id DESC`,
          [institution.id]
        );

      facilities = rows;
    } catch (error) {
      console.error(
        "Facility query error:",
        error.message
      );
    }

    // Contacts
    let contacts = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT *
           FROM contacts
           WHERE institution_id = ?
           ORDER BY is_primary DESC, id ASC`,
          [institution.id]
        );

      contacts = rows;
    } catch (error) {
      console.error(
        "Contact query error:",
        error.message
      );
    }

    // Fees
    let fees = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT *
           FROM fees
           WHERE institution_id = ?
           ORDER BY id DESC`,
          [institution.id]
        );

      fees = rows;
    } catch (error) {
      console.error(
        "Fee query error:",
        error.message
      );
    }

    // Admissions
    let admissions = [];

    try {
      const [rows] =
        await pool.execute(
          `SELECT *
           FROM admissions
           WHERE institution_id = ?
           ORDER BY id DESC`,
          [institution.id]
        );

      admissions = rows;
    } catch (error) {
      console.error(
        "Admission query error:",
        error.message
      );
    }

    return res.status(200).json({
      success: true,
      data: {
        institution,
        programs,
        teachers,
        facilities,
        contacts,
        fees,
        admissions,
      },
    });
  } catch (error) {
    console.error(
      "PUBLIC INSTITUTION DETAILS ERROR:",
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
// PUBLIC STATS
// =========================================================

const getPublicStats = async (
  req,
  res
) => {
  try {
    const [[institutions]] =
      await pool.execute(
        `SELECT COUNT(*) AS total
         FROM institutions
         WHERE status = 'approved'
           AND verification_status = 'verified'`
      );

    const [[teachers]] =
      await pool.execute(
        `SELECT COUNT(*) AS total
         FROM teachers t
         INNER JOIN institutions i
           ON i.id = t.institution_id
         WHERE i.status = 'approved'
           AND i.verification_status = 'verified'`
      );

    const [[programs]] =
      await pool.execute(
        `SELECT COUNT(*) AS total
         FROM programs p
         INNER JOIN institutions i
           ON i.id = p.institution_id
         WHERE i.status = 'approved'
           AND i.verification_status = 'verified'`
      );

    return res.status(200).json({
      success: true,
      data: {
        institutions:
          Number(institutions.total),

        teachers:
          Number(teachers.total),

        programs:
          Number(programs.total),
      },
    });
  } catch (error) {
    console.error(
      "PUBLIC STATS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load public statistics.",
    });
  }
};


// =========================================================
// PUBLIC RANKINGS
// =========================================================

const getPublicRankings = async (
  req,
  res
) => {
  try {
    const [rankings] =
      await pool.execute(
        `SELECT
          i.id,
          i.name,
          i.slug,
          i.institution_type,
          i.ownership_type,
          i.gender_type,
          i.area,
          i.city,
          i.student_count,
          i.teacher_count,
          i.logo_url,
          i.cover_image_url,

          COALESCE(
            ROUND(
              AVG(
                CASE
                  WHEN r.status = 'approved'
                  THEN r.rating
                END
              ),
              1
            ),
            0
          ) AS average_rating,

          COUNT(
            CASE
              WHEN r.status = 'approved'
              THEN r.id
            END
          ) AS review_count

        FROM institutions i

        LEFT JOIN reviews r
          ON r.institution_id = i.id

        WHERE i.status = 'approved'
          AND i.verification_status = 'verified'

        GROUP BY
          i.id,
          i.name,
          i.slug,
          i.institution_type,
          i.ownership_type,
          i.gender_type,
          i.area,
          i.city,
          i.student_count,
          i.teacher_count,
          i.logo_url,
          i.cover_image_url

        ORDER BY
          average_rating DESC,
          review_count DESC,
          i.name ASC`
      );

    return res.status(200).json({
      success: true,
      data: {
        rankings,
      },
    });
  } catch (error) {
    console.error(
      "PUBLIC RANKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load rankings.",
    });
  }
};


module.exports = {
  createInstitution,

  getAdminInstitutions,
  getAllInstitutions,

  getAdminInstitutionById,

  updateInstitution,

  approveInstitution,
  rejectInstitution,

  getPublicInstitutions,
  getPublicInstitutionBySlug,

  getPublicStats,
  getPublicRankings,
};