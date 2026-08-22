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
// HELPERS
// =========================================================

const validateInstitutionType = (type) => {
  return VALID_INSTITUTION_TYPES.includes(
    type
  );
};


const normalizeNumber = (
  value,
  fallback = null
) => {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


const createSlug = (name) => {

  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

};


// =========================================================
// CREATE INSTITUTION
// =========================================================

const createInstitution = async (
  req,
  res
) => {

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


    if (
      !name ||
      !name.trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Institution name is required.",
      });

    }


    if (
      !institution_type
    ) {

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
          "Invalid institution type.",
      });

    }


    if (
      !address ||
      !address.trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Address is required.",
      });

    }


    if (
      ownership_type &&
      !VALID_OWNERSHIP_TYPES.includes(
        ownership_type
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid ownership type.",
      });

    }


    if (
      gender_type &&
      !VALID_GENDER_TYPES.includes(
        gender_type
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid gender type.",
      });

    }


    const finalOwnership =
      ownership_type ||
      "private";


    const finalGender =
      gender_type ||
      "not_specified";


    const finalCity =
      city?.trim() ||
      "Loralai";


    const finalDistrict =
      district?.trim() ||
      "Loralai";


    const finalProvince =
      province?.trim() ||
      "Balochistan";


    const finalCountry =
      country?.trim() ||
      "Pakistan";


    const finalStudents =
      normalizeNumber(
        student_count,
        0
      );


    const finalTeachers =
      normalizeNumber(
        teacher_count,
        0
      );


    if (
      finalStudents < 0 ||
      finalTeachers < 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Student and teacher counts cannot be negative.",
      });

    }


    const finalEstablishedYear =
      normalizeNumber(
        established_year,
        null
      );


    const finalLatitude =
      normalizeNumber(
        latitude,
        null
      );


    const finalLongitude =
      normalizeNumber(
        longitude,
        null
      );


    if (
      finalLatitude !== null &&
      (
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


    if (
      finalLongitude !== null &&
      (
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


    // =======================================================
    // GENERATE UNIQUE SLUG
    // =======================================================

    const baseSlug =
      createSlug(name) ||
      `institution-${Date.now()}`;


    let slug =
      baseSlug;

    let counter = 1;


    while (true) {

      const [existing] =
        await pool.execute(
          `SELECT id
           FROM institutions
           WHERE slug = ?
           LIMIT 1`,
          [slug]
        );


      if (
        existing.length === 0
      ) {
        break;
      }


      slug =
        `${baseSlug}-${counter}`;

      counter++;

    }


    // =======================================================
    // INSERT
    // =======================================================

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
          principal_name?.trim() ||
            null,
          finalEstablishedYear,
          description?.trim() ||
            null,
          phone?.trim() ||
            null,
          email?.trim()
            .toLowerCase() ||
            null,
          website?.trim() ||
            null,
          address.trim(),
          area?.trim() ||
            null,
          finalCity,
          finalDistrict,
          finalProvince,
          finalCountry,
          finalLatitude,
          finalLongitude,
          logo_url?.trim() ||
            null,
          cover_image_url?.trim() ||
            null,
          finalStudents,
          finalTeachers,
          req.user?.userId ||
            null,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        `${institution_type} created successfully.`,

      data: {
        id:
          result.insertId,

        slug,

        institution_type,

        status:
          "draft",

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

const getAdminInstitutions =
  async (
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


const getAllInstitutions =
  getAdminInstitutions;


// =========================================================
// ADMIN: GET ONE INSTITUTION
// =========================================================

const getAdminInstitutionById =
  async (
    req,
    res
  ) => {

    try {

      const { id } =
        req.params;


      if (!id) {

        return res.status(400).json({
          success: false,
          message:
            "Institution ID is required.",
        });

      }


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


      if (
        institutions.length === 0
      ) {

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

const updateInstitution =
  async (
    req,
    res
  ) => {

    try {

      const {
        id,
      } = req.params;


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


      if (!id) {

        return res.status(400).json({
          success: false,
          message:
            "Institution ID is required.",
        });

      }


      if (
        !name ||
        !name.trim()
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Institution name is required.",
        });

      }


      if (
        !institution_type
      ) {

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
            "Invalid institution type.",
        });

      }


      if (
        !address ||
        !address.trim()
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Address is required.",
        });

      }


      if (
        ownership_type &&
        !VALID_OWNERSHIP_TYPES.includes(
          ownership_type
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid ownership type.",
        });

      }


      if (
        gender_type &&
        !VALID_GENDER_TYPES.includes(
          gender_type
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid gender type.",
        });

      }


      const [existing] =
        await pool.execute(
          `SELECT id
           FROM institutions
           WHERE id = ?
           LIMIT 1`,
          [id]
        );


      if (
        existing.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Institution not found.",
        });

      }


      const finalStudents =
        normalizeNumber(
          student_count,
          0
        );


      const finalTeachers =
        normalizeNumber(
          teacher_count,
          0
        );


      if (
        finalStudents < 0 ||
        finalTeachers < 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Student and teacher counts cannot be negative.",
        });

      }


      const finalLatitude =
        normalizeNumber(
          latitude,
          null
        );


      const finalLongitude =
        normalizeNumber(
          longitude,
          null
        );


      if (
        finalLatitude !== null &&
        (
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


      if (
        finalLongitude !== null &&
        (
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
          institution_type,
          ownership_type ||
            "private",
          gender_type ||
            "not_specified",
          principal_name?.trim() ||
            null,
          normalizeNumber(
            established_year,
            null
          ),
          description?.trim() ||
            null,
          phone?.trim() ||
            null,
          email?.trim()
            .toLowerCase() ||
            null,
          website?.trim() ||
            null,
          address.trim(),
          area?.trim() ||
            null,
          city?.trim() ||
            "Loralai",
          district?.trim() ||
            "Loralai",
          province?.trim() ||
            "Balochistan",
          country?.trim() ||
            "Pakistan",
          finalLatitude,
          finalLongitude,
          logo_url?.trim() ||
            null,
          cover_image_url?.trim() ||
            null,
          finalStudents,
          finalTeachers,
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

const approveInstitution =
  async (
    req,
    res
  ) => {

    try {

      const { id } =
        req.params;


      const [result] =
        await pool.execute(
          `UPDATE institutions
           SET
             status = 'approved',
             verification_status = 'verified'
           WHERE id = ?`,
          [id]
        );


      if (
        result.affectedRows === 0
      ) {

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

const rejectInstitution =
  async (
    req,
    res
  ) => {

    try {

      const { id } =
        req.params;


      const [result] =
        await pool.execute(
          `UPDATE institutions
           SET
             status = 'rejected',
             verification_status = 'unverified'
           WHERE id = ?`,
          [id]
        );


      if (
        result.affectedRows === 0
      ) {

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

const getPublicInstitutions =
  async (
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
          !validateInstitutionType(
            type
          )
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

        values.push(
          type
        );

      }


      if (ownership) {

        if (
          !VALID_OWNERSHIP_TYPES.includes(
            ownership
          )
        ) {

          return res.status(400).json({
            success: false,
            message:
              "Invalid ownership type.",
          });

        }


        conditions.push(
          `ownership_type = ?`
        );

        values.push(
          ownership
        );

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


      const safeLimit =
        Math.min(
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
          WHERE ${conditions.join(
            " AND "
          )}
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

const getPublicInstitutionBySlug =
  async (
    req,
    res
  ) => {

    try {

      const { slug } =
        req.params;


      if (!slug) {

        return res.status(400).json({
          success: false,
          message:
            "Institution slug is required.",
        });

      }


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


      if (
        institutions.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Institution not found.",
        });

      }


      const institution =
        institutions[0];


      // =====================================================
      // PROGRAMS
      // =====================================================

      let programs = [];


      try {

        const [rows] =
          await pool.execute(
            `SELECT
              id,
              name,
              level,
              description,
              created_at,
              updated_at
            FROM programs
            WHERE institution_id = ?
            ORDER BY id DESC`,
            [institution.id]
          );


        programs =
          rows;

      } catch (error) {

        console.error(
          "Program query error:",
          error.message
        );

      }


      // =====================================================
      // TEACHERS
      // =====================================================

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
              AND status = 'active'
            ORDER BY full_name ASC`,
            [institution.id]
          );


        teachers =
          rows;

      } catch (error) {

        console.error(
          "Teacher query error:",
          error.message
        );

      }


      // =====================================================
      // FACILITIES
      // =====================================================

      let facilities = [];


      try {

        const [rows] =
          await pool.execute(
            `SELECT
              id,
              facility_name,
              description,
              available
            FROM facilities
            WHERE institution_id = ?
            ORDER BY id DESC`,
            [institution.id]
          );


        facilities =
          rows;

      } catch (error) {

        console.error(
          "Facility query error:",
          error.message
        );

      }


      // =====================================================
      // CONTACTS
      // =====================================================

      let contacts = [];


      try {

        const [rows] =
          await pool.execute(
            `SELECT
              id,
              contact_type,
              contact_value,
              is_primary,
              created_at,
              updated_at
            FROM contacts
            WHERE institution_id = ?
            ORDER BY
              is_primary DESC,
              id ASC`,
            [institution.id]
          );


        contacts =
          rows;

      } catch (error) {

        console.error(
          "Contact query error:",
          error.message
        );

      }


      // =====================================================
      // FEES
      // =====================================================

      let fees = [];


      try {

        const [rows] =
          await pool.execute(
            `SELECT
              id,
              fee_name,
              class_name,
              amount,
              frequency,
              description,
              created_at,
              updated_at
            FROM fees
            WHERE institution_id = ?
            ORDER BY id DESC`,
            [institution.id]
          );


        fees =
          rows;

      } catch (error) {

        console.error(
          "Fee query error:",
          error.message
        );

      }


      // =====================================================
      // ADMISSIONS
      // =====================================================

      let admissions = [];


      try {

        const [rows] =
          await pool.execute(
            `SELECT
              id,
              title,
              description,
              admission_status,
              application_start_date,
              application_end_date,
              session,
              created_at,
              updated_at
            FROM admissions
            WHERE institution_id = ?
            ORDER BY id DESC`,
            [institution.id]
          );


        admissions =
          rows;

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

const getPublicStats =
  async (
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
             AND i.verification_status = 'verified'
             AND t.status = 'active'`
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
            Number(
              institutions.total
            ),

          teachers:
            Number(
              teachers.total
            ),

          programs:
            Number(
              programs.total
            ),
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

const getPublicRankings =
  async (
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


// =========================================================
// EXPORTS
// =========================================================

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