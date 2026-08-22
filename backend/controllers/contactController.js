const { pool } = require("../config/db");


// =========================================================
// VALID CONTACT TYPES
// =========================================================

const VALID_CONTACT_TYPES = [
  "phone",
  "whatsapp",
  "email",
  "website",
  "facebook",
  "other",
];


// =========================================================
// CREATE CONTACT
// =========================================================

const createContact = async (
  req,
  res
) => {

  const {
    institution_id,
    contact_type,
    contact_value,
    is_primary,
  } = req.body;


  if (
    !institution_id ||
    !contact_type ||
    !contact_value ||
    !contact_value.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Institution ID, contact type and contact value are required.",
    });

  }


  if (
    !VALID_CONTACT_TYPES.includes(
      contact_type
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid contact type.",
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
        `INSERT INTO contacts (
          institution_id,
          contact_type,
          contact_value,
          is_primary
        )
        VALUES (?, ?, ?, ?)`,
        [
          institution_id,
          contact_type,
          contact_value.trim(),
          Boolean(is_primary),
        ]
      );


    return res.status(201).json({
      success: true,
      message:
        "Contact created successfully.",
      data: {
        id: result.insertId,
      },
    });


  } catch (error) {

    console.error(
      "Create contact error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to create contact.",
    });

  }

};


// =========================================================
// GET INSTITUTION CONTACTS
// =========================================================

const getInstitutionContacts =
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

      const [contacts] =
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
            contact_type ASC`,
          [institutionId]
        );


      return res.status(200).json({
        success: true,
        data: {
          contacts,
        },
      });


    } catch (error) {

      console.error(
        "Get contacts error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to load contacts.",
      });

    }

  };


// =========================================================
// UPDATE CONTACT
// =========================================================

const updateContact = async (
  req,
  res
) => {

  const { id } =
    req.params;


  const {
    contact_type,
    contact_value,
    is_primary,
  } = req.body;


  if (
    !id
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Contact ID is required.",
    });

  }


  if (
    !contact_type ||
    !contact_value ||
    !contact_value.trim()
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Contact type and contact value are required.",
    });

  }


  if (
    !VALID_CONTACT_TYPES.includes(
      contact_type
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid contact type.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `UPDATE contacts
         SET
           contact_type = ?,
           contact_value = ?,
           is_primary = ?
         WHERE id = ?`,
        [
          contact_type,
          contact_value.trim(),
          Boolean(is_primary),
          id,
        ]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Contact not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Contact updated successfully.",
    });


  } catch (error) {

    console.error(
      "Update contact error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to update contact.",
    });

  }

};


// =========================================================
// DELETE CONTACT
// =========================================================

const deleteContact = async (
  req,
  res
) => {

  const { id } =
    req.params;


  if (!id) {

    return res.status(400).json({
      success: false,
      message:
        "Contact ID is required.",
    });

  }


  try {

    const [result] =
      await pool.execute(
        `DELETE FROM contacts
         WHERE id = ?`,
        [id]
      );


    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Contact not found.",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Contact deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete contact error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Failed to delete contact.",
    });

  }

};


module.exports = {
  createContact,
  getInstitutionContacts,
  updateContact,
  deleteContact,
};