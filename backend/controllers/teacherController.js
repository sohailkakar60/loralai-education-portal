const { pool } = require("../config/db");

const createTeacher = async (req, res) => {
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

  if (!institution_id || !full_name) {
    return res.status(400).json({
      success: false,
      message:
        "Institution ID and teacher name are required.",
    });
  }

  try {
    const [institution] = await pool.execute(
      `SELECT id
       FROM institutions
       WHERE id = ?
       LIMIT 1`,
      [institution_id]
    );

    if (institution.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Institution not found.",
      });
    }

    const [result] = await pool.execute(
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
        gender || "not_specified",
        qualification || null,
        subject || null,
        specialization || null,
        Number(experience_years || 0),
        phone || null,
        email || null,
        profile_photo_url || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create teacher.",
    });
  }
};


const getInstitutionTeachers = async (req, res) => {
  const { institutionId } = req.params;

  try {
    const [teachers] = await pool.execute(
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
    console.error("Get teachers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load teachers.",
    });
  }
};


const updateTeacher = async (req, res) => {
  const { id } = req.params;

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

  if (!full_name) {
    return res.status(400).json({
      success: false,
      message: "Teacher name is required.",
    });
  }

  try {
    const [result] = await pool.execute(
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
        gender || "not_specified",
        qualification || null,
        subject || null,
        specialization || null,
        Number(experience_years || 0),
        phone || null,
        email || null,
        profile_photo_url || null,
        status || "active",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
    });
  } catch (error) {
    console.error("Update teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update teacher.",
    });
  }
};


const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `DELETE FROM teachers
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
    });
  } catch (error) {
    console.error("Delete teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
    });
  }
};


module.exports = {
  createTeacher,
  getInstitutionTeachers,
  updateTeacher,
  deleteTeacher,
};