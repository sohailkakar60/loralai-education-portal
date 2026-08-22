const { pool } = require("../config/db");


// =========================================================
// CREATE FACILITY
// =========================================================

const createFacility = async (
  req,
  res
) => {

  const {
    institution_id,
    facility_name,
    description,
    available,
  } = req.body;


  if (
    !institution_id ||
    !facility_name ||
    !facility_name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution ID and facility name are required.",
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
        `INSERT INTO facilities (
          institution_id,
          facility_name,
          description,
          available
        )
        VALUES (?, ?, ?, ?)`,
        [
          institution_id,
          facility_name.trim(),
          description?.trim() ||
            null,
          available !== undefined
            ? Boolean(available)
            : true,
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Facility created successfully.",
      data: {
        id: result.insertId,
      },
    });


  } catch (error) {

    console.error(
      "Create facility error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to create facility.",
    });

  }

};


// =========================================================
// GET INSTITUTION FACILITIES
// =========================================================

const getInstitutionFacilities =
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

      const [facilities] =
        await pool.execute(
          `SELECT
            id,
            facility_name,
            description,
            available,
            created_at,
            updated_at
          FROM facilities
          WHERE institution_id = ?
          ORDER BY facility_name ASC`,
          [institutionId]
        );


      return res.status(200).json({
        success: true,
        data: {
          facilities,
        },
      });


    } catch (error) {

      console.error(
        "Get facilities error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load facilities.",
      });

    }

  };


// =========================================================
// UPDATE FACILITY
// =========================================================

const updateFacility = async (
  req,
  res
) => {

  const { id } =
    req.params;


  const {
    facility_name,
    description,
    available,
  } = req.body;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Facility ID is required.",
    });

  }


  if (
    !facility_name ||
    !facility_name.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Facility name is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `UPDATE facilities
         SET
           facility_name = ?,
           description = ?,
           available = ?
         WHERE id = ?`,
        [
          facility_name.trim(),
          description?.trim() ||
            null,
          available !== undefined
            ? Boolean(available)
            : true,
          id,
        ]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Facility not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Facility updated successfully.",
    });


  } catch (error) {

    console.error(
      "Update facility error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to update facility.",
    });

  }

};


// =========================================================
// DELETE FACILITY
// =========================================================

const deleteFacility = async (
  req,
  res
) => {

  const { id } =
    req.params;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Facility ID is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `DELETE FROM facilities
         WHERE id = ?`,
        [id]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Facility not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Facility deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete facility error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to delete facility.",
    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createFacility,
  getInstitutionFacilities,
  updateFacility,
  deleteFacility,
};