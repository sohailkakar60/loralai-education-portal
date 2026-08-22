const { pool } = require("../config/db");


// =========================================================
// VALID VALUES
// =========================================================

const VALID_GENDERS = [
  "male",
  "female",
  "other",
  "not_specified",
];

const VALID_STATUSES = [
  "active",
  "inactive",
];


// =========================================================
// CREATE TEACHER
// =========================================================

const createTeacher = async (
  req,
  res
) => {

  const {
    institution_id,
    full_name,
    gender,
    qualification,
    subject,
    specialization,
    experience_years,
    phone,
    email,
    profile_photo_url,
  } = req.body;


  if (
    !institution_id ||
    !full_name ||
    !full_name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution ID and teacher name are required.",
    });

  }


  if (
    gender &&
    !VALID_GENDERS.includes(
      gender
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid gender value.",
    });

  }


  const experience =
    Number(
      experience_years ?? 0
    );


  if (
    !Number.isFinite(
      experience
    ) ||
    experience < 0
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Experience years must be a valid non-negative number.",
    });

  }


  try {

    const [institution] =
      await pool.execute(
        `SELECT id
         FROM institutions
         WHERE id = ?
         LIMIT 1`,
        [institution_id]
      );


    if (
      institution.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Institution not found.",
      });

    }


    const [result] =
      await pool.execute(
        `INSERT INTO teachers (
          institution_id,
          full_name,
          gender,
          qualification,
          subject,
          specialization,
          experience_years,
          phone,
          email,
          profile_photo_url,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          institution_id,
          full_name.trim(),
          gender ||
            "not_specified",
          qualification?.trim() ||
            null,
          subject?.trim() ||
            null,
          specialization?.trim() ||
            null,
          experience,
          phone?.trim() ||
            null,
          email?.trim()
            .toLowerCase() ||
            null,
          profile_photo_url?.trim() ||
            null,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Teacher created successfully.",
      data: {
        id: result.insertId,
      },
    });


  } catch (error) {

    console.error(
      "Create teacher error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to create teacher.",
    });

  }

};


// =========================================================
// GET INSTITUTION TEACHERS
// =========================================================

const getInstitutionTeachers =
  async (
    req,
    res
  ) => {

    const {
      institutionId,
    } = req.params;


    if (!institutionId) {

      return res.status(400).json({
        success: false,
        message:
          "Institution ID is required.",
      });

    }


    try {

      const [teachers] =
        await pool.execute(
          `SELECT
            id,
            full_name,
            gender,
            qualification,
            subject,
            specialization,
            experience_years,
            phone,
            email,
            profile_photo_url,
            status,
            created_at,
            updated_at
           FROM teachers
           WHERE institution_id = ?
           ORDER BY full_name ASC`,
          [institutionId]
        );


      return res.status(200).json({
        success: true,
        data: {
          teachers,
        },
      });


    } catch (error) {

      console.error(
        "Get teachers error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load teachers.",
      });

    }

  };


// =========================================================
// UPDATE TEACHER
// =========================================================

const updateTeacher = async (
  req,
  res
) => {

  const { id } =
    req.params;


  const {
    full_name,
    gender,
    qualification,
    subject,
    specialization,
    experience_years,
    phone,
    email,
    profile_photo_url,
    status,
  } = req.body;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Teacher ID is required.",
    });

  }


  if (
    !full_name ||
    !full_name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Teacher name is required.",
    });

  }


  if (
    gender &&
    !VALID_GENDERS.includes(
      gender
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid gender value.",
    });

  }


  if (
    status &&
    !VALID_STATUSES.includes(
      status
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid teacher status.",
    });

  }


  const experience =
    Number(
      experience_years ?? 0
    );


  if (
    !Number.isFinite(
      experience
    ) ||
    experience < 0
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Experience years must be a valid non-negative number.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `UPDATE teachers
         SET
           full_name = ?,
           gender = ?,
           qualification = ?,
           subject = ?,
           specialization = ?,
           experience_years = ?,
           phone = ?,
           email = ?,
           profile_photo_url = ?,
           status = ?
         WHERE id = ?`,
        [
          full_name.trim(),
          gender ||
            "not_specified",
          qualification?.trim() ||
            null,
          subject?.trim() ||
            null,
          specialization?.trim() ||
            null,
          experience,
          phone?.trim() ||
            null,
          email?.trim()
            .toLowerCase() ||
            null,
          profile_photo_url?.trim() ||
            null,
          status ||
            "active",
          id,
        ]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Teacher not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Teacher updated successfully.",
    });


  } catch (error) {

    console.error(
      "Update teacher error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to update teacher.",
    });

  }

};


// =========================================================
// DELETE TEACHER
// =========================================================

const deleteTeacher = async (
  req,
  res
) => {

  const { id } =
    req.params;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Teacher ID is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `DELETE FROM teachers
         WHERE id = ?`,
        [id]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Teacher not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Teacher deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete teacher error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to delete teacher.",
    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createTeacher,
  getInstitutionTeachers,
  updateTeacher,
  deleteTeacher,
};