const { pool } = require("../config/db");


// =========================================================
// VALID ADMISSION STATUSES
// =========================================================

const VALID_STATUSES = [
  "open",
  "closed",
  "upcoming",
];


// =========================================================
// CREATE ADMISSION
// =========================================================

const createAdmission = async (
  req,
  res
) => {

  const {
    institution_id,
    title,
    description,
    admission_status,
    application_start_date,
    application_end_date,
    session,
  } = req.body;


  if (
    !institution_id ||
    !title ||
    !title.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution ID and admission title are required.",
    });

  }


  if (
    admission_status &&
    !VALID_STATUSES.includes(
      admission_status
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid admission status.",
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
        `INSERT INTO admissions (
          institution_id,
          title,
          description,
          admission_status,
          application_start_date,
          application_end_date,
          session
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          institution_id,
          title.trim(),
          description?.trim() ||
            null,
          admission_status ||
            "upcoming",
          application_start_date ||
            null,
          application_end_date ||
            null,
          session?.trim() ||
            null,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Admission created successfully.",
      data: {
        id: result.insertId,
      },
    });


  } catch (error) {

    console.error(
      "Create admission error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to create admission.",
    });

  }

};


// =========================================================
// GET INSTITUTION ADMISSIONS
// =========================================================

const getInstitutionAdmissions =
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

      const [admissions] =
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
          ORDER BY created_at DESC`,
          [institutionId]
        );


      return res.status(200).json({
        success: true,
        data: {
          admissions,
        },
      });


    } catch (error) {

      console.error(
        "Get admissions error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load admissions.",
      });

    }

  };


// =========================================================
// UPDATE ADMISSION
// =========================================================

const updateAdmission =
  async (
    req,
    res
  ) => {

    const { id } =
      req.params;


    const {
      title,
      description,
      admission_status,
      application_start_date,
      application_end_date,
      session,
    } = req.body;


    if (
      !id
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Admission ID is required.",
      });

    }


    if (
      !title ||
      !title.trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Admission title is required.",
      });

    }


    if (
      admission_status &&
      !VALID_STATUSES.includes(
        admission_status
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid admission status.",
      });

    }


    try {

      const [result] =
        await pool.execute(
          `UPDATE admissions
           SET
             title = ?,
             description = ?,
             admission_status = ?,
             application_start_date = ?,
             application_end_date = ?,
             session = ?
           WHERE id = ?`,
          [
            title.trim(),
            description?.trim() ||
              null,
            admission_status ||
              "upcoming",
            application_start_date ||
              null,
            application_end_date ||
              null,
            session?.trim() ||
              null,
            id,
          ]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Admission not found.",
        });

      }


      return res.status(200).json({
        success: true,
        message:
          "Admission updated successfully.",
      });


    } catch (error) {

      console.error(
        "Update admission error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          error.sqlMessage ||
          error.message ||
          "Failed to update admission.",
      });

    }

  };


// =========================================================
// DELETE ADMISSION
// =========================================================

const deleteAdmission =
  async (
    req,
    res
  ) => {

    const { id } =
      req.params;


    if (!id) {

      return res.status(400).json({
        success: false,
        message:
          "Admission ID is required.",
      });

    }


    try {

      const [result] =
        await pool.execute(
          `DELETE FROM admissions
           WHERE id = ?`,
          [id]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Admission not found.",
        });

      }


      return res.status(200).json({
        success: true,
        message:
          "Admission deleted successfully.",
      });


    } catch (error) {

      console.error(
        "Delete admission error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          error.sqlMessage ||
          error.message ||
          "Failed to delete admission.",
      });

    }

  };


module.exports = {
  createAdmission,
  getInstitutionAdmissions,
  updateAdmission,
  deleteAdmission,
};