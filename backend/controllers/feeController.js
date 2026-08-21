const { pool } = require("../config/db");

const createFee = async (req, res) => {
  const {
    institution_id,
    fee_name,
    class_name,
    amount,
    frequency,
    description,
  } = req.body;

  if (!institution_id || !fee_name) {
    return res.status(400).json({
      success: false,
      message:
        "Institution ID and fee name are required.",
    });
  }

  const validFrequencies = [
    "one_time",
    "monthly",
    "quarterly",
    "annual",
    "other",
  ];

  if (
    frequency &&
    !validFrequencies.includes(frequency)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid fee frequency.",
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
      `INSERT INTO fees (
        institution_id,
        fee_name,
        class_name,
        amount,
        frequency,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        institution_id,
        fee_name.trim(),
        class_name || null,
        Number(amount || 0),
        frequency || "monthly",
        description || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Fee created successfully.",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error(
      "Create fee error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create fee.",
    });
  }
};


const getInstitutionFees = async (
  req,
  res
) => {
  const { institutionId } = req.params;

  try {
    const [fees] = await pool.execute(
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
      ORDER BY fee_name ASC`,
      [institutionId]
    );

    return res.status(200).json({
      success: true,
      data: {
        fees,
      },
    });
  } catch (error) {
    console.error(
      "Get fees error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load fees.",
    });
  }
};


const updateFee = async (
  req,
  res
) => {
  const { id } = req.params;

  const {
    fee_name,
    class_name,
    amount,
    frequency,
    description,
  } = req.body;

  if (!fee_name) {
    return res.status(400).json({
      success: false,
      message: "Fee name is required.",
    });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE fees
       SET
         fee_name = ?,
         class_name = ?,
         amount = ?,
         frequency = ?,
         description = ?
       WHERE id = ?`,
      [
        fee_name.trim(),
        class_name || null,
        Number(amount || 0),
        frequency || "monthly",
        description || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Fee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee updated successfully.",
    });
  } catch (error) {
    console.error(
      "Update fee error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update fee.",
    });
  }
};


const deleteFee = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `DELETE FROM fees
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Fee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete fee error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete fee.",
    });
  }
};


module.exports = {
  createFee,
  getInstitutionFees,
  updateFee,
  deleteFee,
};