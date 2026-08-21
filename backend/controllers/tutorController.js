const { pool } = require("../config/db");


// =========================================================
// CREATE TUTOR
// =========================================================

const createTutor = async (req, res) => {
  const {
    full_name,
    gender,
    qualification,
    subjects,
    specialization,
    experience_years,
    phone,
    email,
    area,
    city,
    district,
    province,
    country,
    description,
    hourly_fee,
    availability,
    profile_photo_url,
  } = req.body;

  if (!full_name) {
    return res.status(400).json({
      success: false,
      message: "Tutor name is required.",
    });
  }

  const validGenders = [
    "male",
    "female",
    "other",
    "not_specified",
  ];

  const validAvailability = [
    "available",
    "busy",
    "not_available",
  ];

  if (
    gender &&
    !validGenders.includes(gender)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid gender.",
    });
  }

  if (
    availability &&
    !validAvailability.includes(availability)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid availability status.",
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO tutors (
        full_name,
        gender,
        qualification,
        subjects,
        specialization,
        experience_years,
        phone,
        email,
        area,
        city,
        district,
        province,
        country,
        description,
        hourly_fee,
        availability,
        profile_photo_url,
        status,
        verification_status,
        created_by
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, 'draft',
        'unverified', ?
      )`,
      [
        full_name.trim(),
        gender || "not_specified",
        qualification?.trim() || null,
        subjects?.trim() || null,
        specialization?.trim() || null,
        Number(experience_years || 0),
        phone?.trim() || null,
        email?.trim() || null,
        area?.trim() || null,
        city?.trim() || "Loralai",
        district?.trim() || "Loralai",
        province?.trim() || "Balochistan",
        country?.trim() || "Pakistan",
        description?.trim() || null,
        hourly_fee !== undefined &&
        hourly_fee !== null &&
        hourly_fee !== ""
          ? Number(hourly_fee)
          : null,
        availability || "available",
        profile_photo_url?.trim() || null,
        req.user.userId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Tutor created successfully.",
      data: {
        id: result.insertId,
        status: "draft",
        verification_status: "unverified",
      },
    });
  } catch (error) {
    console.error(
      "Create tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create tutor.",
    });
  }
};


// =========================================================
// GET ALL TUTORS FOR ADMIN
// =========================================================

const getAllTutors = async (req, res) => {
  try {
    const [tutors] = await pool.execute(
      `SELECT
        id,
        full_name,
        gender,
        qualification,
        subjects,
        specialization,
        experience_years,
        phone,
        email,
        area,
        city,
        district,
        province,
        country,
        description,
        hourly_fee,
        availability,
        profile_photo_url,
        status,
        verification_status,
        created_at,
        updated_at
      FROM tutors
      ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      data: {
        tutors,
      },
    });
  } catch (error) {
    console.error(
      "Get all tutors error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load tutors.",
    });
  }
};


// =========================================================
// GET ONE TUTOR FOR ADMIN
// =========================================================

const getTutorById = async (req, res) => {
  const { id } = req.params;

  try {
    const [tutors] = await pool.execute(
      `SELECT
        id,
        full_name,
        gender,
        qualification,
        subjects,
        specialization,
        experience_years,
        phone,
        email,
        area,
        city,
        district,
        province,
        country,
        description,
        hourly_fee,
        availability,
        profile_photo_url,
        status,
        verification_status,
        created_at,
        updated_at
      FROM tutors
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    if (tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        tutor: tutors[0],
      },
    });
  } catch (error) {
    console.error(
      "Get tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load tutor.",
    });
  }
};


// =========================================================
// UPDATE TUTOR
// =========================================================

const updateTutor = async (req, res) => {
  const { id } = req.params;

  const {
    full_name,
    gender,
    qualification,
    subjects,
    specialization,
    experience_years,
    phone,
    email,
    area,
    city,
    district,
    province,
    country,
    description,
    hourly_fee,
    availability,
    profile_photo_url,
  } = req.body;

  if (!full_name) {
    return res.status(400).json({
      success: false,
      message: "Tutor name is required.",
    });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE tutors
       SET
         full_name = ?,
         gender = ?,
         qualification = ?,
         subjects = ?,
         specialization = ?,
         experience_years = ?,
         phone = ?,
         email = ?,
         area = ?,
         city = ?,
         district = ?,
         province = ?,
         country = ?,
         description = ?,
         hourly_fee = ?,
         availability = ?,
         profile_photo_url = ?
       WHERE id = ?`,
      [
        full_name.trim(),
        gender || "not_specified",
        qualification?.trim() || null,
        subjects?.trim() || null,
        specialization?.trim() || null,
        Number(experience_years || 0),
        phone?.trim() || null,
        email?.trim() || null,
        area?.trim() || null,
        city?.trim() || "Loralai",
        district?.trim() || "Loralai",
        province?.trim() || "Balochistan",
        country?.trim() || "Pakistan",
        description?.trim() || null,
        hourly_fee !== undefined &&
        hourly_fee !== null &&
        hourly_fee !== ""
          ? Number(hourly_fee)
          : null,
        availability || "available",
        profile_photo_url?.trim() || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutor updated successfully.",
    });
  } catch (error) {
    console.error(
      "Update tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update tutor.",
    });
  }
};


// =========================================================
// APPROVE TUTOR
// =========================================================

const approveTutor = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.execute(
      `SELECT id
       FROM tutors
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    await pool.execute(
      `UPDATE tutors
       SET
         status = 'approved',
         verification_status = 'verified'
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Tutor approved successfully.",
    });
  } catch (error) {
    console.error(
      "Approve tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve tutor.",
    });
  }
};


// =========================================================
// REJECT TUTOR
// =========================================================

const rejectTutor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `UPDATE tutors
       SET status = 'rejected'
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutor rejected successfully.",
    });
  } catch (error) {
    console.error(
      "Reject tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject tutor.",
    });
  }
};


// =========================================================
// DELETE TUTOR
// =========================================================

const deleteTutor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `DELETE FROM tutors
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutor deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete tutor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete tutor.",
    });
  }
};


// =========================================================
// PUBLIC TUTORS
// =========================================================

const getPublicTutors = async (req, res) => {
  const {
    search,
    area,
    availability,
  } = req.query;

  const conditions = [
    "status = 'approved'",
    "verification_status = 'verified'",
  ];

  const values = [];

  if (availability) {
    conditions.push(
      "availability = ?"
    );

    values.push(availability);
  }

  if (area) {
    conditions.push(
      "area LIKE ?"
    );

    values.push(`%${area}%`);
  }

  if (search) {
    conditions.push(`
      (
        full_name LIKE ?
        OR qualification LIKE ?
        OR subjects LIKE ?
        OR specialization LIKE ?
        OR area LIKE ?
      )
    `);

    const searchValue = `%${search}%`;

    values.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue
    );
  }

  try {
    const [tutors] = await pool.execute(
      `SELECT
        id,
        full_name,
        gender,
        qualification,
        subjects,
        specialization,
        experience_years,
        area,
        city,
        district,
        description,
        hourly_fee,
        availability,
        profile_photo_url
      FROM tutors
      WHERE ${conditions.join(" AND ")}
      ORDER BY full_name ASC`,
      values
    );

    return res.status(200).json({
      success: true,
      data: {
        tutors,
      },
    });
  } catch (error) {
    console.error(
      "Public tutors error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load tutors.",
    });
  }
};


// =========================================================
// PUBLIC TUTOR DETAILS
// =========================================================

const getPublicTutorById = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const [tutors] = await pool.execute(
      `SELECT
        id,
        full_name,
        gender,
        qualification,
        subjects,
        specialization,
        experience_years,
        area,
        city,
        district,
        province,
        country,
        description,
        hourly_fee,
        availability,
        profile_photo_url
      FROM tutors
      WHERE id = ?
        AND status = 'approved'
        AND verification_status = 'verified'
      LIMIT 1`,
      [id]
    );

    if (tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        tutor: tutors[0],
      },
    });
  } catch (error) {
    console.error(
      "Public tutor details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load tutor.",
    });
  }
};


module.exports = {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  approveTutor,
  rejectTutor,
  deleteTutor,
  getPublicTutors,
  getPublicTutorById,
};