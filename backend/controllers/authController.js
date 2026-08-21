const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../config/db");


// =========================================================
// REGISTER NORMAL USER
// =========================================================

const registerUser = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
  } = req.body;

  if (!full_name || !full_name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Full name is required.",
    });
  }

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message:
        "Email or phone number is required.",
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters.",
    });
  }

  try {
    const cleanEmail =
      email?.trim().toLowerCase() || null;

    const cleanPhone =
      phone?.trim() || null;

    // Check duplicate email / phone
    const [existingUsers] =
      await pool.execute(
        `SELECT id, email, phone
         FROM users
         WHERE
           (? IS NOT NULL AND email = ?)
           OR
           (? IS NOT NULL AND phone = ?)
         LIMIT 1`,
        [
          cleanEmail,
          cleanEmail,
          cleanPhone,
          cleanPhone,
        ]
      );

    if (existingUsers.length > 0) {
      if (
        cleanEmail &&
        existingUsers[0].email === cleanEmail
      ) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
      }

      if (
        cleanPhone &&
        existingUsers[0].phone === cleanPhone
      ) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this phone number already exists.",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "An account with these details already exists.",
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const [result] =
      await pool.execute(
        `INSERT INTO users (
          full_name,
          email,
          phone,
          password_hash,
          role,
          status
        )
        VALUES (?, ?, ?, ?, 'user', 'active')`,
        [
          full_name.trim(),
          cleanEmail,
          cleanPhone,
          passwordHash,
        ]
      );

    const userId =
      result.insertId;

    const token = jwt.sign(
      {
        userId,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN ||
          "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      data: {
        user: {
          id: userId,
          full_name:
            full_name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          role: "user",
        },
        token,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Registration failed.",
    });
  }
};


// =========================================================
// LOGIN
// =========================================================

const loginUser = async (req, res) => {
  const {
    identifier,
    password,
  } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Phone/email and password are required.",
    });
  }

  try {
    const cleanIdentifier =
      identifier.trim();

    const [users] =
      await pool.execute(
        `SELECT
          id,
          full_name,
          email,
          phone,
          password_hash,
          role,
          status
         FROM users
         WHERE phone = ?
            OR email = ?
         LIMIT 1`,
        [
          cleanIdentifier,
          cleanIdentifier.toLowerCase(),
        ]
      );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid phone/email or password.",
      });
    }

    const user = users[0];

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is not active.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid phone/email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN ||
          "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          full_name:
            user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
};