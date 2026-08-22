const { pool } = require("../config/db");


// =========================================================
// CREATE PROGRAM
// =========================================================

const createProgram = async (
  req,
  res
) => {

  const {
    institution_id,
    name,
    level,
    description,
  } = req.body;


  if (
    !institution_id ||
    !name ||
    !name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution ID and program name are required.",
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
        `INSERT INTO programs (
          institution_id,
          name,
          level,
          description
        )
        VALUES (?, ?, ?, ?)`,
        [
          institution_id,
          name.trim(),
          level?.trim() ||
            null,
          description?.trim() ||
            null,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Program created successfully.",
      data: {
        id: result.insertId,
      },
    });


  } catch (error) {

    console.error(
      "Create program error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to create program.",
    });

  }

};


// =========================================================
// GET INSTITUTION PROGRAMS
// =========================================================

const getInstitutionPrograms =
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

      const [programs] =
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
          ORDER BY name ASC`,
          [institutionId]
        );


      return res.status(200).json({
        success: true,
        data: {
          programs,
        },
      });


    } catch (error) {

      console.error(
        "Get programs error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load programs.",
      });

    }

  };


// =========================================================
// UPDATE PROGRAM
// =========================================================

const updateProgram = async (
  req,
  res
) => {

  const { id } =
    req.params;


  const {
    name,
    level,
    description,
  } = req.body;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Program ID is required.",
    });

  }


  if (
    !name ||
    !name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Program name is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `UPDATE programs
         SET
           name = ?,
           level = ?,
           description = ?
         WHERE id = ?`,
        [
          name.trim(),
          level?.trim() ||
            null,
          description?.trim() ||
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
          "Program not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Program updated successfully.",
    });


  } catch (error) {

    console.error(
      "Update program error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to update program.",
    });

  }

};


// =========================================================
// DELETE PROGRAM
// =========================================================

const deleteProgram = async (
  req,
  res
) => {

  const { id } =
    req.params;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Program ID is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `DELETE FROM programs
         WHERE id = ?`,
        [id]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Program not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Program deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete program error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to delete program.",
    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createProgram,
  getInstitutionPrograms,
  updateProgram,
  deleteProgram,
};